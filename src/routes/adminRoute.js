import express from 'express';

import { createAdmin, updateUserToAdmin } from '../controllers/adminController';
import isAdmin from '../middlewares/verifyAuth';

const router = express.Router();

// users Routes

router.post('/admin/signup', isAdmin, createAdmin);
router.put('/user/:id/admin', isAdmin, updateUserToAdmin);

export default router;