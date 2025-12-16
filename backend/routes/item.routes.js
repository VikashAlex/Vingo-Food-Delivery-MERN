import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';
import { getItem, itemEdit, itemInsert,deleteItem, getItemInCity } from '../controllers/item.controller.js';
const itemRoutes = express.Router();

itemRoutes.post('/item-add',isAuth,upload.single("image"), itemInsert)
itemRoutes.put('/item-edit/:itemId',isAuth,upload.single("image"), itemEdit)
itemRoutes.get('/get-item/:itemId',isAuth,upload.single("image"), getItem)
itemRoutes.delete('/delete-item/:itemId',isAuth,upload.single("image"), deleteItem)
itemRoutes.get('/getItem-Incity/:city',isAuth,upload.single("image"), getItemInCity)

export default itemRoutes