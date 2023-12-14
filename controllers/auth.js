import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/user.js";
import { createError } from "../utils/error.js";
import { errorMessage } from "../utils/errorResponse.js";
import { messageResponse } from "../utils/messageResponse.js";

const register = async (req, res, next) => {
  const { email, username, password, passwordCon } = req.body;

  if (!username || !email || !password)
    return res.status(400).json(errorMessage("Please fill all the fields"));
  if (password !== passwordCon)
    return res
      .status(400)
      .json(
        errorMessage("Make sure that the password and confirm password match")
      );

  const user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .json(errorMessage("Email or username already exists"));

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const emailVerificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      emailVerificationToken,
    });

    // Save the user
    await newUser.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: "lamiabelkhadem@outlook.com",
      to: newUser.email,
      subject: "Email Verification",
      html: `<p>Please verify your email by clicking on the link: 
             <a href="http://localhost:3000/verify/${emailVerificationToken}">Verify Email</a></p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).send(errorMessage("Error sending email"));
      } else {
        res
          .status(200)
          .json(messageResponse("User registered, please verify your email."));
      }
    });
  } catch (err) {
    res.status(500).json(errorMessage("An internal server error occurred"));
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    console.log("Found user",user,req.body.email)

    if (!user) return res.status(400).json(errorMessage("Invalid credentials"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json(errorMessage("Invalid credentials"));

    console.log("HEEERE");

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("HEEERE");

    const { password, isAdmin, ...others } = user;

    return res.json({ user: others, accessToken });
  } catch (err) {
    console.log({ err });
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      emailVerificationToken: req.params.token,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token." });
    }

    user.emailVerified = true;

    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ message: "Email successfully verified", user }); // Send a success response
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    "-password -emailVerificationToken"
  );

  if (!user) return next(createError(404, "User not found"));
  return res.json(user);
};

export const auth = {
  register,
  login,
  verifyEmail,
  me,
};
