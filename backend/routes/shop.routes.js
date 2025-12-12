import express from 'express';
import { CreateEditShop } from '../controllers/shop.controller.js';
import isAuth from '../middlewares/isAuth.js';
const shopRoutes = express.Router();

shopRoutes.post('/create-edit',isAuth, CreateEditShop)

export default shopRoutes