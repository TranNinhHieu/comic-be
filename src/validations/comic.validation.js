import Joi from 'joi'
import { HttpStatusCode } from '../utilities/constants'

const createNew = async (req, res, next) => {
    const condition = Joi.object({
        title: Joi.string().required().min(3).max(100).trim(),
        description: Joi.string().default('Đang cập nhật'),
        tagID: Joi.array().items(Joi.string()).required(),
        thumbnail: Joi.string().required(),
        author: Joi.string().default('Đang cập nhật')
    })
    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(error).message
        })
    }
}

const update = async (req, res, next) => {
    const condition = Joi.object({
        title: Joi.string().min(3).max(100).trim(),
        description: Joi.string().default('Đang cập nhật'),
        tagID: Joi.array().items(Joi.string()),
        thumbnail: Joi.string(),
        author: Joi.string().default('Đang cập nhật')
    })
    try {
        await condition.validateAsync(req.body, {
            abortEarly: false,
            allowUnknown: true
        })
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(error).message
        })
    }
}

export const ComicValidation = {
    createNew, update
}