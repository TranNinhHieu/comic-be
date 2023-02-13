import Joi from 'joi'
import { HttpStatusCode } from '../utilities/constants'

const addHistory = async (req, res, next) => {
    const condition = Joi.object({
        comicID: Joi.string().required(),
        userID: Joi.string().required(),
        chap: Joi.number().required(),
        createAt: Joi.date().timestamp().default(Date.now()),
        updateAt: Joi.date().timestamp().default(null),
        _destroy: Joi.boolean().default(false)
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

export const HistoryValidation = {
    addHistory
}