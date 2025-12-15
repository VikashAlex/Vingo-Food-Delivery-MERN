import express from 'express';
import { CreateEditShop, GetMyShop } from '../controllers/shop.controller.js';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';

const shopRoutes = express.Router();

shopRoutes.post('/create-edit', isAuth, upload.single("image"), CreateEditShop)
shopRoutes.get('/getmy-shop', isAuth, GetMyShop)

export default shopRoutes