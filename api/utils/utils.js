import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    //console.log(      "database is connected successfully to " + process.env.MONGO_URL    );
  } catch (err) {
    console.log(err);
  }
};

//possible alternative
/* export function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGODB_URI;
    return mongoose.connect(uri);
  }
} 
...
  await mongooseConnect();
  */

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};

export const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

//FIREBASE_API_KEY=AIzaSyDUvxFA7Vv_FHmhzmxLsWs-Iw5BNdpHFuw

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "mern-blog-1c1f6.firebaseapp.com",
  projectId: "mern-blog-1c1f6",
  storageBucket: "mern-blog-1c1f6.appspot.com",
  messagingSenderId: "916742751526",
  appId: "1:916742751526:web:3c028738af122cfece6de7",
};

//console.log("firebaseConfig:", firebaseConfig);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
