import nodemailer from 'nodemailer'
import { env } from '../config/enviroment'
import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

const REDIRECT_URL = 'https://developers.google.com/oauthplayground'
const OAuth2Client = new OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, REDIRECT_URL)
OAuth2Client.setCredentials({ refresh_token: env.MAILING_SERVICE_REFRESH_TOKEN })

const sendMail = async (toEmail, url, text) => {

    const accessToken = await OAuth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: env.SENDER_EMAIL_ADDRESS,
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            refreshToken: env.MAILING_SERVICE_REFRESH_TOKEN,
            accessToken: accessToken
        }
    })

    let mailOptions = {}
    if (url)
        mailOptions = {
            from: `HiGiCo Comic <${env.SENDER_EMAIL_ADDRESS}>`,
            to: toEmail,
            subject: 'Xác nhận tài khoản',
            html: `
            <form method="POST" action=${url} style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;text-align:center;">
            <h2 style="text-align: center; text-transform: uppercase;color: #fecf4b;">Chào mừng bạn đến với HiGiCo Comic!</h2>
            <p>
                Bạn vui lòng click vào nút bên dưới để xác nhận tài khoản.
            </p>
            <input type="text" name="verify" style="display: none" readOnly value="${text}"></input>
            <input type="submit" value="Xác minh" style="background: #fa62ff; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;border-radius:0.5rem;font-weight: bold;box-shadow:0 3px 6px #fa62ff;text-transform: uppercase;cursor: pointer; outline: none;border: none"></input>
        
          </form>`
        }
    else
        mailOptions = {
            from: `HiGiCo Comic <${env.SENDER_EMAIL_ADDRESS}>`,
            to: toEmail,
            subject: 'Mật khẩu mới',
            html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;text-align:center;">
            <h2 style="text-align: center; text-transform: uppercase;color: #fecf4b;">Chào mừng bạn đến với HiGiCo Comic!</h2>
            <p>
                Mật khẩu mới của bạn là: ${text}
            </p>
        
            </div>`
        }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
            console.log('Error: ', err)
        else
            return info
        transporter.close()
    })
}

export const mailHelper = { sendMail }