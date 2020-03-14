import bcrypt from 'bcryptjs';
import env from '../env';
import jwt from 'jsonwebtoken';

/**
 * 
 * @param {string} password
 * @returns {string} hashed password
*/
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = password => bcrypt.hashSync(password, salt);

/**
 * 
 * @param {string} hashedPassword
 * @param {string} password
 * @returns {Boolean} True or False
*/
const comparePassword = (hashedPassword, password) => {
    return bcrypt.compareSync(password, hashedPassword);
}

/**
 * isValidEmail helper method
 * @param {string} email
 * @return {Boolean} True or False
 */
const isValidEmail = (email) => {
    const regExp = /\S+@\S+\.\S+/;
    return regExp.test(email);
}

/**
 * validatePassword helper method
 * @param {string} password
 * @returns {Boolean} True or False
*/
const validatePassword = (password) => {
    if (password.length <= 5 || password === '') {
        return false;
    }
    return true;
}

/**
 * isEmpty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 * 
 */
const isEmpty = (input) => {
    if (input === undefined || input === '') {
        return true;
    }
    if (input.replace(/\s/g, '').length) {
        return false;
    } return true;
}

/**
 * empty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 * 
 */
const empty = (input) => {
    if (input === undefined || input === '') {
        return true;
    }
};

/**
 * Generate token
 * @param {string} id
 * @returns {string} token
 */
const generateUserToken = (email, id, is_admin, first_name, last_name) => {
    const token = jwt.sign({
        email,
        user_id: id,
        is_admin,
        first_name,
        last_name,
    },
        env.SECRET, { expiresIn: '3d' });
    return token
}

export {
    generateUserToken,
    isValidEmail,
    validatePassword,
    isEmpty,
    empty,
    hashPassword,
    comparePassword
}