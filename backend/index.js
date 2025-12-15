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

const app = express();
const port = process.env.PORT || 5000;

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



// MongoDB Connection //
app.listen(port, () => {
    console.log(`Server is started ${port}...`)
    mongoDB()
})
