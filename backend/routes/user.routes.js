import express from 'express';
import { getCurrentUser, userLocationUpdate } from '../controllers/user.controller.js';
import isAuth from '../middlewares/isAuth.js';
const userRoutes = express.Router();


userRoutes.get('/current',isAuth, getCurrentUser)
userRoutes.post('/update-location',isAuth, userLocationUpdate)

export default userRoutes