import jwt, { decode } from 'jsonwebtoken';

import {
    errorMessage, status
} from '../helpers/status';

import env from '../env'

/**
 * verify is user is admin
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object|void} response object
 */
const isAdmin = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        errorMessage.error = 'Token not provided';
    }
    try {
        var secretKey = env.SECRET ? env.SECRET : process.env.TRANSPORT_SECRET_KEY;
        const decoded_data = jwt.verify(token, secretKey);
        const userIsAdmin = decoded_data.is_admin;
        if (userIsAdmin) {
            next();
        } else {
            errorMessage.error = "You are not authorized to doing this action";
            return res.status(status.unauthorized).send(errorMessage);
        }
    } catch (errror) {
        errorMessage.error = "You are not authorized to doing this action";
        return res.status(status.unauthorized).send(errorMessage);
    }
}

export default isAdmin;