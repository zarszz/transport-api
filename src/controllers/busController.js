import models from "../models";

import {
    empty
} from '../helpers/validations';

import {
    errorMessage, successMessage, status
} from '../helpers/status';

const Buses = models.buses;

/**
 * Add A Bus
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const addBusDetails = async (req, res) => {
    if (empty(req.body.number_plate) || empty(req.body.manufacturer) || empty(req.body.model) || empty(req.body.year) || empty(req.body.capacity)) {
        errorMessage.error = 'all fields are required';
        return res.status(status.bad).send(errorMessage);
    }
    try {
        await Buses.create(req.body);
        successMessage.data = req.body;
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'an error occured';
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
    try {
        const rows = await Buses.findAll();
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
    if (empty(req.body.number_plate) || empty(req.body.manufacturer) ||
        empty(req.body.model) || empty(req.body.year) || empty(req.body.capacity)
        || empty(req.body.id)) {
        errorMessage.error = 'all fields are required';
        return res.status(status.bad).send(errorMessage);
    }

    try {
        const rows = await Buses.findOne({ where: { id: req.body.id } });
        if (!rows) {
            errorMessage.error = 'bus not found';
            return res.status(status.notFound).send(errorMessage);
        }
        await Buses.update(req.body, { where: { id: req.body.id } });
        successMessage.data = req.body;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'an error occured';
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
    try {
        const bus = await Buses.findOne({ where: { id: busId } });
        if (!bus) {
            errorMessage.error = 'bus not found';
            return res.status(status.notFound).send(errorMessage);
        }
        await Buses.destroy({
            where: {
                id: busId
            }
        });
        successMessage.message = 'delete bus successfully';
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'an error occured';
        return res.status(status.error).send(errorMessage);
    }
}

export {
    getAllBuses,
    addBusDetails,
    updateBus,
    deleteBus
};
