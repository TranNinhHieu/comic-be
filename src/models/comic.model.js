import Joi from 'joi'
import { ObjectID } from 'mongodb'
import { getDB } from '../config/mongodb'
import { formatViToEn, titleCase } from '../utilities/formatData'
import { ChapterModel } from './chapter.model'
import { NotificationModel } from './notification.model'
// Define Comic collection
const comicCollectionName = 'comics'
const comicCollectionSchema = Joi.object({
    number: Joi.number().default(0),
    title: Joi.string().required().min(3).max(100).trim(),
    title2: Joi.string().default('').trim(),
    description: Joi.string().default('Đang cập nhật'),
    tagID: Joi.array().items(Joi.string()).required(),
    thumbnail: Joi.string().required(),
    author: Joi.string().default('Đang cập nhật'),
    status: Joi.string().default('Chưa hoàn thành'),
    views: Joi.number().default(0),
    createAt: Joi.date().timestamp().default(Date.now()),
    updateAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await comicCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const title = titleCase(value.title)
        const title2 = formatViToEn(value.title)
        const tagID = value.tagID.map(tag => ObjectID(tag))
        const valueValidated = {
            ...value,
            title: title,
            title2: title2,
            tagID: tagID,
            createAt: Date.now()
        }
        const result = await getDB().collection(comicCollectionName).insertOne(valueValidated)
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        const result = await getDB().collection(comicCollectionName).findOneAndUpdate(
            { _id: ObjectID(id) },
            { $set: data },
            { returnOriginal: false }
        )
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const getComic = async (page) => {
    try {

        const listComic = await getDB().collection(comicCollectionName)
            .find({ _destroy: false })
            .project({
                number: 1,
                title: 1,
                thumbnail: 1,
                createAt: 1
            })
            .sort({ createAt: -1 }).toArray()
        const begin = (page - 1)*12
        const end = page*12
        let result = listComic.slice(begin, end)
        
        if(Number(page)===0 ){ 
            const comics= await getDB().collection(comicCollectionName).find({ _destroy: false }).toArray()
            result=comics }
        const number = await getDB().collection(comicCollectionName).count()
        return { comics: result, quantityComic: number }

    } catch (error) {
        throw new Error(error)
    }
}

const getDetailComic = async (id) => {
    try {
        const comic = await getDB().collection(comicCollectionName).aggregate([
            { $match: { _id: ObjectID(id), _destroy: false } },
            { $project: { updateAt: 0, _destroy: 0 } },
            {
                $lookup: {
                    from: 'tags',
                    localField: 'tagID',
                    foreignField: '_id',
                    as: 'tags'
                }
            },
            { $project: { tagID: 0 } }
        ]).toArray()
        return comic[0]
    } catch (error) {
        throw new Error(error)
    }
}

const getAllComicOfTag = async (tagID) => {
    try {
        const listComic = await getDB().collection(comicCollectionName)
            .find(
                {
                    tagID: ObjectID(tagID),
                    _destroy: false
                },
                { projection: { number: 1, title: 1, thumbnail: 1, createAt: 1 } }).sort({ createAt: -1 }).toArray()
        // const begin = (page-1)*12
        // const end = page*12
        // .slice(begin, end)
        const result = listComic
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getQuantityPage = async (tagID) => {
    try {

        let quantity = 0
        if (tagID === undefined) {
            const listComic = await getDB().collection(comicCollectionName).find({ _destroy: false }).count()
            quantity = Math.ceil(listComic/12)
        } else {
            if (tagID == 0) {
                const listComic = await getDB().collection(comicCollectionName).find({ tagID: ObjectID('616af71268f59ad44354b30f'), _destroy: false }).count()
                quantity = Math.ceil(listComic/12)
            } else {
                const listComic = await getDB().collection(comicCollectionName).find({ tagID: ObjectID(tagID), _destroy: false }).count()
                quantity = Math.ceil(listComic/12)
            }
        }
        return quantity
    } catch (error) {
        throw new Error(error)
    }
}

const getFollownLike = async (comicID) => {
    try {
        const follow = await getDB().collection(comicCollectionName).aggregate([
            { $match: { _id: ObjectID(comicID), _destroy: false } },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'follow',
                    as: 'quantity'
                }
            }, {
                $unwind: '$quantity'
            }
        ]).toArray()

        const like = await getDB().collection(comicCollectionName).aggregate([
            { $match: { _id: ObjectID(comicID), _destroy: false } },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'like',
                    as: 'quantity'
                }
            }, {
                $unwind: '$quantity'
            }
        ]).toArray()

        const comment = await getDB().collection('comments').find({
            comicID: ObjectID(comicID)
        }).count()

        return { likes: like.length, follows: follow.length, comments: comment }
    } catch (error) {
        throw new Error(error)
    }
}

const getUnfinishedComics = async () => {
    try {
        const result = getDB().collection(comicCollectionName).find({
            status: 'Chưa hoàn thành',
            _destroy: false
        }, { projection: { number: 1, title: 1, thumbnail: 1, createAt: 1 } }).sort({ createAt: -1 }).toArray()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getRemovedComics = async (page) => {
    try {
        const comics = getDB().collection(comicCollectionName).find({
            _destroy: true
        }, { projection: { number: 1, title: 1, thumbnail: 1 } }).sort({ updateAt: -1 }).toArray()

        const begin = (page-1)*24
        const end = page*24
        const result = comics.slice(begin, end)
        return { comics: result, quatitypage:  Math.ceil(comics.length/12) }
    } catch (error) {
        throw new Error(error)
    }
}

const softRemove = async (id) => {
    try {
        const comic = await getDB().collection(comicCollectionName).findOneAndUpdate(
            { _id: ObjectID(id) },
            { $set: { 'updateAt': Date.now(), '_destroy': true } },
            { returnOriginal: false }
        )
        const chapters = await ChapterModel.updateMany(id)
        await NotificationModel.removeWithComic(id, null)

        return { comic, chapters }

    } catch (error) {
        throw new Error(error)
    }
}

const remove = async (id) => {
    try {
        const comic = await getDB().collection(comicCollectionName).deleteOne({
            _id: ObjectID(id),
            _destroy: true
        })
        const chapter = await getDB().collection('chapters').deleteMany({
            comicID: id
        })
        return { comic: comic, chapter: chapter }
    } catch (error) {
        throw new Error
    }
}

const removeAll = async () => {
    try {
        const result = await getDB().collection(comicCollectionName).deleteMany({ _destroy: true })
        return result
    } catch (error) {
        throw new Error
    }
}

const search = async (key, page) => {
    try {
        if (key === '')
            return { comics: [], quantityPage: 0 }
        key = key.trim()
        const comics = await getDB().collection(comicCollectionName).find({
            title2: new RegExp(key, 'i'),
            _destroy: false
        }, { projection: { number: 1, title: 1, thumbnail: 1, createAt: 1 } }).sort({ createAt: -1 }).toArray()

        const end = page*12
        let result = comics.slice(0, end)
        if(Number(page) ===0){
            result = comics
        }
        return { comics: result, quantityPage:  Math.ceil(comics.length/12) }
    } catch (error) {
        throw new Error(error)
    }
}

export const ComicModel = {
    createNew,
    update,
    getComic,
    getDetailComic,
    getAllComicOfTag,
    getQuantityPage,
    getFollownLike,
    getUnfinishedComics,
    getRemovedComics,
    remove,
    removeAll,
    search,
    softRemove
}