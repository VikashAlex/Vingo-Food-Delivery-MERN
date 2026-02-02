import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { acceptOrder, deliveryOtpSend, deliveryOtpVerify, getCurrentorder, getDeliveryAssignment, getDeliveryBoyOrder, getOrderById, getOrders, getTodayDeliveries, paymentVerify, placeOreder, updateStatus } from '../controllers/order.controller.js';
const orderRoutes = express.Router();

orderRoutes.post('/place', isAuth,  placeOreder)
orderRoutes.post('/verify-payment', isAuth,  paymentVerify)
orderRoutes.get('/get-orders', isAuth,  getOrders)
orderRoutes.get('/get-assigenment', isAuth,  getDeliveryAssignment)
orderRoutes.put('/update-order-sts/:orderId/:shopId', isAuth,  updateStatus)
orderRoutes.get('/accept-order/:assignementId', isAuth,acceptOrder)
orderRoutes.get('/current-order/', isAuth,getCurrentorder)
orderRoutes.get('/getOrder-by-id/:orderId', isAuth,getOrderById)
orderRoutes.post('/delivery-otp-send', isAuth,deliveryOtpSend)
orderRoutes.post('/delivery-otp-verify', isAuth,deliveryOtpVerify)
orderRoutes.get('/gettoday-deliveries', isAuth,getTodayDeliveries)
orderRoutes.get('/get-deliveryBoy-orders', isAuth,getDeliveryBoyOrder)
export default orderRoutes