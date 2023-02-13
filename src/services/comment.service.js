import { CommentModel } from '../models/comment.model'

const postComment = async (data) => {
    try {
        const result = await CommentModel.postComment(data)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

const updateComment = async (id, data) => {
    try {
        const updateData = {
            ...data,
            updateAt: Date.now()
        }
        const result = await CommentModel.updateComment(id, updateData)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

const removeComment = async (id) => {
    try {
        const result = await CommentModel.removeComment(id)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

const getComments = async (comicID, page) => {
    try {
        const result = await CommentModel.getComments(comicID, page)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

export const CommentService = {
    postComment,
    updateComment,
    removeComment,
    getComments
}