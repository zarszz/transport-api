import models from "../models";

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

const Users = models.users;

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
    try {
        await Users.create({
            email: email,
            password: hashedPassword,
            first_name: first_name,
            last_name: last_name
        }, { fields: ['email', 'password', 'first_name', 'last_name'] })
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
    try {
        const raw_rows = await Users.findOne({ where: { email: email } });
        const rows = raw_rows['dataValues'];
        if (!rows) {
            errorMessage.error = 'User with this email does not exist';
            return res.status(status.notFound).send(errorMessage);
        }
        if (!comparePassword(rows.password, password)) {
            errorMessage.error = 'The password you provided is incorrect' // !TODO fix error message management
            return res.status(status.bad).send(errorMessage);
        }
        const token = generateUserToken(rows.email, rows.id, rows.is_admin, rows.first_name, rows.last_name);
        delete rows.password;
        delete rows.is_admin;
        successMessage.data = rows;
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
    try {
        await Users.update({
            email: email,
            first_name: first_name,
            last_name: last_name
        }, { where: { id: id } });
        const raw_rows = await Users.findOne({ where: { id: id } });
        const rows = raw_rows['dataValues'];
        delete rows.password;
        delete rows.is_admin;
        successMessage.data = rows;
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
    try {
        const rows = await Users.findAll({
            attributes: ['id', 'email', 'first_name',
                'last_name',
                ['createdAt', 'created_at'],
                ['updatedAt', 'updated_at']]
        });
        successMessage.data = rows;
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
    try {
        const user = await Users.findOne({ where: { id: userId } });
        if (!user) {
            errorMessage.error = 'User not found';
            return res.status(status.notFound).send(errorMessage);
        }
        await Users.destroy({
            where: {
                id: userId
            }
        });
        successMessage.data = {}
        successMessage.data.message = 'user deletetion success';
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