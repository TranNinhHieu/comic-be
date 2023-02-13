import { ComicService } from '../services/comic.service'
import { HttpStatusCode } from '../utilities/constants'

const createNew = async (req, res) => {
    try {
        const result = await ComicService.createNew(req.body)

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
        const result = await ComicService.update(id, req.body)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getComic = async (req, res) => {
    try {
        const { page } = req.query
        const result = await ComicService.getComic(page)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getDetailComic = async (req, res) => {
    try {
        const { id } = req.params
        const result = await ComicService.getDetailComic(id)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getAllComicOfTag = async (req, res) => {
    try {
        const { tagID } = req.query
        const result = await ComicService.getAllComicOfTag(tagID)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getQuantityPage = async (req, res) => {
    try {

        const { tagID } = req.query
        const result = await ComicService.getQuantityPage(tagID)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getFollownLike = async (req, res) => {
    try {
        const { id } = req.params
        const result = await ComicService.getFollownLike(id)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getUnfinishedComics = async (req, res) => {
    try {
        const result = await ComicService.getUnfinishedComics()
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getRemovedComics = async (req, res) => {
    try {
        const { page } = req.params
        const result = await ComicService.getRemovedComics(page)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const softRemove = async (req, res) => {
    try {
        const { id } = req.params
        const result = await ComicService.softRemove(id)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params
        const result = await ComicService.remove(id)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const removeAll = async (req, res) => {
    try {
        const result = await ComicService.removeAll()

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const search = async (req, res) => {
    try {
        const { key, page } = req.query
        const result = await ComicService.search(key, page)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const ComicController = {
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