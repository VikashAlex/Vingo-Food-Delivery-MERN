import express from 'express';
import { signIn, signOut, signup } from '../controllers/auth.controller.js';
const authRoutes = express.Router();

authRoutes.post('/signup', signup)
authRoutes.post('/signin', signIn)
authRoutes.get('/signout', signOut)

export default authRoutes