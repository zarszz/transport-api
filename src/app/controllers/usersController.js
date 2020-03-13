import moment from 'moment';
import dbQuery from '../db/dev/dbQuery';

import {
    hashPassword,
    comparePassword,
    isValidEmail,
    validatePassword,
    isEmpty,
    generateUserToken
} from '../helpers/validations';

import {
    errorMessage, successMessage, status
} from '../helpers/status';

/**
 * Create A User
 * 
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */

const createUser = async (req, res) => {
    const {
        email, first_name, last_name, password
    } = req.body;

    const created_on = moment(new Date());

    if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)) {
        errorMessage.error = 'Email, first name, last name, and password cannot be empty !!';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email)) {
        errorMessage.error = 'Please enter a valid Email';
        return res.status(status.bad).senMessage(errorMessage);
    }
    if (!validatePassword(password)) {
        errorMessage.error = 'Password must be more than five(5) characters';
        return res.status(status.bad).send(errorMessage)
    }
    const hashedPassword = hashPassword(password);
    const createUserQuery = `INSERT INTO
    users(email, first_name, last_name, password, created_on)
    VALUES($1, $2, $3, $4, $5)
    returning *`;
    const values = [
        email,
        first_name,
        last_name,
        hashedPassword,
        created_on
    ];
    try {
        const { rows } = await dbQuery.query(createUserQuery, values);
        const dbResponse = rows[0];
        delete dbResponse.password;
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.first_name, dbResponse.last_name);
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status.created).send(successMessage);
    } catch (error) {
        if (error.routine === '_bt_check_unique') {
            errorMessage.error = 'User with that EMAIL already exist';
            return res.status(status.conflict).send(errorMessage);
        }
    }
}

/**
 * Signin
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */
const signinUser = async (req, res) => {
    const { email, password } = req.body;
    if (isEmpty(email) || isEmpty(password)) {
        errorMessage.error = 'Email or password detail is missing';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email) || !validatePassword(password)) {
        errorMessage.error = 'Please enter a valid Email or Password';
        return res.status(status.bad).send(errorMessage);
    }
    const signinUserQuery = 'SELECT * FROM users WHERE email=$1';
    try {
        const { rows } = await dbQuery.query(signinUserQuery, [email]);
        const dbResponse = rows[0];
        if (!dbResponse) {
            errorMessage.error = 'User with this email does not exist';
            return res.status(status.notFound).send(errorMessage);
        }
        if (!comparePassword(dbResponse.password, password)) {
            errorMessage.error = 'The password you provided is incorrect' // !TODO fix error message management
            return res.status(status.bad).send(errorMessage);
        }
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.first_name, dbResponse.last_name);
        delete dbResponse.password;
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status.created).send(successMessage);
    } catch (error) {
        if (error.routine === '_bt_check_unique') {
            errorMessage.error = 'Operation was not successful';
            return res.status(status.conflict).send(errorMessage);
        }
    }
}

/**
 * Update User
 * @param {object} req
 * @param {object} res
 */
const updateUser = async (req, res) => {
    const {
        email,
        first_name,
        last_name,
        id
    } = req.body;

    if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name)) {
        errorMessage.error = 'Email, first name, or last name must not to be blank';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email)) {
        errorMessage.error = 'Email format is not valid';
        return res.status(status.bad).send(errorMessage);
    }
    const updateUserQuery = `UPDATE users
    SET email=$1, first_name=$2, last_name=$3 WHERE id=$4
    returning *`;
    const values = [email, first_name, last_name, id];
    try {
        const { rows } = await dbQuery.query(updateUserQuery, values);
        const dbResponse = rows[0];
        delete dbResponse.password;
        delete dbResponse.is_admin;
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'An error occured';
        return res.status(status.error).send(errorMessage);
    }
}

/**
 * Get all users
 * @param {object} req
 * @param {object} res
 * @returns {object} Array of user
 */
const getAllUsersData = async (req, res) => {
    const getDataQuery = 'SELECT * FROM users';
    try {
        const { rows } = await dbQuery.query(getDataQuery);
        const dbResponse = rows;
        delete dbResponse.password;
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'An error occured';
        return res.status(status.error).send(errorMessage);
    }
}

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 * @param {object} response user deleted successfully
 */
const deleteUser = async (req, res) => {
    const { userId } = req.params;
    const deleteUserQuery = 'DELETE FROM users WHERE id=$1 returning *;';
    try {
        const { rows } = await dbQuery.query(deleteUserQuery, [userId]);
        const dbResponse = rows[0];        
        if (!dbResponse) {
            errorMessage.error = 'User not found';
            return res.status(status.notFound).send(errorMessage);
        }
        successMessage.data = {}
        successMessage.data.message = 'User deletetion success';
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'An error occured';
        return res.status(status.error).send(errorMessage);
    }
} 

export {
    createUser,
    signinUser,
    updateUser,
    getAllUsersData,
    deleteUser
}