import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';
import { getItem, itemEdit, itemInsert,deleteItem, getItemInCity, getItemInShop, searchItems, ratting } from '../controllers/item.controller.js';
const itemRoutes = express.Router();

itemRoutes.post('/item-add',isAuth,upload.single("image"), itemInsert)
itemRoutes.put('/item-edit/:itemId',isAuth,upload.single("image"), itemEdit)
itemRoutes.get('/get-item/:itemId',isAuth,upload.single("image"), getItem)
itemRoutes.delete('/delete-item/:itemId',isAuth,upload.single("image"), deleteItem)
itemRoutes.get('/getItem-Incity/:city',isAuth,upload.single("image"), getItemInCity)
itemRoutes.get('/getItem-InShop/:shopId',isAuth, getItemInShop)
itemRoutes.get('/getItem-seacrh/',isAuth, searchItems)
itemRoutes.post('/ratting/',isAuth, ratting)

export default itemRoutes