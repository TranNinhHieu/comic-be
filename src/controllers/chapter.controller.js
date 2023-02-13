import { ChapterService } from '../services/chapter.service'
import { HttpStatusCode } from '../utilities/constants'

const createNew = async (req, res) => {
    try {
        const result = await ChapterService.createNew(req.body)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params
        const result = await ChapterService.update(id, req.body)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getAllChapterOfComic = async (req, res) => {
    try {
        const { comicID } = req.query
        const result = await ChapterService.getAllChapterOfComic(comicID)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getFullChapter = async (req, res) => {
    try {
        const { comicID, chap } = req.query
        const result = await ChapterService.getFullChapter(comicID, chap)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getQuantityChapter = async (req, res) => {
    try {
        const { comicID } = req.params
        const result = await ChapterService.getQuantityChapter(comicID)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getNewComics = async (req, res) => {
    try {

        const result = await ChapterService.getNewComics()

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const ChapterController = {
    createNew,
    update,
    getAllChapterOfComic,
    getFullChapter,
    getQuantityChapter,
    getNewComics
}