import express from "express";
import { connectDB, errorHandler, verifyToken } from "../utils/utils.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

import dotenv from "dotenv";
dotenv.config();

import path from "path";
//const Image = require("../models/Image.js");
import multer from "multer";
//import { DatauriParser } from "datauri";
import DatauriParser from "datauri/parser.js";
/* const path = require("path");
const multer = require("multer");
const DatauriParser = require("datauri/parser");
const express = require("express"); */

const parser = new DatauriParser();
const formatBufferTo64 = (file) =>
  parser.format(path.extname(file.originalname).toString(), file.buffer);

const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
const storage = multer.memoryStorage();
const uploadToMemory = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (ALLOWED_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Not supported file type!"), false);
    }
  },
});

//Uploading to Cloudinary
//cloudinary = require("cloudinary").v2;
import cloudinary from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const cloudinaryUpload = (file, originalname) =>
  cloudinary.uploader.upload(file, {
    public_id:
      "CloudinaryDemo/" + Date.now() + "-" + Math.round(Math.random() * 1e6),
  });

const uploadCloud = [
  uploadToMemory.single("file"),
  async (req, res, next) => {
    console.log("called upload :");

    try {
      if (!req.file) {
        throw new Error("Image is not presented!");
      }
      if (req.file.size > 1000000) {
        throw new Error("File size cannot be larger than 1MB!");
      }
      console.log("req.file:");
      console.log(req.file);
      //console.log(req.file.size);
      //console.log(req.file.originalname);
      // console.log("file before:");
      // console.log(ALLOWED_FORMATS );
      const file64 = formatBufferTo64(req.file);
      //console.log("file64 :");
      //console.log(file64.content);
      const uploadResult = await cloudinaryUpload(
        file64.content,
        req.file.originalname
      );
      /*       const uploadResult = await cloudinary.uploader.upload(file64.content, {
        public_id:
          "CloudinaryDemo/" +
          Date.now() +
          "-" +
          Math.round(Math.random() * 1e6),
      }); */
      console.log("uploadResult:");
      console.log(uploadResult);
      return res.status(200).send({ location: uploadResult.url });
      // res.status(200).json({ location: "" });
    } catch (error) {
      console.log("err:", error);
      //return res.status(422).send({ message: e.message });
      next(error);
    }
  },
];

//Uploading to Firebase
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  uploadString,
  uploadBytes,
} from "firebase/storage";
import { app } from "../utils/utils.js";

const uploadFire = [
  uploadToMemory.single("file"),
  async (req, res, next) => {
    //console.log("called upload :");
    // console.log("app:", app);
    try {
      if (!req.file) {
        throw new Error("Image is not presented!");
      }
      if (req.file.size > 1000000) {
        throw new Error("File size cannot be larger than 1MB!");
      }
      console.log("req.file to upload:", req.file);
      const file64 = formatBufferTo64(req.file);
      //console.log("file64.content", file64.content);
      const storage = getStorage(app);
      //console.log("storage:", storage);
      const fileName = new Date().getTime() + "-" + req.file.originalname;
      const storageRef = ref(storage, fileName);
      // console.log("storageRef:", storageRef);
      //const path = storageRef.fullPath;
      //const name = storageRef.name;
      //console.log("storageRef.fullPath:", storageRef.fullPath);

      uploadString(storageRef, file64.content, "data_url").then((snapshot) => {
        console.log("Uploaded a 'data_url' string!");
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("downloadURL: ", downloadURL);
          return res.status(200).send({ location: downloadURL });
        });
      });

      //const uploadTask = uploadString(storageRef, file64.content, "data_url");
      //this approach doesn't work, from server it returns some stream
      //console.log("uploadTask:", uploadTask);
      /*       uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log("error here:", error);
          //throw new Error(error);
        },
        () => {
          console.log("not error:");
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("downloadURL: ", downloadURL);
            return res.status(200).send({ location: downloadURL });
            //setFormData({ ...formData, image: downloadURL });
          });
        }
      ); */
    } catch (error) {
      console.log(error);
      //next(error);
      return res.status(422).send({ message: e.message });
    }
  },
];

const router = express.Router();

//router.post("/upload", uploadCloud);//to Cloudinary
router.post("/upload", uploadFire); // to Firebase

export default router;
//module.exports = {  router,};
