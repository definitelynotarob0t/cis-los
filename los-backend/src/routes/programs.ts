import express from "express";
import ProgramModel from "../models/program";
import sessionValidator from "../util/sessionValidator";
import { sequelize } from "../util/db"; 
import PitchModel from "../models/pitch";
import LosModel from "../models/los";
import UserModel from "../models/user";


const router = express.Router();

// Fetch all programs
router.get("/", async (_req, res , next) => {
	try {
		const programs = await ProgramModel.findAll();
		res.json(programs);
	}
	catch(error) {
		next(error);
	}
});



// Fetch single program by id
router.get("/:id", async (req, res, next) => {
	try {
		const program = await ProgramModel.findByPk(req.params.id);
		if (!program) {
			res.status(404).json({ error: "Program not found" });
			return;
		}
		res.json(program);
	} catch (error) {
		next(error);
	}
});
  
// Create new program with a pitch and los
router.post("/", sessionValidator, async (req, res, next) => {
	const t = await sequelize.transaction(); // Start transaction
	try {
		const userId = req.user?.id; // Extract userId from the session

		if (!userId) {
			res.status(401).json({ error: "User not authenticated." });
			return;
		}

		const user = await UserModel.findByPk(userId);

		if (!user) {
			res.status(404).json({ error: "User not found." });
			return;
		}

		// Create the new pitch first
		const newPitch = await PitchModel.create({
			title: "", 
			mainActivity: "",
			challenge: "",
			outcome: "",
			userId,
			programId: null 
		}, { transaction: t });

		// Create the associated LoS (using pitchId as losId)
		const newLos =  await LosModel.create({
			activities: [""],
			outputs: [""],
			usages: [""],
			outcomes: [""],
			userId,
			programId: null
		}, { transaction: t });

		// Create the program with the associated pitchId and userId
		const newProgram = await ProgramModel.create({
			userId,
			pitchId: newPitch.id, 
			losIds: [newLos.id] 
		}, { transaction: t });

		// Update the Pitch and LoS to reference the new Program ID
		await newPitch.update({ programId: newProgram.id }, { transaction: t });
		await newLos.update({ programId: newProgram.id }, { transaction: t });
        
		// Update user data
		user.programIds = [...(user.programIds || []), newProgram.id];
		user.pitchIds = [...(user.pitchIds || []), newPitch.id];
		user.losIds = [...(user.losIds || []), newLos.id];

		// Save user instance with transaction
		await user.save({ transaction: t });

		// Commit the transaction if everything is successful
		await t.commit();

		res.status(201).json(newProgram);
	} catch (error) {
		// Rollback the transaction if something goes wrong
		await t.rollback();
		next(error);
	}
});

// Delete a program
router.delete("/:id", sessionValidator, async (req, res, next) => {
	const t = await sequelize.transaction(); // Start transaction
	try {
		const userId = req.user?.id; // Extract userId from the session

		if (!userId) {
			res.status(401).json({ error: "User not authenticated." });
			return;
		}

		const programToDelete = await ProgramModel.findByPk(req.params.id);

		if (!programToDelete) {
			res.status(404).json({ error: "Program not found" });
			return;
		}
    
		const userToUpdate = await UserModel.findByPk(programToDelete.userId);
		if (!userToUpdate) {
			res.status(404).json({ error: "User not found." });
			return;
		}

		// Update user's programIds, losIds, and pitchIds
		userToUpdate.programIds = userToUpdate.programIds ? userToUpdate.programIds.filter((id: number) => id !== programToDelete.id) : [];
		userToUpdate.losIds = userToUpdate.losIds ? userToUpdate.losIds.filter((id: number) => !programToDelete.losIds?.includes(id)) : [];
		userToUpdate.pitchIds = userToUpdate.pitchIds ? userToUpdate.pitchIds.filter((id: number) => id !== programToDelete.pitchId) : [];
       
		// Save the updated user data
		await userToUpdate.save({ transaction: t });

		// Delete the program
		await programToDelete.destroy({ transaction: t });

		// Commit the transaction
		await t.commit();

		res.status(204).end();
	} catch (error) {
		// Rollback the transaction in case of error
		await t.rollback();

		next(error);
	}
});


export default router;

