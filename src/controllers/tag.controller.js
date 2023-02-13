import { TagService } from '../services/tag.service'
import { HttpStatusCode } from '../utilities/constants'

const createNew = async (req, res) => {
    try {
        const result = await TagService.createNew(req.body)

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
        const result = await TagService.update(id, req.body)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getAllTag = async (req, res) => {
    try {
        const result = await TagService.getAllTag()

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getDetailTag = async (req, res) => {
    try {

        const { id } = req.params
        const result = await TagService.getDetailTag(id)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const TagController = {
    createNew,
    update,
    getAllTag,
    getDetailTag
}