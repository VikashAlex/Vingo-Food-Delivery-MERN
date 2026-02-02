import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import shopRoutes from './routes/shop.routes.js';
import itemRoutes from './routes/item.routes.js';
import orderRoutes from './routes/order.routes.js';
import http from 'http'
import { Server } from 'socket.io';
import { sockethandler } from './socket.io.js';
const app = express();
const server = http.createServer(app)
const port = process.env.PORT || 5000;

const io = new Server(server,{
    cors:
    {
        origin: 'http://localhost:5173',
        credentials: true,
        methods:['POST','GET']
    }
})
app.set('io',io)  
sockethandler(io) 
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
))
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/shop', shopRoutes)
app.use('/api/item', itemRoutes)
app.use('/api/order', orderRoutes)



// MongoDB Connection //
server.listen(port, () => {
    console.log(`Server is started ${port}...`)
    mongoDB()
})
