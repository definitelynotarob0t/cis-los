import jwt from "jsonwebtoken";
import express from "express";
import { SECRET } from "../util/config";
import UserModel from "../models/user";
import Session from "../models/session";
import bcrypt from "bcryptjs";

const router = express.Router();

// Log-in user, create session (by posting email and password in req.body)
router.post("/", async (req, res, next) => {
	const body = req.body;

	try {
		const user = await UserModel.findOne({
			where: {
				email: body.email
			}
		});
    
		if (!user) {
			res.status(401).json({ error: "Email not registered" });
			return
		}

		// Check if user exists and password is correct
		if (user && await bcrypt.compare(body.password, user.passwordHash)) {
    
			// Prepare payload for JWT
			const userForToken = {
				email: user.email,
				id: user.id,
			};
        
			if (!SECRET) {
				throw new Error("SECRET is not defined in the environment variables");
			}
        
			// Create JWT
			const token = jwt.sign(userForToken, SECRET);
        
			// Store session
			await Session.create({
				userId: user.id,
				token
			});
        
			// Send response with JWT and user details
			res.status(200).send({ token, name: user.name, id: user.id, programIds: user.programIds });

		}  
		else {
			res.status(401).json({ error: "Invalid password" })
			return
		}
	} catch (error) {
		next(error);
	}
});


export default router;