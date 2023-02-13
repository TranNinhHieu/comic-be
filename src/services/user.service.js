import { getDB } from '../config/mongodb'
import { UserModel } from '../models/user.model'

const createNew = async (data) => {
    try {
        const result = await UserModel.createNew(data)
        return result
    } catch (error) {
        throw new Error(error)
    }

}
const login = async (data) => {
    try {
        const result = await UserModel.login(data)
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const getFullUser = async (id) => {
    try {
        const userData = await UserModel.getFullUser(id)
        return userData
    } catch (error) {
        throw new Error(error)
    }
}

const checkExist = async (email) => {
    try {
        const result = await getDB().collection('users').findOne(
            { email: email, _destroy: false },
            { projection: { _id: 1 } }
        )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getLikedComics = async (userID, page) => {
    try {
        const result = await UserModel.getLikedComics(userID, page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getFollowedComics = async (userID, page) => {
    try {
        const result = await UserModel.getFollowedComics(userID, page)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getQuantityPageLikedComics = async (userID) => {
    try {
        const result = await UserModel.getQuantityPageLikedComics(userID)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getQuantityPageFollowedComics = async (userID) => {
    try {
        const result = await UserModel.getQuantityPageFollowedComics(userID)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getAllUsers = async () => {
    try {
        const result = await UserModel.getAllUsers()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const UserService = {
    login,
    getFullUser,
    checkExist,
    createNew,
    getLikedComics,
    getFollowedComics,
    getQuantityPageFollowedComics,
    getQuantityPageLikedComics,
    getAllUsers
}
