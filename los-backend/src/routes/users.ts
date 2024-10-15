import bcrypt from "bcrypt";
import express from "express";
import UserModel from "../models/user";
import PitchModel from "../models/pitch";
import LosModel from "../models/los";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import ProgramModel from "../models/program";

const router = express.Router();

// Get all users
router.get("/", async (_req, res, next) => {
	try {
		const users = await UserModel.findAll({ 
			attributes: ["id", "name", "program_ids", "pitch_ids", "los_ids"]
		});
		res.json(users);
	}    catch(error) {
		next(error);
	}
}); 

// Get  user by id
router.get("/:id", async (req, res, next) => {
	try {
		const user = await UserModel.findOne({
			where: { id: req.params.id},
			attributes: ["id", "email", "name"],
		});

		if (user) {
			res.json(user);
		} else {
			res.status(404).json({ error: "User not found" });
			return;
		}
	} catch (error) {
		next(error);
	}
});


// Create new user
router.post("/", async (req, res, next) => {
    
	const { email, name, password } = req.body;
   
	// Validate password
	if (!password || password.length < 8) {
		res.status(400).json({ error: "Password must be at least 8 characters long." }).end();
		return;
	}

	// Check for existing email
	const existingUser = await UserModel.findOne({ where: { email } });
	if (existingUser) {
		res.status(400).json({ error: "Email is already registered." });
		return;
	}

	// Encrypt password
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);


	// Create the example pitch to associate with new user
	const examplePitch = await PitchModel.create({
		title: "Med Tech Australia",
		challenge: "Australia’s health sector relies on imports for ~95% of its med tech yet faces significant supply chain challenges, highlighting critical vulnerabilities and the urgent need for targeted local manufacturing and improved supply chain resilience.",
		mainActivity: "Med Tech Australia will identify, design and implement sovereign med tech products, leveraging existing capabilities and addressing specific needs.",
		outcome: "This will enhance healthcare resilience, ensure reliable access to critical medical supplies, improve patient outcomes, and foster a robust med tech industry that reduces dependency on international supply chains.",
		userId: null, // Will be assigned after user creation
		programId: null // Will be assigned after user creation
	});

	// Create the example LoS to associate with new user
	const exampleLos = await LosModel.create({
		activities: [
			"Conduct a review to identify aligned med tech supply vulnerabilities with Australian med tech capabilities and implement pilot projects between hospitals and med tech companies to address procurement, adoption and product challenges.",
			"Evaluation of the potential effects of hydrogen exports on domestic hydrogen supplies through retrospective analysis of gas reservation policy impacts on domestic energy prices and mechanisms for achieving social legitimacy of new energy opportunities."
		],
		outputs: ["Established partnerships between med tech companies and hospitals, with med tech products tailored to meet specific hospital requirements.",
			"Regulatory and policy framework and communication strategies for hydrogen energy industry development, policy settings and public and industry communication strategies to balance hydrogen export market growth with sustainable and affordable domestic supply of energy."
		],
		usages: ["Hospitals support local procurement and integrate med tech products into operations.",
			"Federal and state governments/regulators will use the market development and regulatory frameworks and guidance to inform policy interventions to support the energy markets’ export industry development while ensuring domestic cost containment. Project partners will disseminate outputs through workshops and public channels at no cost to policy makers."
		],
		outcomes: ["Enhanced patient outcomes due to timely and appropriate health interventions, and a X% increase in Australia’s global market share for med tech.",
			"Strategies will increase market confidence, contributing to increased innovation and adoption of new technologies generated from this project."
		],
		userId: null, // Will be assigned after user creation
		programId: null // Will be assigned after user creation
	});

	// Create the example program and associate it with example LoS and Pitch 
	const exampleProgram = await ProgramModel.create({
		userId: null, // Will be assigned after user creation
		pitchId: examplePitch.id,
		losIds: [exampleLos.id]
	});


	// Create user 
	try {
		const userToAdd = await UserModel.create({
			email,
			name,
			passwordHash,
			programIds: [exampleProgram.id],
			pitchIds: [examplePitch.id],
			losIds: [exampleLos.id]
		});

		// Update the pitch 
		examplePitch.userId = userToAdd.id;
		examplePitch.programId = exampleProgram.id;
		await examplePitch.save();

		// Update the LoS
		exampleLos.userId = userToAdd.id;
		exampleLos.programId = exampleProgram.id;
		await exampleLos.save();

		// Update the Program 
		exampleProgram.userId = userToAdd.id;
		await exampleProgram.save();

		// Sanitise response - Send only necessary user information
		res.status(201).json({
			id: userToAdd.id,
			email: userToAdd.email,
			name: userToAdd.name,
		});

	} catch (error) {
		console.error("Error during user creation:", error);

		next(error);
	}
});


// Reset user password and email a reset link
router.post("/forgot-password", async (req, res, next) => {
	const { email } = req.body;
    
	try {
		const user = await UserModel.findOne({ where: { email } });

		if (!user) {
			res.status(404).send("User not found");
			return;
		}

		// Generate reset token and 5 minute expiration
		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiry = Date.now() + (5 * 60 * 1000); // 5 minutes

		// Save reset token and expiry to user
		await user.update({
			resetToken,
			resetTokenExpiry
		});

		// Send email with reset link
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

		const mailOptions = {
			to: email,
			subject: "Password Reset Request",
			html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire 5 minutes after it was sent.</p>`,
		};

		await transporter.sendMail(mailOptions);

		res.send("Reset email sent");
	} catch (error) {
		next(error);
	}
});


// Update user password after reset
router.put("/reset-password", async (req, res, next) => {
	try {
		const { token, newPassword, email } = req.body;

		// Validate new password
		if (!newPassword || newPassword.length < 8) {
			res.status(400).json({ error: "Password must be at least 8 characters long" });
			return;
		}

		// Find the user by resetToken and check if token is still valid
		const user = await UserModel.findOne({
			where: {
				email,
				resetToken: token,
				resetTokenExpiry: { [Op.gt]: Date.now() } 
			}
		});

		if (!user) {
			res.status(404).json({ error: "Invalid or expired token" });
			return;
		}

		// Hash the new password
		const saltRounds = 10;
		const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

		// Update the password and clear the reset token fields
		await user.update({
			passwordHash: newPasswordHash,
			resetToken: null,
			resetTokenExpiry: null
		});

		res.status(200).json({ message: "Password updated successfully" });
	} catch (error) {
		next(error);
	}
});

// Find user by email
router.get("/email/:email", async (req, res, next) => {
	try {
		await UserModel.findOne({
			where: { email: req.params.email },
			attributes: ["id", "email"] 
		});

		res.status(200).json({ message: "User found by email" });
	} catch (error) {
		next(error);
	}
});


// Remove user
router.delete("/:id", async (req, res, next) => {
	try {
		const userToDelete = await UserModel.findByPk(req.params.id);
		if (userToDelete) {
			await userToDelete.destroy();
			res.status(204).end();
		} else {
			res.status(404).json({ error: "User not found" });
			return;
		}
	} catch (error) {
		next(error);
	}
});

export default router;