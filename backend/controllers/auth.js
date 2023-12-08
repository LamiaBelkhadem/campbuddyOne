import bcrypt from "bcryptjs"
import User from "../models/user.js"
import {createError} from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const emailVerificationToken = crypto.randomBytes(20).toString('hex');
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
            host: process.env.SMTP_HOST, // Outlook's SMTP server
            port: 587,                    // SMTP port for Outlook
            secure: false,                // True for 465, false for other ports
            auth: {
                user:process.env.SMTP_EMAIL, 
                pass:  process.env.SMTP_PASSWORD
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });



        const mailOptions = {
            from: 'lamiabelkhadem@outlook.com',
            to: newUser.email,
            subject: 'Email Verification',
            html: `<p>Please verify your email by clicking on the link: 
             <a href="http://localhost:3000/verify/${emailVerificationToken}">Verify Email</a></p>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('User registered, please verify your email.');
            }
        });
    } catch (err) {
        console.log("An error occurred:", err.message); // This will log the error message.
        console.log(err); // This will log the entire error object, which includes stack trace and other details.
        res.status(500).send('An internal server error occurred');

    }
};


export const login= async (req,res,next)=>{
    try{
        const user= await User.findOne({email:req.body.email})
        if(!user) return next(createError(404,"User not found"));

        const isPasswordCorrect=await bcrypt.compare(
            req.body.password,
            user.password
        );

        if(!isPasswordCorrect)
            return next(createError(400, "Wrong password or username!"))

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT, { expiresIn: '1h' });

        const{password, isAdmin, ...others}= user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 3600000,
            sameSite: 'strict',

        })

            .status(200)
            .json({...others});
    }catch(err){
        next(err);
    }
}

export const verifyEmail = async (req, res, next) => {
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
        console.log("email verified");

        res.json({ message: "Email successfully verified", user }); // Send a success response

    } catch (err) {
        next(err);
    }
};

