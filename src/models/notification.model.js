import Joi from 'joi'
import { ObjectID } from 'mongodb'
import { getDB } from '../config/mongodb'
// Define Tag collection
const notificationCollectionName = 'notifications'
const notificationCollectionSchema = Joi.object({
    comicID: Joi.string().required(),
    userID: Joi.string().required(),
    chap: Joi.number().required(),
    content: Joi.string().required(),
    createAt: Joi.date().timestamp().default(Date.now()),
    updateAt: Joi.date().timestamp().default(null),
    seen: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await notificationCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const validatedData = {
            ...value,
            comicID: ObjectID(value.comicID),
            userID: ObjectID(value.userID)
        }
        const result = await getDB().collection(notificationCollectionName).insertOne(validatedData)
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const updateStatus = async (userID, data) => {
    try {

        const result = await getDB().collection(notificationCollectionName).updateMany(
            { userID: ObjectID(userID) },
            { $set: data },
            { returnOriginal: false }
        )
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const remove = async (id) => {
    try {

        const result = await getDB().collection(notificationCollectionName).deleteOne(
            { _id: ObjectID(id) }
        )
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const removeWithComic = async (comicID, chap) => {
    try {
        if (comicID && !chap) {
            const result = await getDB().collection(notificationCollectionName).deleteMany({
                comicID: ObjectID(comicID)
            })
            return result
        }
        if (comicID && chap) {
            const result = await getDB().collection(notificationCollectionName).deleteMany({
                comicID: ObjectID(comicID),
                chap: chap
            })
            return result
        }
    } catch (error) {
        throw new Error(error)
    }
}

const getNotifications = async (userID, page) => {
    try {
        const arr = await getDB().collection(notificationCollectionName).aggregate([
            { $match: { userID: ObjectID(userID) } },
            {
                $lookup: {
                    from: 'comics',
                    localField: 'comicID',
                    foreignField: '_id',
                    as: 'comic'
                }
            }, {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$comic', 0 ] }, '$$ROOT' ] } }
            },
            { $project: { comic: 0, title2: 0, updateAt: 0, tagID: 0, description: 0, author: 0, status: 0, views: 0, _destroy: 0 } }
        ]).sort({ createAt: -1 }).toArray()
        const yet = arr.filter(item => item.seen !== true)
        const end = page*12
        const result = arr.slice(0, end)
        return { notifications: result, quantityPage: Math.ceil(arr.length/12), yet: yet.length }
    } catch (error) {
        throw new Error(error)
    }
}

export const NotificationModel = {
    createNew,
    updateStatus,
    remove,
    getNotifications,
    removeWithComic
}