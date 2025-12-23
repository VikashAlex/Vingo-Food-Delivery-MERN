import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { getOrders, placeOreder, updateStatus } from '../controllers/order.controller.js';
const orderRoutes = express.Router();

orderRoutes.post('/place', isAuth,  placeOreder)
orderRoutes.get('/get-orders', isAuth,  getOrders)
orderRoutes.put('/update-order-sts/:orderId/:shopId', isAuth,  updateStatus)
export default orderRoutes