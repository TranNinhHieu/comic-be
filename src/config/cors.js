import { WHITELIST_DOMAINS } from '../utilities/constants'

export const corsOptionsDelegate = function (req, callback) {
    var corsOptions
    if (WHITELIST_DOMAINS.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}