import { ChapterModel } from '../models/chapter.model'
import { getDB } from '../config/mongodb'

const chapterCollectionName = 'chapters'

const createNew = async (data) => {
    try {
        if (data.chap*1 <= 0)
            return undefined
        else {
            const checkExist = await getDB().collection(chapterCollectionName).findOne({
                comicID: data.comicID, chap: data.chap*1, _destroy: false
            })
            if (checkExist)
                return null
            data.chap = data.chap*1
        }
        const result = await ChapterModel.createNew(data)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        const updateData = {
            ...data,
            updateAt: Date.now()
        }
        const result = await ChapterModel.update(id, updateData)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getAllChapterOfComic = async (comicID) => {
    try {
        const result = await ChapterModel.getAllChapterOfComic(comicID)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getFullChapter = async (comicID, chap) => {
    try {
        const result = await ChapterModel.getFullChapter(comicID, chap)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getQuantityChapter = async (comicID) => {
    try {
        const result = await ChapterModel.getQuantityChapter(comicID)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getNewComics = async () => {
    try {
        const result = await ChapterModel.getNewComics()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const ChapterService = {
    createNew,
    update,
    getAllChapterOfComic,
    getFullChapter,
    getQuantityChapter,
    getNewComics
}