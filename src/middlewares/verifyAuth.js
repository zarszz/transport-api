import jwt, { decode } from 'jsonwebtoken';
import {
    errorMessage, status
} from '../helpers/status';

import env from '../env'


/**
 * Verify token
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object|void} response Object
 */
const verifyToken = async (req, res, next) => {
    const { token } = req.headers;
    if(!token) {
        errorMessage.error = 'token not provided';
        return res.status(status.bad).send(errorMessage);
    }
    try {
        var secretKey = env.SECRET || process.env.TRANSPORT_SECRET_KEY;
        const decoded = jwt.verify(token, secretKey);
        req.user = {
            email: decoded.email,
            user_id: decoded.user_id,
            is_admin: decoded.is_admin,
            first_name: decoded.is_admin,
            last_name: decode.last_name
        };
        next();
    } catch (error) {
        errorMessage.error = 'authentication failed';
        return res.status(status.unauthorized).send(errorMessage);
    }
}

export default verifyToken;