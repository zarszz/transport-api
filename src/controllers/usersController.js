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

import { KEY_EXPIRE_TIME, ALL_USERS_EXPIRE_TIME } from "../helpers/constant";

import { getRedisConnection } from "../helpers/cache";

const Users = models.users;
const redisClient = getRedisConnection();

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
        errorMessage.error = 'email, first name, last name, and password cannot be empty';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email)) {
        errorMessage.error = 'please enter a valid email';
        return res.status(status.bad).send(errorMessage);
    }
    if (!validatePassword(password)) {
        errorMessage.error = 'Password must be more than five(5) characters';
        return res.status(status.bad).send(errorMessage)
    }
    const hashedPassword = hashPassword(password);
    try {
        let user = await checkUserByEmail(email)        
        if (user) {
            errorMessage.error = 'the email is already registered !'
            return res.status(status.bad).send(errorMessage);
        }
        const key = "all_users_data"
        redisClient.get(key, async (error, result) => {
            if (error) {
                console.error("an erorr happend when get redis data(create user) : " + error);
                return res.status(status.error).send(errorMessage);
            }
            if (result) {
                redisClient.del(key, async(error) => {
                    if (error) {
                        console.error("an erorr happend when get redis data(create user) : " + error);
                        return res.status(status.error).send(errorMessage);
                    }
                })
            }
        })
        await Users.create({
            email: email,
            password: hashedPassword,
            first_name: first_name,
            last_name: last_name
        }, { fields: ['email', 'password', 'first_name', 'last_name'] });
        let message = Object.assign({}, successMessage);
        return res.status(status.created).send(message);
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
        errorMessage.error = 'email or password detail is missing';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email) || !validatePassword(password)) {
        errorMessage.error = 'please enter a valid email and password';
        return res.status(status.bad).send(errorMessage);
    }    
    try {
        const redis_key = email + "_cache";
        redisClient.get(redis_key, async (error, usersData) => {
            if (error) {
                console.error("an erorr happend when get redis data : " + error);
                errorMessage.error = "An error happend";
                return res.status(status.error).send(errorMessage);
            }
            if (usersData) {
                let json = JSON.parse(usersData)
                return res.status(status.created).send(json);
            }
            const raw_rows = await Users.findOne({ where: { email: email } });
            if (!raw_rows) {
                errorMessage.error = 'email or password incorrect';
                return res.status(status.notFound).send(errorMessage);
            }
            const rows = raw_rows['dataValues'];
            if (!comparePassword(rows.password, password)) {
                errorMessage.error = 'email or password is incorrect' // !TODO fix error message management
                return res.status(status.bad).send(errorMessage);
            }
            const token = generateUserToken(rows.email, rows.id, rows.is_admin, rows.first_name, rows.last_name);
            delete rows.password;
            delete rows.is_admin;
            let message = Object.assign({}, successMessage);
            message.data = rows;
            message.data.token = token;
            var stringMessage = JSON.stringify(message);
            redisClient.setex(redis_key, KEY_EXPIRE_TIME, stringMessage, async(error) => {
                if (error) {
                    console.error("an erorr happend when set redis data : " + error);
                    return res.status(status.error).send(errorMessage);
                }
            })
            return res.status(status.created).send(message);
        })
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.conflict).send(errorMessage);
    }
}

/**
 * Update User
 * @param {object} req
 * @param {object} res
 */
const updateUser = async (req, res) => {
    const { userId } = req.params;
    const {
        email,
        first_name,
        last_name
    } = req.body;

    if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name)) {
        errorMessage.error = 'email, first name, or last name must not blank';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email)) {
        errorMessage.error = 'Email format is not valid';
        return res.status(status.bad).send(errorMessage);
    }
    try {
        var user = await checkUserById(userId);
        let key = user.email + "_cache";
        if (!user) {
            errorMessage.error = 'User not found';
            return res.status(status.notFound).send(errorMessage);
        }
        redisClient.get(key, (err, res) => {
            if (err) {
                console.error("an erorr happend when get redis data(update user) : " + error);
                return res.status(status.error).send(errorMessage);
            }
            if (res) {
                redisClient.del(key, (error) => {
                    if(error) {
                        console.error("an erorr happend when delete redis data(update user) : " + error);
                        return res.status(status.error).send(errorMessage);
                    }
                })
            }
        })
        await Users.update({
            email: email,
            first_name: first_name,
            last_name: last_name
        }, { where: { id: userId } });
        let message = Object.assign({}, successMessage);    
        message.message = "User update successfully";
        return res.status(status.success).send(message);
    } catch (error) {
        console.log(error);
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
        const redis_key = "all_users_data"
        redisClient.get(redis_key, async(error, users) => {
            if (error) {
                console.error("an erorr happend when get redis data(all users) : " + error);
                return res.status(status.error).send(errorMessage);
            }
            if (users) {
                return res.status(status.success).send(JSON.parse(users));
            }
            const rows = await Users.findAll({
                attributes: ['id', 'email', 'first_name',
                    'last_name',
                    ['createdAt', 'created_at'],
                    ['updatedAt', 'updated_at']]
            });
            const usersString = JSON.stringify(rows);
            redisClient.setex(redis_key, ALL_USERS_EXPIRE_TIME, usersString, (error) => {
                if (error) {
                    console.error("an erorr happend when set redis data(all users) : " + error);
                    return res.status(status.error).send(errorMessage);
                }
            })
            let message = Object.assign({}, successMessage);
            message.data = rows;
            return res.status(status.success).send(message);
        });
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
        var user = await checkUserById(userId)
        if (!user) {
            errorMessage.error = 'User not found';
            return res.status(status.notFound).send(errorMessage);
        }
        const key = user.email + "_cache"
        redisClient.get(key, (error, res) => {
            if (error) {
                console.error("Error when delete cache (user) : " + err);    
                return res.status(status.error).send(errorMessage);
            }
            if (res) {
                redisClient.del(key, (err) => {
                    if (err) {
                        console.error("Error when delete cache : " + err);
                        return res.status(status.error).send(errorMessage);
                    }
                });
            }
        })
        await Users.destroy({
            where: {
                id: userId
            }
        });
        let message = Object.assign({}, successMessage);
        message.message = 'user delete success';
        return res.status(status.success).send(message);
    } catch (error) {
        errorMessage.error = 'An error occured';
        return res.status(status.error).send(errorMessage);
    }
}

const checkUserByEmail = async (email) => {
    return await Users.findOne({ where: { email: email } })
}

const checkUserById = async (id) => {
    return await Users.findOne({ where: { id: id } })
}

export {
    createUser,
    signinUser,
    updateUser,
    getAllUsersData,
    deleteUser
}