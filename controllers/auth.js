import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import User from "../models/user.js";
import { createError } from "../utils/error.js";
import { errorMessage } from "../utils/index.js";
import { messageResponse } from "../utils/messageResponse.js";

const register = async (req, res) => {
	const { email, username, password, passwordCon } = req.body;

	if (!username || !email || !password)
		return res.status(400).json(errorMessage("Please fill all the fields"));
	if (password !== passwordCon)
		return res
			.status(400)
			.json(
				errorMessage(
					"Make sure that the password and confirm password match"
				)
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

		console.log(emailVerificationToken);

		const newUser = {
			username: req.body.username,
			email: req.body.email,
			password: hash,
			emailVerificationToken,
		};

		// Save the profile
		await User.create(newUser);

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
             <a href="${process.env.APP_URL ?? "http://localhost:5173"
				}/verify/${emailVerificationToken}">Verify Email</a></p>`,
		};

		await transporter.sendMail(mailOptions, function (error) {
			if (error) {
				return res
					.status(500)
					.send(errorMessage("Error sending email"));
			} else {
				return res
					.status(200)
					.json(
						messageResponse(
							"User registered, please verify your email."
						)
					);
			}
		});
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage("An internal server error occurred"));
	}
};

const login = async (req, res, next) => {
	const { email, password: userPass } = req.body;

	if (!email || !userPass)
		return res.status(400).json(errorMessage("Please fill all the fields"));

	try {
		const user = await User.findOne({ email }).lean();

		if (!user)
			return res.status(400).json(errorMessage("Invalid credentials"));

		const isPasswordCorrect = await bcrypt.compare(userPass, user.password);

		if (!isPasswordCorrect)
			return res.status(400).json(errorMessage("Invalid credentials"));

		const accessToken = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		delete user.password;

		return res.json({ user, accessToken });
	} catch (err) {
		next(err);
	}
};

const verifyEmail = async (req, res, next) => {
	const { token } = req.params;

	if (token === null)
		return res.status(400).json(messageResponse("Invalid token."));

	try {
		const user = await User.findOne({
			emailVerificationToken: token,
		}).lean();

		if (!user) {
			console.log({ user, token });
			return res.status(400).json(errorMessage("Invalid token."));
		}

		if (user.emailVerified) {
			return res
				.status(400)
				.json(errorMessage("Email already verified."));
		}

		await User.findByIdAndUpdate(
			user._id,
			{
				emailVerified: true,
				emailVerificationToken: null,
			},
			{ new: true }
		);

		return res.json({ message: "Email successfully verified" }); // Send a success response
	} catch (err) {
		next(err);
	}
};

const me = async (req, res, next) => {
	const user = await User.findById(req.user.id)
		.select("-password -emailVerificationToken")
		.populate("profile");

	if (!user) return next(createError(404, "User not found"));
	return res.json({ user });
};

export const auth = {
	register,
	login,
	verifyEmail,
	me,
};
