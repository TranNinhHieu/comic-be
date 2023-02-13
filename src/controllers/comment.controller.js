import { CommentService } from '../services/comment.service'
import { HttpStatusCode } from '../utilities/constants'

const postComment = async (req, res) => {
    try {
        const result = await CommentService.postComment(req.body)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }

}

const updateComment = async (req, res) => {
    try {
        const { id } = req.params
        const result = await CommentService.updateComment(id, req.body)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }

}

const removeComment = async (req, res) => {
    try {
        const { id } = req.query
        const result = await CommentService.removeComment(id)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }

}

const getComments = async (req, res) => {
    try {
        const { comicID, page } = req.query
        const result = await CommentService.getComments(comicID, page)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const CommentController = {
    postComment,
    updateComment,
    removeComment,
    getComments
}