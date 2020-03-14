import moment from 'moment';
import dbQuery from "../db/dev/dbQuery";

import {
    empty
} from '../helpers/validations';

import {
    errorMessage, successMessage, status
} from '../helpers/status';

/**
 * Add A Bus
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const addBusDetails = async (req, res) => {
    const {
        number_plate, manufacturer, model, year, capacity
    } = req.body;
    const created_on = moment(new Date());

    if (empty(number_plate) || empty(manufacturer) || empty(model) || empty(year) || empty(capacity)) {
        errorMessage.error = 'All fields are required';
        return res.status(status.bad).send(errorMessage);
    }
    const createBusQuery = `INSERT INTO 
                            bus(number_plate, manufacturer, model, year, capacity, created_on) 
                            VALUES($1, $2, $3, $4, $5, $6) returning *;`;
    const values = [
        number_plate,
        manufacturer,
        model,
        year,
        capacity,
        created_on]
    try {
        const { rows } = await dbQuery.query(createBusQuery, values);
        const dbResponse = rows[0];
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'An error occured';
        return res.status(status.error).send(errorMessage);
    }
};

/**
 * Get all Buses
 * @param {object} req
 * @param {object} res
 * @returns {object} buses array
 */
const getAllBuses = async (req, res) => {
    const getAllBusQuery = 'SELECT * FROM bus ORDER BY id DESC;';
    try {
        const { rows } = await dbQuery.query(getAllBusQuery);
        const dbResponse = rows;
        if (dbResponse[0] === undefined) {
            errorMessage.error = 'There are no buses';
            return res.status(status.notFound).send(errorMessage);
        }
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'An error Occured';
        return res.status(status.error).send(errorMessage);
    }
};

/**
 * Update bus
 * @param {object} req
 * @param {object} res
 * @return {object} Bus object
 */
const updateBus = async (req, res) => {
    const {
        number_plate, manufacturer, model,
        year, capacity, id
    } = req.body;
    if (empty(number_plate) || empty(manufacturer) || empty(model) || empty(year) || empty(capacity) || empty(id)) {
        errorMessage.error = 'All fields are required';
        return res.status(status.error).send(errorMessage);
    }
    const updateBusQuery = `UPDATE bus 
                            SET number_plate=$1, manufacturer=$2, model=$3, year=$4, capacity=$5
                            WHERE id=$6 returning *;`;
    const values = [number_plate, manufacturer, model, year, capacity, id];
    try {
        const { rows } = await dbQuery.query(updateBusQuery, values);
        const dbResponse = rows[0];
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'An error occured';
        return res.status(status.error).send(errorMessage);
    }
}

/**
 * Delete bus
 * @param {object} req
 * @param {object} res
 * @returns {void} response bus deleted successfully 
 */
const deleteBus = async (req, res) => {
    const { busId } = req.params;
    const deleteBusQuery = `DELETE FROM bus WHERE id=$1 returning *;`;
    try {
        const { rows } = await dbQuery.query(deleteBusQuery, [busId]);
        const dbResponse = rows[0];
        if (!dbResponse) {
            errorMessage.error = 'Bus not found';
            return res.status(status.notFound).send(errorMessage);
        }
        successMessage.data = {}
        successMessage.data.message = 'Delete bus successfully';
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'An error occured';
        return res.status(status.error).send(errorMessage);
    }
}

export {
    getAllBuses,
    addBusDetails,
    updateBus,
    deleteBus
};
