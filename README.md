# 🍔 Vingo – Food Delivery MERN Stack Application

Vingo is a full-stack food delivery web application built using the **MERN stack**.  
It supports multiple user roles, real-time order updates, authentication, and online payments.

---

## 🚀 Features

### 👥 User Roles
- User
- Restaurant Owner
- Delivery Boy

### 🔐 Authentication
- Email & Password login
- Google Sign-In (Firebase)
- Role-based protected routes

### 🛒 Core Functionality
- Browse food items
- Add to cart
- Place orders
- Track orders in real time
- Order history
- Live order status with Socket.io

### 💳 Payments
- Razorpay integration

### ⚡ Real-Time
- Live order updates using Socket.io

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Redux Toolkit
- Firebase Authentication
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Razorpay
- Socket.io
- JWT Authentication

### Deployment
- Frontend: **Vercel**
- Backend: **Render**
- Database: **MongoDB Atlas**

---


---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
PORT=8000
MONGODB_URL=mongodb+srv://yourdatabaseURL:password@vingodb.poq8xux.mongodb.net/vingodb?appName=vingodb
JWT_SECRECT=your_key
EMAIL=youremail@gmail.com
APP_PASSWORD=yourapppassword email
CLOUDINARY_CLUDNAME=deomdxayc
CLOUDINARY_APIKEY=your apki key
CLOUDINARY_APISECERT=your api secert
RAZORPAY_KEY_ID=your id
RAZORPAY_KEY_SECRET=your secret



### Frontend (`frontend/.env`)
VITE_APP_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_KEY=your firebase key
VITE_GEOAPIKEY=your geopikey
VITE_RAZORPAY_KEY_ID=your key


## 🧑‍💻 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/VikashAlex/Vingo-Food-Delivery-MERN.git
cd vingoMern

npm install

cd backend
npm install

cd frontend
npm install


go to vingoMern main folder
npm run dev

opne Your Project 
http://localhost:5173

🌐 Live Demo This Project

👉 https://vingofood.vercel.app

Thank You 
Vikash Kumar
+91 6375256614


