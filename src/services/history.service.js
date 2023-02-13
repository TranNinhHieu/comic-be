import { ObjectID } from 'mongodb'
import { getDB } from '../config/mongodb'
import { HistoryModel } from '../models/history.model'

const addHistory = async (data) => {
    try {
        const checkExist = await getDB().collection('histories').findOne({
            userID: ObjectID(data.userID),
            comicID: ObjectID(data.comicID),
            chap: data.chap*1
        })
        if (checkExist)
            return null
        const result = await HistoryModel.addHistory(data)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

const getHistory = async (userID, page) => {
    try {

        const result = await HistoryModel.getHistory(userID, page)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

const removeHistory = async (userID, comicID, chap) => {
    try {
        const data = {
            updateAt: Date.now(),
            _destroy: true
        }
        const result = await HistoryModel.removeHistory(userID, comicID, chap, data)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

const removeAllHistory = async (userID) => {
    try {
        const result = await HistoryModel.removeAllHistory(userID)
        return result
    } catch (error) {
        throw new Error(error)
    }

}

export const HistoryService = {
    getHistory,
    addHistory,
    removeHistory,
    removeAllHistory
}