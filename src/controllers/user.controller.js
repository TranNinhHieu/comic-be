import { UserService } from '../services/user.service'
import { HttpStatusCode } from '../utilities/constants'
import { env } from '../config/enviroment'
import { jwtHelper } from '../helpers/jwt.helper'
import { mailHelper } from '../helpers/mail.helper'
import { OAuth2Client } from 'google-auth-library'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/user.model'
import { generatePassword } from '../utilities/generatePassword'

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID)
const CLIENT_URL = process.env.NODE_ENV === 'production' ? 'https://comic-riverdev-api.herokuapp.com' : 'http://localhost:8080'

const login = async (req, res) => {
    try {
        const userData = await UserService.login(req.body)
        if (userData !== null && userData !== undefined) {
            try {
                const accessToken = await jwtHelper.generateToken(userData, env.ACCESS_TOKEN_SECRET, env.ACCESS_TOKEN_LIFE)
                const refreshToken = await jwtHelper.generateToken(userData, env.REFRESH_TOKEN_SECRET, env.REFRESH_TOKEN_LIFE)
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    path: '/v1/user/refresh-token',
                    maxAge: 7*24*60*60*1000,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    secure: process.env.NODE_ENV === 'production' ? true : false
                })
                res.status(HttpStatusCode.OK).json({ accessToken })
            } catch (error) {
                return res.status(HttpStatusCode.INTERNAL_SERVER).json(error)
            }
        }

        if (userData === null)
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                error: true,
                message: 'Email does not exist!'
            })
        if (userData === undefined)
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                error: true,
                message: 'Username or Password is Wrong.'
            })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const refreshToken = async (req, res) => {

    const token = req.cookies.refreshToken
    if (token) {
        try {
            const decoded = await jwtHelper.verifyToken(token, env.REFRESH_TOKEN_SECRET)

            const userData = decoded.data

            const accessToken = await jwtHelper.generateToken(userData, env.ACCESS_TOKEN_SECRET, env.ACCESS_TOKEN_LIFE)

            return res.status(200).json({ accessToken })
        } catch (error) {

            res.status(403).json({
                message: 'Invalid refresh token.'
            })
        }
    } else {

        return res.status(403).send({
            message: 'No token provided.'
        })
    }
}

const getFullUser = async (req, res) => {
    try {
        const { _id } = req.jwtDecoded.data
        const userData = await UserService.getFullUser(_id)
        res.status(HttpStatusCode.OK).json(userData)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const logout = async (req, res) => {

    try {
        res.clearCookie('refreshToken', { path: '/v1/user/refresh-token' })
        res.status(HttpStatusCode.OK).json({ message: 'Logged out!' })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: error.message })
    }
}

const googleLogin = async (req, res) => {

    const { tokenId } = req.body
    const verify = await client.verifyIdToken({ idToken: tokenId, audience: env.GOOGLE_CLIENT_ID })
    const { email_verified, email, name, picture } = verify.payload

    const password = email + env.GOOGLE_SECRET
    const passwordHash = await bcrypt.hash(password, 12)

    if (!email_verified) return res.status(400).json({ message: 'Email verification failed.' })

    let data = ({ email: email, password: password })

    try {
        let userData = await UserService.login(data)
        if (userData !== null && userData !== undefined) {
            try {
                const accessToken = await jwtHelper.generateToken(userData, env.ACCESS_TOKEN_SECRET, env.ACCESS_TOKEN_LIFE)
                const refreshToken = await jwtHelper.generateToken(userData, env.REFRESH_TOKEN_SECRET, env.REFRESH_TOKEN_LIFE)
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    path: '/v1/user/refresh-token',
                    maxAge: 7*24*60*60*1000,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    secure: process.env.NODE_ENV === 'production' ? true : false
                })
                return res.status(HttpStatusCode.OK).json({ accessToken, refreshToken })
            } catch (error) {
                return res.status(HttpStatusCode.INTERNAL_SERVER).json(error)
            }
        }

        if (userData === null ) {
            data = ({ name: name, email: email, password: passwordHash, avatar: picture })
            await UserService.createNew(data)
            userData = await UserService.checkExist(email)
            try {
                const accessToken = await jwtHelper.generateToken(userData, env.ACCESS_TOKEN_SECRET, env.ACCESS_TOKEN_LIFE)
                const refreshToken = await jwtHelper.generateToken(userData, env.REFRESH_TOKEN_SECRET, env.REFRESH_TOKEN_LIFE)
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    path: '/v1/user/refresh-token',
                    maxAge: 7*24*60*60*1000,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    secure: process.env.NODE_ENV === 'production' ? true : false
                })
                return res.status(HttpStatusCode.OK).json({ accessToken, refreshToken })
            } catch (error) {
                return res.status(HttpStatusCode.INTERNAL_SERVER).json(error)
            }
        }

        if (userData === undefined)
            return res.status(HttpStatusCode.OK).json({ message: 'Incorrect password!' })

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const { _id } = req.jwtDecoded.data
        const data = {
            ...req.body,
            updateAt: Date.now()
        }
        const result = await UserModel.update(_id, data)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const likeStatus = async (req, res) => {
    try {
        const { comicID } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await UserModel.likeStatus(_id, comicID)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const followStatus = async (req, res) => {
    try {
        const { comicID } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await UserModel.followStatus(_id, comicID)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const updateLikeComic = async (req, res) => {
    try {
        const { comicID } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await UserModel.updateLikeComic(_id, comicID)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const updateFollowComic = async (req, res) => {
    try {
        const { comicID } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await UserModel.updateFollowComic(_id, comicID)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getLikedComics = async (req, res) => {
    try {
        const { page } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await UserService.getLikedComics(_id, page)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getFollowedComics = async (req, res) => {
    try {
        const { page } = req.query
        const { _id } = req.jwtDecoded.data
        const result = await UserService.getFollowedComics(_id, page)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getQuantityPageLikedComics = async (req, res) => {
    try {
        const { _id } = req.jwtDecoded.data
        const result = await UserService.getQuantityPageLikedComics(_id)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getQuantityPageFollowedComics = async (req, res) => {
    try {
        const { _id } = req.jwtDecoded.data
        const result = await UserService.getQuantityPageFollowedComics(_id)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const register = async (req, res) => {
    try {

        const passwordHash = await bcrypt.hash(req.body.password, 12)

        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: passwordHash
        }

        const activationToken = await jwtHelper.createActiveToken(newUser, env.ACTIVE_TOKEN_SECRET, env.ACTIVE_TOKEN_LIFE)
        const url = `${CLIENT_URL}/v1/user/verify-email`

        mailHelper.sendMail(req.body.email, url, activationToken)

        res.status(HttpStatusCode.OK).json({ message: 'Register success! Please activate your email to start.' })

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const verifyEmail = async (req, res) => {
    try {

        const { verify } = req.body

        const decode = await jwtHelper.verifyToken(verify, env.ACTIVE_TOKEN_SECRET)
        const userData = decode.data
        const checkUser = await UserService.checkExist(userData.email)

        if (!checkUser)
            await UserModel.createNew(userData)
        res.redirect('https://comic-riverdev-web.web.app/login')

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body

        const checkUser = await UserService.checkExist(email)

        if (!checkUser)
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'This email does not exist!' })

        const password = generatePassword()
        const passwordHash = await bcrypt.hash(password, 12)
        await UserModel.update(checkUser._id, { password: passwordHash })
        mailHelper.sendMail(email, null, password)
        res.status(HttpStatusCode.OK).json({ message: 'Password has been reset, check email to take it !' })

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {

        const { password, confirmPassword } = req.body
        const { _id } = req.jwtDecoded.data

        if ( password.length < 8 || confirmPassword.length < 8 )
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: 'Password must be at least 8 characters !'
            })
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: 'Password must have number, uppercase letter, lowercase letter and specical character !'
            })
        if (password !== confirmPassword)
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: 'Confirm password does not match !'
            })

        const passwordHash = await bcrypt.hash(password, 12)
        await UserModel.update(_id, { password: passwordHash })
        res.status(HttpStatusCode.OK).json({ message: 'Password has been changed!' })


    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const removeUser = async (req, res) => {
    try {
        const { userID } = req.body
        const data = {
            updateAt: Date.now(),
            _destroy: true
        }
        const result = await UserModel.update(userID, data)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const result = await UserService.getAllUsers()
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const UserController = {
    login,
    refreshToken,
    getFullUser,
    googleLogin,
    logout,
    update,
    likeStatus,
    followStatus,
    updateLikeComic,
    updateFollowComic,
    getLikedComics,
    getFollowedComics,
    getQuantityPageFollowedComics,
    getQuantityPageLikedComics,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    removeUser,
    getAllUsers
}