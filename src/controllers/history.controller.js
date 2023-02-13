import { HistoryService } from '../services/history.service'
import { HttpStatusCode } from '../utilities/constants'

const addHistory = async (req, res) => {
    try {
        const result = await HistoryService.addHistory(req.body)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }

}

const getHistory = async (req, res) => {
    try {
        const { page } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await HistoryService.getHistory(_id, page)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }

}

const removeHistory = async (req, res) => {
    try {
        const { comicID, chap } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await HistoryService.removeHistory(_id, comicID, chap)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }

}

const removeAllHistory = async (req, res) => {
    try {
        const { _id } = req.jwtDecoded.data
        const result = await HistoryService.removeAllHistory(_id)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }

}

export const HistoryController = {
    getHistory,
    addHistory,
    removeHistory,
    removeAllHistory
}