import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { acceptOrder, getCurrentorder, getDeliveryAssignment, getOrderById, getOrders, placeOreder, updateStatus } from '../controllers/order.controller.js';
const orderRoutes = express.Router();

orderRoutes.post('/place', isAuth,  placeOreder)
orderRoutes.get('/get-orders', isAuth,  getOrders)
orderRoutes.get('/get-assigenment', isAuth,  getDeliveryAssignment)
orderRoutes.put('/update-order-sts/:orderId/:shopId', isAuth,  updateStatus)
orderRoutes.get('/accept-order/:assignementId', isAuth,acceptOrder)
orderRoutes.get('/current-order/', isAuth,getCurrentorder)
orderRoutes.get('/getOrder-by-id/:orderId', isAuth,getOrderById)
export default orderRoutes