import Joi from 'joi'
import { ObjectID } from 'mongodb'
import { getDB } from '../config/mongodb'
import { NotificationModel } from './notification.model'
// Define Chapter collection
const chapterCollectionName = 'chapters'
const chapterCollectionSchema = Joi.object({
    comicID: Joi.string().required(),
    chap: Joi.number().required(),
    image: Joi.array().items(Joi.string()).required(),
    createAt: Joi.date().timestamp().default(Date.now()),
    updateAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await chapterCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const valueValidated = {
            ...value,
            createAt: Date.now()
        }

        const userArr = await getDB().collection('users').find({
            follow: ObjectID(valueValidated.comicID),
            _destroy: false
        }).toArray()

        const comic = await getDB().collection('comics').findOne({
            _id: ObjectID(valueValidated.comicID),
            _destroy: false
        })

        userArr.map( async (user) => {
            const notification = {
                comicID: valueValidated.comicID,
                userID: user._id.toString(),
                chap: valueValidated.chap,
                content: `<b>${comic.title}</b> đã thêm chương mới.`
            }
            await NotificationModel.createNew(notification)
        })

        const result = await getDB().collection(chapterCollectionName).insertOne(valueValidated)
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        const result = await getDB().collection(chapterCollectionName).findOneAndUpdate(
            { _id: ObjectID(id) },
            { $set: data },
            { returnOriginal: false }
        )
        if (data._destroy === true) {
            const chapter = await getDB().collection(chapterCollectionName).findOne(
                { _id: ObjectID(id), _destroy: true })
            await NotificationModel.removeWithComic(chapter.comicID, chapter.chap)
        }
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const getAllChapterOfComic = async (comicID) => {
    try {
        const result = await getDB().collection(chapterCollectionName).find(
            { comicID: comicID, _destroy: false },
            { projection: { comicID: 1, chap: 1, createAt: 1, updateAt: 1 } }
        ).sort({ chap: 1 }).toArray()
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const getFullChapter = async (comicID, chap) => {
    try {
        const [chapter, comic] = await Promise.all([
            await getDB().collection(chapterCollectionName).findOne(
                { comicID: comicID, chap: parseInt(chap), _destroy: false },
                { projection: { chap: 1, image: 1 } }
            ),
            await getDB().collection('comics').findOne(
                { _id: ObjectID(comicID), _destroy: false },
                { projection: { _id: 0, number: 1, title: 1 } }
            )])

        const result = { ...chapter, ...comic }

        return result

    } catch (error) {
        throw new Error(error)
    }
}

const getQuantityChapter = async (comicID) => {
    try {
        const result = await getDB().collection(chapterCollectionName).find(
            { comicID: comicID, _destroy: false }
        ).count()

        return result

    } catch (error) {
        throw new Error(error)
    }
}

const getNewComics = async () => {
    try {
        const result = await getDB().collection(chapterCollectionName).aggregate([
            { $match: { _destroy: false } },
            {
                $lookup: {
                    from: 'comics',
                    let: { comic:{ $toObjectId: '$comicID' }, destroy: '$_destroy' },
                    pipeline: [
                        { $match: {
                            $expr: { $eq: ['$_id', '$$comic'] },
                            _destroy: false
                        }
                        },
                        { $project: { _id: 0, number: 1, title: 1, author: 1, thumbnail: 1 } }
                    ],
                    as: 'comicInfo'
                }
            },
            { $unwind: { path: '$comicInfo', preserveNullAndEmptyArrays: true } },
            { $project: { comicID: 1, chap: 1, createAt: 1, comicInfo: 1 } },
            { $sort: { createAt: -1, chap: -1 } },
            { $limit: 10 }
        ]).toArray()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const updateMany = async (comicID) => {
    try {
        const result = await getDB().collection(chapterCollectionName).updateMany(
            { comicID: comicID },
            { $set: { 'updateAt': Date.now(), '_destroy': true } },
            { returnOriginal: false }
        )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const ChapterModel = {
    createNew,
    update,
    getAllChapterOfComic,
    getFullChapter,
    getQuantityChapter,
    getNewComics,
    updateMany
}