import express from 'express';

import { createBooking, deleteBooking, updateBookingSeat, getAllBookings } from '../controllers/bookingController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

router.post('/bookings', verifyAuth, createBooking);
router.get('/booking', verifyAuth, getAllBookings);
router.delete('/bookings/:bookingId', verifyAuth, deleteBooking);
router.put('/bookings/:bookingId', verifyAuth, updateBookingSeat);

export default router;