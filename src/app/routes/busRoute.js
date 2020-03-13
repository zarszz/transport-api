import express from 'express';

import { addBusDetails, getAllBuses, updateBus, deleteBus} from '../controllers/busController';
import verifyAuth from "../middlewares/verifyAuth";

const router = express.Router();

// buses Routes
router.post('/bus', verifyAuth, addBusDetails);
router.get('/bus', verifyAuth, getAllBuses);
router.put('/bus', verifyAuth, updateBus);
router.delete('/bus/:busId', verifyAuth, deleteBus);

export default router;