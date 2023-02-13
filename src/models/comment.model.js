import Joi from 'joi'
import { ObjectID } from 'mongodb'
import { getDB } from '../config/mongodb'
// Define comment collection
const commentCollectionName = 'comments'
const commentCollectionSchema = Joi.object({
    comicID: Joi.string().required(),
    userID: Joi.string().required(),
    content: Joi.string().required().min(1),
    createAt: Joi.date().timestamp().default(Date.now()),
    updateAt: Joi.date().timestamp().default(Date.now())
})

const validateSchema = async (data) => {
    return await commentCollectionSchema.validateAsync(data, { abortEarly: false })
}

const postComment = async (data) => {
    try {
        const validatedValue = await validateSchema(data)
        const insertValue = {
            ...validatedValue,
            comicID: ObjectID(validatedValue.comicID),
            userID: ObjectID(validatedValue.userID),
            createAt: Date.now(),
            updateAt: Date.now()
        }
        const result = await getDB().collection(commentCollectionName).insertOne(insertValue)
        return result
    } catch (error) {
        throw new Error
    }
}

const updateComment = async (id, data) => {
    try {
        const result = await getDB().collection(commentCollectionName).findOneAndUpdate(
            { _id: ObjectID(id) },
            { $set: data },
            { returnOriginal: false })
        return result
    } catch (error) {
        throw new Error
    }
}

const removeComment = async (id) => {
    try {
        const result = await getDB().collection(commentCollectionName).deleteOne({
            _id: ObjectID(id)
        })
        return result
    } catch (error) {
        throw new Error
    }
}

const getComments = async (comicID, page) => {
    try {
        const listComment = await getDB().collection(commentCollectionName).aggregate([
            { $match: { comicID: ObjectID(comicID) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userID',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $project: { userID: 1, content: 1, 'user.name': 1, 'user.avatar': 1, createAt: 1 } },
            { $sort: { createAt: -1 } }
        ]).toArray()
        const begin = (page - 1)*12
        const end = page*12
        const result = listComment.slice(begin, end)
        return result
    } catch (error) {
        throw new Error
    }
}

export const CommentModel = {
    postComment,
    updateComment,
    removeComment,
    getComments

}