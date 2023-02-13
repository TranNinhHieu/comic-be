import { TagModel } from '../models/tag.model'
import { getDB } from '../config/mongodb'

const tagCollectionName = 'tags'

const createNew = async (data) => {
    try {
        const checkExist = await getDB().collection(tagCollectionName).findOne({ name: data.name, _destroy: false })
        if (checkExist)
            return null
        else {
            const result = await TagModel.createNew(data)
            return result
        }

    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        const result = await TagModel.update(id, data)
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const getAllTag = async () => {
    try {
        const result = await TagModel.getAllTag()
        return result

    } catch (error) {
        throw new Error(error)
    }
}

const getDetailTag = async (id) => {
    try {
        const result = await TagModel.getDetailTag(id)
        return result

    } catch (error) {
        throw new Error(error)
    }
}


export const TagService = {
    createNew,
    update,
    getAllTag,
    getDetailTag
}