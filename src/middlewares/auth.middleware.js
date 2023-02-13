import { env } from '../config/enviroment'
import { jwtHelper } from '../helpers/jwt.helper'
import { HttpStatusCode } from '../utilities/constants'

const isAuth = async (req, res, next) => {

    // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
    const tokenFromClient = req.body.token || req.query.token || req.headers['x-access-token']

    if (tokenFromClient) {
        // Nếu tồn tại token
        try {
        // Thực hiện giải mã token xem có hợp lệ hay không?
            const decoded = await jwtHelper.verifyToken(tokenFromClient, env.ACCESS_TOKEN_SECRET)

            // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
            req.jwtDecoded = decoded
            // Cho phép req đi tiếp sang controller.
            next()
        } catch (error) {
        // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:

            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                message: 'Unauthorized.'
            })
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.'
        })
    }
}

export const AuthMiddleware = { isAuth }