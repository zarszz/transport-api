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
        errorMessage.error = 'Token not provided';
        return res.status(status.bad).send(errorMessage);
    }
    try {
        const decoded = jwt.verify(token, env.SECRET);
        req.user = {
            email: decoded.email,
            user_id: decoded.user_id,
            is_admin: decoded.is_admin,
            first_name: decoded.is_admin,
            last_name: decode.last_name
        };
        next();
    } catch (error) {
        errorMessage.error = 'Authentication Failed';
        return res.status(status.unauthorized).send(errorMessage);
    }
}

export default verifyToken;