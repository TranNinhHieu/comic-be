import { UserService } from '../services/user.service'
import { HttpStatusCode } from '../utilities/constants'
import { validateEmail } from '../utilities/formatData'

const login = (req, res, next) => {

    try {
        const { email, password } = req.body
        // return 400 status if username/password is not exist
        if (!email || !password) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                error: true,
                message: 'Username or Password required.'
            })
        } else
        if (password.length < 8)
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                error: true,
                message: 'Password must be at least 8 charaters.'
            })
        else next()
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

const register = async (req, res, next) => {

    try {
        const { email, password, confirmPassword, name } = req.body

        if (!email || !password || !confirmPassword || !name) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                error: true,
                message: 'Please fill in all fields!'
            })
        } else {
            const exist = await UserService.checkExist(email)
            if (exist)
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    error: true,
                    message: 'Email already exists!'
                })
            if (password.length < 8)
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    error: true,
                    message: 'Password must be at least 8 charaters!'
                })
            if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    error: true,
                    message: 'Password must have number, uppercase letter, lowercase letter and specical character!'
                })
            if (password !== confirmPassword)
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    error: true,
                    message: 'Confirm password not match!'
                })
            if (name.length < 5)
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    error: true,
                    message: 'Name must be at least 5 charaters!'
                })
            if (!validateEmail(email))
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    error: true,
                    message: 'Invalid email!'
                })
        }
        next()
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            errors: error.message
        })
    }
}

export const UserValidation = {
    login,
    register
}