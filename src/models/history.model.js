import Joi from 'joi'
import { ObjectID } from 'mongodb'
import { getDB } from '../config/mongodb'
// Define history collection
const historyCollectionName = 'histories'
const historyCollectionSchema = Joi.object({
    comicID: Joi.string().required(),
    userID: Joi.string().required(),
    chap: Joi.number().required(),
    createAt: Joi.date().timestamp().default(Date.now()),
    updateAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await historyCollectionSchema.validateAsync(data, { abortEarly: false })
}

const addHistory = async (data) => {
    try {
        const validatedValue = await validateSchema(data)
        const insertValue = {
            ...validatedValue,
            comicID: ObjectID(validatedValue.comicID),
            userID: ObjectID(validatedValue.userID),
            createAt: Date.now()
        }
        const result = await getDB().collection(historyCollectionName).insertOne(insertValue)
        return result
    } catch (error) {
        throw new Error
    }
}

const getHistory = async (userID, page) => {
    try {
        const history = await getDB().collection(historyCollectionName).aggregate([
            { $match: { userID: ObjectID(userID), _destroy: false } },
            {
                $lookup: {
                    from: 'comics',
                    localField: 'comicID',
                    foreignField: '_id',
                    as: 'image'
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$image', 0 ] }, '$$ROOT' ] } }
            },
            { $project: { image: 0, description: 0, tagID: 0, author: 0, status: 0, views: 0, createAt: 0, updateAt: 0, _destroy: 0 } }
        ]).sort({ createAt: -1 }).toArray()
        const begin = (page-1)*24
        const end = page*24
        const result = history
        return { comics: result, quatitypage:  Math.ceil(history.length/12) }
    } catch (error) {
        throw new Error
    }
}

const removeHistory = async (userID, comicID, chap) => {
    try {
        const result = await getDB().collection(historyCollectionName).deleteOne({
            userID: ObjectID(userID),
            comicID: ObjectID(comicID),
            chap: chap*1
        })
        return result
    } catch (error) {
        throw new Error
    }
}

const removeAllHistory = async (userID) => {
    try {
        const result = await getDB().collection(historyCollectionName).deleteMany({ userID: ObjectID(userID) })
        return result
    } catch (error) {
        throw new Error
    }
}

export const HistoryModel = {
    addHistory,
    getHistory,
    removeHistory,
    removeAllHistory
}