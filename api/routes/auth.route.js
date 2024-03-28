import express from "express";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { connectDB, errorHandler } from "../utils/utils.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import { readFileSync } from "fs";
import async from "async";
import path from "path";

const signupOLD = async (req, res, next) => {
  connectDB();
  const { username, email, password } = req.body;
  //console.log("signup:", username, email, password);
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }
  const checkUser = await User.findOne({ email });
  if (checkUser) {
    return next(
      errorHandler(
        404,
        "User with this email already exists. If you forgot the password use send it to email functionality"
      )
    );
  }
  const checkUser2 = await User.findOne({ username });
  if (checkUser2) {
    return next(errorHandler(404, "User with this username already exists."));
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username: username.trim(),
    email: email.trim(),
    password: hashedPassword,
  });
  try {
    await newUser.save();
    //new
    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = newUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
    //old
    //res.json("Signup successful");
  } catch (error) {
    next(error);
  }
};

export async function sendVerificationEmail(userId, req) {
  const email = req.body?.email.trim();
  const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  //console.log("token:", token);
  //let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  //console.log("fullUrl:", fullUrl);
  const loc = req.protocol + "://" + req.get("host");
  const link = `${loc}/sign-in?email=${email}${!!req.body.encodedCallbackUrl ? "&callbackUrl=" + req.body.encodedCallbackUrl : ""}&token=${token}`;
  console.log("sent link from sendVerificationEmail: ", link);
  const transporter = nodemailer.createTransport({
    service: "gmail", //old
    port: 465, //new
    host: "smtp.gmail.com", //new
    secure: true, //new
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
  //console.log("transporter: ", transporter);
  // verify connection configuration
  try {
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        console.log("verify connection configuration");
        if (error) {
          console.log("error:", error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    const emailsDir = path.resolve(process.cwd(), "emails");
    console.log("emailsDir: ", emailsDir);
    const emailFile = readFileSync(path.join(emailsDir, "confirm-email.html"), {
      encoding: "utf8",
    });
    /*  const emailFile = readFileSync("./emails/confirm-email.html", {
      encoding: "utf8",
    }); */
    //console.log("emailFile: ", emailFile);
    const emailTemplate = Handlebars.compile(emailFile);

    let mailOptions = {
      from: `My blog <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Confirm email",
      text: link,
      html: emailTemplate({
        base_url: loc,
        signin_url: link,
        email: email,
      }),
    };
    // html: `Click on the link to reset the password ${link}`, //new
    //console.log("mailOptions: ", mailOptions);

    const prom = new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailOptions, (err, info) => {
        console.log("Email sent: " + info.response);
        if (err) {
          console.error(err);
          return reject(err);
          //return "error";
        } else {
          // res          .status(200)          .send({ message: "Success from transporter.sendMail" });
          //console.log("info from transporter.sendMail", info);
          return resolve(info);
          //return "success";
        }
      });
    });

    try {
      const result = await prom;
      console.log("result from verification email prom: ", result);
      return "success";
    } catch (error) {
      console.log("error from verification email prom: ", error);
      return "error";
    }
  } catch (error) {
    return "error";
  }
}

const signup = async (req, res, next) => {
  connectDB();
  const { username, email, password, encodedCallbackUrl = "" } = req.body;
  console.log(" req.body from signup:", req.body);
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }
  const checkUser = await User.findOne({ email });
  if (checkUser) {
    //MY-DELETE
    /*  let result = await sendVerificationEmail(checkUser._id.toString(), req);
    console.log("result from signup: ", result);
    if (result == "success") {
           return res
        .status(200)
        .send({ message: "sent email to an existing user" });
    } */
    return next(
      errorHandler(
        403,
        'User with this email already exists. If you forgot the password use "Reset the password" functionality'
      )
    );
  }
  const checkUser2 = await User.findOne({ username });
  if (checkUser2) {
    return next(errorHandler(403, "User with this username already exists."));
  }
  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username: username.trim(),
      email: email.trim(),
      password: hashedPassword,
      //isEmailVerified: true,
      isEmailVerified: false,
    });
    await newUser.save();
    //console.log("newUser:", newUser);

    let result = await sendVerificationEmail(newUser._id.toString(), req);
    console.log("result from sendVerificationEmail: ", result);
    if (result == "success") {
      return res.status(200).send({ message: "Success from signing-up" });
    } else {
      console.log("received error");
      return next(errorHandler(403, "some error sending verification email"));
    }
  } catch (error) {
    next(error);
  }
};

const signinOLD = async (req, res, next) => {
  connectDB();
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User with this email not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(
        errorHandler(
          400,
          "Invalid password. If you forgot the password use reset it functionality"
        )
      );
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  connectDB();
  console.log(" req.body from signin: ", req.body);
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const prom = new Promise((resolve, reject) => {
      if (req.body.token) {
        console.log("before jwt.verify from signin: ");
        jwt.verify(
          req.body.token,
          process.env.JWT_SECRET,
          async (err, decoded) => {
            console.log("run jwt.verify from signin: ");
            if (err) {
              return reject("Invalid Token");
            } else {
              console.log("decoded from signin: ", decoded);
              if (!decoded.id) {
                return reject("Invalid Token");
              }
              const decodedUser = await User.findById(decoded.id);
              if (!decodedUser) {
                return reject("Invalid Token");
              }
              console.log(
                "decodedUser after decoding in sign in: ",
                decodedUser
              );
              if (decoded.email !== decodedUser.email.toString()) {
                console.log("changed email from token to: ", decoded.email);
                decodedUser.email = decoded.email; //it's already done during email sending from update func in old version
              }
              decodedUser.isEmailVerified = true;
              await decodedUser.save();
              console.log("decodedUser after save in sign in: ", decodedUser);
              return resolve("success from token");
            }
          }
        );
      } else {
        console.log("no token in checkToken: ");
        return reject("no token");
      }
    });
    try {
      const result = await prom;
      console.log("result from checkToken prom: ", result);
    } catch (error) {
      console.log("error in checkToken: ", error);
      if (error == "Invalid Token") {
        return next(errorHandler(401, error));
      }
    }

    console.log("running check for validUser with email: ", email);
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User with this email not found"));
    }
    console.log("validUser from signin: ", validUser);
    if (validUser.isEmailVerified === false) {
      let result = await sendVerificationEmail(validUser._id.toString(), req);
      console.log("result from sendVerificationEmail: ", result);
      if (result == "success") {
        return next(
          errorHandler(
            400,
            "Email is not verified. Verification token was send to your email again. Go there and click the verification link"
          )
        );
      } else {
        console.log("some error");
        return next(errorHandler(403, "error sending verification email"));
      }
    } else {
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(
          errorHandler(
            400,
            "Invalid password. If you forgot the password use reset it functionality"
          )
        );
      }
      const token = jwt.sign(
        { id: validUser._id, isAdmin: validUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password: pass, ...rest } = validUser._doc;
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

const ForgotPassword = async (req, res, next) => {
  connectDB();
  const { email } = req.body;
  console.log("req.body from ForgotPassword: ", req.body);
  //return next(errorHandler(400, "Test error ForgotPassword"));
  if (!email) {
    return next(errorHandler(400, "Email is required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User with this email not found"));
    }
    //console.log("validUser:", validUser);
    const token = jwt.sign(
      { id: validUser._id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    //let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    //console.log("fullUrl:", fullUrl);
    const loc = req.protocol + "://" + req.get("host");
    const link = `${loc}/reset-password/${validUser._id}/${token}`;
    console.log("sent link:", link);
    const transporter = nodemailer.createTransport({
      service: "gmail", //old
      port: 465, //new
      host: "smtp.gmail.com", //new
      secure: true, //new
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
    //console.log("transporter: ", transporter);
    // verify connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        console.log("verify connection configuration");
        if (error) {
          console.log("error:", error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    const emailsDir = path.resolve(process.cwd(), "emails");
    console.log("emailsDir: ", emailsDir);
    const emailFile = readFileSync(path.join(emailsDir, "reset-email.html"), {
      encoding: "utf8",
    });
    /* const emailFile = readFileSync("./emails/reset-email.html", {
      encoding: "utf8",
    }); */
    //console.log("emailFile: ", emailFile);
    const emailTemplate = Handlebars.compile(emailFile);

    let mailOptions = {
      from: `My blog <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Reset Password Link",
      text: link,

      html: emailTemplate({
        base_url: loc,
        signin_url: link,
        email: email,
      }),
    };
    // html: `Click on the link to reset the password ${link}`, //new
    //console.log("mailOptions: ", mailOptions);

    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailOptions, (err, info) => {
        console.log("Email sent: " + info.response);
        if (err) {
          console.error(err);
          reject(err);
          return next(errorHandler(404, "error"));
        } else {
          // res          .status(200)          .send({ message: "Success from transporter.sendMail" });
          console.log("info from transporter.sendMail", info);
          resolve(info);
          return res
            .status(200)
            .send({ message: "Success from transporter.sendMail" });
        }
      });
    });

    /*     transporter.sendMail(mailOptions, function (error, info) {
      console.log("Email sent: ");
      console.log("Email sent: ", info);
      console.log("Email sent: " + info.response);
      if (error) {
        console.log(error);
        return next(errorHandler(404, "error"));
      } else {
        return res
          .status(200)
          .send({ message: "Success from transporter.sendMail" });
      }
    }); */
    /*   
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest); */

    //console.log("Success from outside of transporter");
    //res.status(200).json({ message: "Success from outside of transporter" });
  } catch (error) {
    next(error);
  }
};

const ResetPassword = async (req, res, next) => {
  connectDB();
  //const { email } = req.body;
  console.log("req.body from ResetPassword: ", req.body);
  try {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next(errorHandler(401, "Invalid Token"));
        // res.status(401).send({ message: "Invalid Token" });
      } else {
        //console.log("decoded from ResetPassword: ", decoded);
        const user = await User.findOne({ _id: decoded.id });
        // const user = await User.findOne({ resetToken: req.body.token });
        if (user) {
          //console.log("user from ResetPassword: ", user);
          if (req.body.password) {
            user.password = bcryptjs.hashSync(req.body.password, 10);
            await user.save();

            //new addition
            const token = jwt.sign(
              { id: user._id, isAdmin: user.isAdmin },
              process.env.JWT_SECRET
            );
            const { password: pass, ...rest } = user._doc;
            return res
              .status(200)
              .cookie("access_token", token, {
                httpOnly: true,
              })
              .json(rest);

            /* old- works
            return res
              .status(200)
              .json({ message: "Password reseted successfully" }); */
          }
        } else {
          return next(errorHandler(404, "User not found"));
          //res.status(404).send({ message: "User not found" });
        }
      }
    });
    /*   
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest); */
    //res.status(200).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
};

//to verify an email send there a link  like this
//http://localhost:5173/sign-in?token=<token>&email=<email>
//amd then in usEffect add that email to formdata and on Submit add the token to the req.body
//another way is  http://localhost:5173/api/auth/verify-email/:token

const google = async (req, res, next) => {
  connectDB();
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        /*   username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4), */
        username: name,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password", ResetPassword);
router.post("/google", google);

export default router;
