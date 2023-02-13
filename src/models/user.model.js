import Joi from 'joi'
import bcrypt from 'bcrypt'
import { ObjectID } from 'mongodb'
import { getDB } from '../config/mongodb'
// Define user collection
const userCollectionName = 'users'
const userCollectionSchema = Joi.object({
    name: Joi.string().required().min(5).max(50).trim(),
    email: Joi.string().required().min(15).max(50).trim(),
    password: Joi.string().required().min(8),
    avatar: Joi.string().default('https://res.cloudinary.com/no-music-no-life/image/upload/v1637370860/avatar-user-higico_dfrmov.jpg'),
    isAdmin: Joi.boolean().default(false),
    like: Joi.array().items(Joi.string()).default([]),
    follow: Joi.array().items(Joi.string()).default([]),
    createAt: Joi.date().timestamp().default(Date.now()),
    updateAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await userCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const valueValidated = {
            ...value,
            createAt: Date.now()
        }
        await getDB().collection(userCollectionName).insertOne(valueValidated)
        return 'Successfull verified!'
    } catch (error) {
        throw new Error(error)
    }

}

const update = async (id, data) => {
    try {
        const result = await getDB().collection(userCollectionName).findOneAndUpdate(
            { _id: ObjectID(id) },
            { $set: data },
            { returnOriginal: false }
        )
        return result
    } catch (error) {
        throw new Error(error)
    }

}

const login = async (data) => {
    try {

        let user = await getDB().collection(userCollectionName).findOne(
            { email: data.email, _destroy: false })
        if (!user) return null
        const isMatch = await bcrypt.compare(data.password, user.password)
        if (!isMatch)
            return undefined
        else {
            const userInfo = { _id: user._id, isAdmin: user.isAdmin }
            return userInfo
        }

    } catch (error) {
        throw new Error(error)
    }
}

const getFullUser = async (id) => {
    try {
        const userData = await getDB().collection(userCollectionName).findOne(
            { _id: ObjectID(id), _destroy: false },
            { projection: { name: 1, email: 1, avatar: 1, isAdmin: 1 } } )
        return userData
    } catch (error) {
        throw new Error(error)
    }
}

const likeStatus = async (userID, comicID) => {
    try {
        const result = await getDB().collection(userCollectionName).findOne({
            _id: ObjectID(userID),
            like: ObjectID(comicID),
            _destroy: false
        })
        if (result)
            return true
        else
            return false
    } catch (error) {
        throw new Error(error)
    }
}

const followStatus = async (userID, comicID) => {
    try {
        const result = await getDB().collection(userCollectionName).findOne({
            _id: ObjectID(userID),
            follow: ObjectID(comicID),
            _destroy: false
        })
        if (result)
            return true
        else
            return false
    } catch (error) {
        throw new Error(error)
    }
}

const updateLikeComic = async (userID, comicID) => {
    try {
        let result = null
        const checkExist = await getDB().collection(userCollectionName).findOne({
            _id: ObjectID(userID),
            like: ObjectID(comicID),
            _destroy: false
        })
        if (checkExist)
            result = await getDB().collection(userCollectionName).findOneAndUpdate(
                { _id: ObjectID(userID), _destroy: false },
                { $pull: { like: ObjectID(comicID) } },
                { returnOriginal: false }
            )
        else
            result = await getDB().collection(userCollectionName).findOneAndUpdate(
                { _id: ObjectID(userID), _destroy: false },
                { $push: { like: ObjectID(comicID) } },
                { returnOriginal: false }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const updateFollowComic = async (userID, comicID) => {
    try {
        let result = null
        const checkExist = await getDB().collection(userCollectionName).findOne({
            _id: ObjectID(userID),
            follow: ObjectID(comicID),
            _destroy: false
        })
        if (checkExist)
            result = await getDB().collection(userCollectionName).findOneAndUpdate(
                { _id: ObjectID(userID), _destroy: false },
                { $pull: { follow: ObjectID(comicID) } },
                { returnOriginal: false }
            )
        else
            result = await getDB().collection(userCollectionName).findOneAndUpdate(
                { _id: ObjectID(userID), _destroy: false },
                { $push: { follow: ObjectID(comicID) } },
                { returnOriginal: false }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getLikedComics = async (userID, page) => {
    try {
        const userData = await getDB().collection(userCollectionName).aggregate([
            { $match: { _id: ObjectID(userID), _destroy: false } },
            { $unwind: { path: '$like' } },
            { $project: { _id: 0, like: 1 } },
            {
                $lookup: {
                    from: 'comics',
                    let: { liked: '$like' },
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { $eq: [ '$_id', '$$liked'] },
                                        { $eq : [ '$_destroy', false] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1, number: 1, title: 1, thumbnail: 1, createAt: 1 } }
                    ],
                    as: 'liked'
                }
            }, {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$liked', 0 ] }, '$$ROOT' ] } }
            },
            { $project: { liked: 0, like: 0 } }
        ]).toArray()

        const begin = (page-1)*12
        const end = page*12
        const result = userData.slice(begin, end)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getFollowedComics = async (userID, page) => {
    try {
        const userData = await getDB().collection(userCollectionName).aggregate([
            { $match: { _id: ObjectID(userID), _destroy: false } },
            { $unwind: { path: '$follow' } },
            { $project: { _id: 0, follow: 1 } },
            {
                $lookup: {
                    from: 'comics',
                    let: { followed: '$follow' },
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { $eq: [ '$_id', '$$followed'] },
                                        { $eq : [ '$_destroy', false] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1, number: 1, title: 1, thumbnail: 1, createAt: 1 } }
                    ],
                    as: 'followed'
                }
            }, {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$followed', 0 ] }, '$$ROOT' ] } }
            },
            { $project: { followed: 0, follow: 0 } }
        ]).toArray()

        const begin = (page-1)*12
        const end = page*12
        const result = userData.slice(begin, end)
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const getQuantityPageLikedComics = async (userID) => {
    try {

        let quantity = 0
        const result = await getDB().collection(userCollectionName).aggregate([
            { $match: { _id: ObjectID(userID), _destroy: false } },
            { $unwind: { path: '$like' } },
            { $project: { _id: 0, like: 1 } },
            {
                $lookup: {
                    from: 'comics',
                    let: { liked: '$like' },
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { $eq: [ '$_id', '$$liked'] },
                                        { $eq : [ '$_destroy', false] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1, number: 1, title: 1, thumbnail: 1, createAt: 1 } }
                    ],
                    as: 'liked'
                }
            }, {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$liked', 0 ] }, '$$ROOT' ] } }
            },
            { $project: { liked: 0, like: 0 } }
        ]).toArray()
        quantity = Math.ceil(result.length/12)
        return quantity

    } catch (error) {
        throw new Error(error)
    }
}

const getQuantityPageFollowedComics = async (userID) => {
    try {
        let quantity = 0
        const result = await getDB().collection(userCollectionName).aggregate([
            { $match: { _id: ObjectID(userID), _destroy: false } },
            { $unwind: { path: '$follow' } },
            { $project: { _id: 0, follow: 1 } },
            {
                $lookup: {
                    from: 'comics',
                    let: { followed: '$follow' },
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { $eq: [ '$_id', '$$followed'] },
                                        { $eq : [ '$_destroy', false] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1, number: 1, title: 1, thumbnail: 1, createAt: 1 } }
                    ],
                    as: 'followed'
                }
            }, {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$followed', 0 ] }, '$$ROOT' ] } }
            },
            { $project: { followed: 0, follow: 0 } }
        ]).toArray()

        quantity = Math.ceil(result.length/12)
        return quantity


    } catch (error) {
        throw new Error(error)
    }
}

const getAllUsers = async () => {
    try {
        const result = await getDB().collection(userCollectionName).find(
            { isAdmin: false, _destroy: false },
            { projection: { name: 1, email: 1, createAt: 1, updateAt: 1 } }).toArray()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const UserModel = {
    login,
    getFullUser,
    createNew,
    update,
    likeStatus,
    followStatus,
    updateLikeComic,
    updateFollowComic,
    getLikedComics,
    getFollowedComics,
    getQuantityPageFollowedComics,
    getQuantityPageLikedComics,
    getAllUsers
}