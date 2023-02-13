import { ComicModel } from '../models/comic.model'
import { ObjectID } from 'mongodb'
import { getDB } from '../config/mongodb'
import { formatViToEn, titleCase } from '../utilities/formatData'

const comicCollectionName = 'comics'

const createNew = async (data) => {
    try {
        const number = await getDB().collection(comicCollectionName).count()
        data.number = number + 1
        const result = await ComicModel.createNew(data)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        let updataData = {}
        if (data.title) {
            data.title = titleCase(data.title)
            updataData = {
                ...data,
                title2: formatViToEn(data.title),
                updateAt: Date.now()
            }
        } else {
            if (data.tagID) {
                const tagID = data.tagID.map(tag => ObjectID(tag))
                updataData = {
                    ...data,
                    tagID: tagID,
                    updateAt: Date.now()
                }
            } else
                updataData = {
                    ...data,
                    updateAt: Date.now()
                }
        }
        const result = await ComicModel.update(id, updataData)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getComic = async (page) => {
    try {
        const result = await ComicModel.getComic(page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getDetailComic = async (id) => {
    try {
        const result = await ComicModel.getDetailComic(id)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getAllComicOfTag = async (tagID, page) => {
    try {
        const result = await ComicModel.getAllComicOfTag(tagID, page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getQuantityPage = async (tagID) => {
    try {
        const result = await ComicModel.getQuantityPage(tagID)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getFollownLike = async (comicID) => {
    try {
        const result = await ComicModel.getFollownLike(comicID)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getUnfinishedComics = async () => {
    try {
        const result = await ComicModel.getUnfinishedComics()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getRemovedComics = async (page) => {
    try {
        const result = await ComicModel.getRemovedComics(page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const softRemove = async (id) => {
    try {
        const result = await ComicModel.softRemove(id)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const remove = async (id) => {
    try {
        const result = await ComicModel.remove(id)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const removeAll = async () => {
    try {
        const result = await ComicModel.removeAll()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const search = async (key, page) => {
    try {
        const result = await ComicModel.search(key, page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const ComicService = {
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