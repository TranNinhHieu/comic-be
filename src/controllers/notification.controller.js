import { NotificationService } from '../services/notification.service'
import { HttpStatusCode } from '../utilities/constants'

const updateStatus = async (req, res) => {
    try {
        const { _id } = req.jwtDecoded.data
        const result = await NotificationService.updateStatus(_id, req.body)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getNotifications = async (req, res) => {
    try {
        const { page } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await NotificationService.getNotifications(_id, page)

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
        const result = await NotificationService.remove(id)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const NotificationController = {
    updateStatus,
    getNotifications,
    remove
}