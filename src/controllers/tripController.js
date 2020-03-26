import moment from "moment";
import dbQuery from "../db/dev/dbQuery";

import models from '../models';

import {
    empty
} from '../helpers/validations';

import {
    errorMessage, successMessage, status, trip_statuses
} from '../helpers/status';

const Trip = models.trip;

/**
 * Create a Trip
 * @param {object} req
 * @param {object} res
 * @returns {object} relection object
 */
const createTrip = async (req, res) => {
    const {
        bus_id, origin, destination, trip_date, fare
    } = req.body;
    const { is_admin } = req.user;
    if (!is_admin === true) {
        errorMessage.error = 'Sorry you are unauthorized to create a trip';
        return res.status(status.unauthorized).send(errorMessage);
    }

    if (empty(bus_id) || empty(origin) || empty(destination) || empty(trip_date) || empty(fare)) {
        errorMessage.error = 'origin, destination, trip date, and fare cannot be empty';
        return res.status(status.error).send(errorMessage);
    }
    try {
        await Trip.create(req.body);
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Unable to create trip';
        return res.status(status.error).send(errorMessage);
    }
};

/**
 * Get all trips
 * @param {object} req
 * @param {object} res
 * @returns {object} trips array
 */
const getAllTrips = async (req, res) => {
    try {        
        const rows = await Trip.findAll();        
        if (!rows) {
            errorMessage.error = 'There are no trips';
            return res.status(status.notFound).send(errorMessage);
        }
        successMessage.data = rows;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

/**
 * Cancel A trip
 * @param {object} req
 * @param {object} res
 * @returns {void} return Trip cancelled successfully
 */
const cancelTrip = async (req, res) => {
    const { tripId } = req.params;
    const { is_admin } = req.user;
    const { cancelled } = trip_statuses;
    if (!is_admin === true) {
        errorMessage.error = 'Sorry you are unauthorized to cancel a trip';
        return res.status(status.unauthorized).send(errorMessage);
    }
    try {
        const rows = await Trip.findOne({ where: { id: tripId } });
        if (!rows) {
            errorMessage.error = 'There is no trip with that id';
            return res.status(status.notFound).send(errorMessage);
        }
        await Trip.update({
            status: cancelled
        }, { where: { id: tripId } });
        successMessage.data = {};
        successMessage.data.message = 'Trip cancelled successfully';
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

/**
 * Filter trips by origin
 * @param {object} req - request
 * @param {object} res - response
 * @returns {object} returned trips
 */
const filterTripByOrigin = async (req, res) => {
    const { origin } = req.body;
    try {
        const rows = await Trip.findAll({ where: { origin: origin } });
        if (rows.length === 0) {
            errorMessage.error = 'No trips with that origin';
            return res.status(status.notFound).send(errorMessage);
        }
        successMessage.data = rows;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

/**
 * Filter trips by destination
 * @param {object} req - request
 * @param {object} res - response
 * @returns {object} returned trips
 */
const filterTripByDestination = async (req, res) => {
    const { destination } = req.body;
    try {
        const rows = await Trip.findAll({ where: { destination: destination } });
        if (rows.length === 0) {
            errorMessage.error = 'No trips with that destination';
            return res.status(status.notFound).send(errorMessage);
        }
        successMessage.data = rows;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

export {
    createTrip,
    getAllTrips,
    cancelTrip,
    filterTripByOrigin,
    filterTripByDestination
};