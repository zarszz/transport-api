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
    if(!token){
        errorMessage.error = 'Token not provided';
    }
    try {
        const decoded_data = jwt.verify(token, env.SECRET);
        const userIsAdmin = decoded_data.is_admin;
        if(userIsAdmin){
            next();
        } else {
            errorMessage.error = "You're not authorized to doing this action";
            return res.status(status.unauthorized).send(errorMessage);
        }
    } catch (error) {
        errorMessage.error = 'Authentication failed';
        return res.status(status.unauthorized).send(errorMessage);
    }
}

export default isAdmin;