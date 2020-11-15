import express from 'express';

import { createUser, signinUser, updateUser, getAllUsersData, deleteUser } from '../controllers/usersController';
import verifyAuth from "../middlewares/verifyAuth";
import isAdmin from '../middlewares/isAdmin';

const router = express.Router();

// users Routes

router.post('/auth/signup', createUser); // CREATE
router.post('/auth/signin', signinUser);
router.get('/user', isAdmin, getAllUsersData); // READ
router.put('/user', verifyAuth,  updateUser); // UPDATE
router.delete('/user/:userId', isAdmin, deleteUser); // DELETE

export default router;