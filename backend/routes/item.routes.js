import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';
import { itemEdit, itemInsert } from '../controllers/item.controller.js';
const itemRoutes = express.Router();

itemRoutes.post('/item-add',isAuth,upload.single("image"), itemInsert)
itemRoutes.put('/item-edit/:itemId',isAuth,upload.single("image"), itemEdit)

export default itemRoutes