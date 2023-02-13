import { NotificationModel } from '../models/notification.model'

const createNew = async (data) => {
    try {
        const result = await NotificationModel.createNew(data)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

const updateStatus = async (userID, data) => {
    try {
        const updateData = {
            ...data,
            seen: true,
            updateAt: Date.now()
        }
        const result = await NotificationModel.updateStatus(userID, updateData)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

const getNotifications = async (userID, page) => {
    try {

        const result = await NotificationModel.getNotifications(userID, page)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

const remove = async (id) => {
    try {
        const result = await NotificationModel.remove(id)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

export const NotificationService = {
    createNew,
    updateStatus,
    getNotifications,
    remove
}