import Joi from 'joi'
import { HttpStatusCode } from '../utilities/constants'

const postComment = async (req, res, next) => {
    const condition = Joi.object({
        comicID: Joi.string().required(),
        userID: Joi.string().required(),
        content: Joi.string().required().min(1).trim()
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

const updateComment = async (req, res, next) => {
    const condition = Joi.object({
        content: Joi.string().required().min(1).trim()
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

export const CommentValidation = {
    postComment,
    updateComment
}