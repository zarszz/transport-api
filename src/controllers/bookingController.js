import models from "../models";

import {
  empty,
} from '../helpers/validations';

import {
  errorMessage, successMessage, status,
} from '../helpers/status';

const { Op } = require('sequelize');
const Booking = models.booking;
const Bus = models.buses;
const Trip = models.trip;

/**
 * Add a Booking
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createBooking = async (req, res) => {
  const { trip_id, bus_id } = req.body;

  if (empty(trip_id)) {
    errorMessage.error = 'Trip is required';
    return res.status(status.bad).send(errorMessage);
  }
  const bus = await Bus.findOne({ where: { id: bus_id } });
  const trip = await Trip.findOne({ where: { id: trip_id } });

  if (!bus || !trip) {
    errorMessage.error = 'Trip or bus not found';
    return res.status(status.notFound).send(errorMessage);
  }

  try {
    await Booking.create(req.body);
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      errorMessage.error = 'Seat Number is already taken';
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = 'Unable to create booking';
    return res.status(status.error).send(errorMessage);
  }
}

/**
 * Get all bookings
 * @param {object} req
 * @param {object} res
 * @returns {object} buses array
 */
const getAllBookings = async (req, res) => {
  const { is_admin, user_id } = req.body;
  if (!is_admin === true) {
    try {
      const rows = await Booking.findAll({ where: { user_id: user_id } });
      if (rows.length === 0) {
        errorMessage.error = 'You have no bookings';
        return res.status(status.notFound).send(errorMessage);
      }
      successMessage.data = rows;
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = 'An Error occured';
      return res.status(status.error).send(errorMessage);
    }
  }
  try {
    const rows = await Booking.findAll();
    if (rows.length === 0) {
      errorMessage.error = 'There are no bookings';
      return res.status(status.bad).send(errorMessage);
    }
    successMessage.data = rows;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'An error occured';
    return res.status(status.error).send(errorMessage);
  }
}

/**
 * Delete A Booking
 * @param {object} req
 * @param {object} res
 * @returns {void} response booking deleted successfully
 */
const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { user_id } = req.body;
  try {
    const rows = await Booking.findOne({ where: {id: bookingId} });
    if (!rows) {
      errorMessage.error = 'You have no booking with that id';
      return res.status(status.notFound).send(errorMessage);
    }
    await Booking.destroy({
      where: {
        [Op.and]: [
          { id: parseInt(bookingId) },
          { user_id: user_id }
        ]
      }
    });
    successMessage.data = {};
    successMessage.data.message = 'Booking deleted successfully';
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'An error occured'
    return res.status(status.error).send(errorMessage);
  }
}

/**
 * Update Booking Seat
 * @param {object} res
 * @param {object} req
 * @returns {object} updated booking seat
 */
const updateBookingSeat = async (req, res) => {
  const { bookingId } = req.params;
  const { seat_number } = req.body;

  if (empty(seat_number)) {
    errorMessage.error = 'Seat number is needed';
    return res.status(status.bad).send(errorMessage);
  }
  const booking = Booking.findOne({ where: { id: bookingId } });
  try {
    if (!booking || booking.length === 0) {
      errorMessage.error = 'Booking Cannot be found';
      return res.status(status.notFound).send(errorMessage);
    }
    await Booking.update({
      seat_number: seat_number
    }, {
      where: {
        id: parseInt(bookingId)
      }
    });
    return res.status(status.success).send(successMessage);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      errorMessage.error = 'Seat Number is taken already';
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
}

export {
  createBooking,
  getAllBookings,
  deleteBooking,
  updateBookingSeat
}