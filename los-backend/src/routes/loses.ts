import express from "express";
import LosModel from "../models/los";
import sessionValidator from "../util/sessionValidator";
import ProgramModel from "../models/program";
import UserModel from "../models/user";
import passwordValidator from "../util/passwordValidator";

const router = express.Router();

// Fetch all loses
router.get("/", passwordValidator, async (_req, res , next) => {
	try {
		const loses = await LosModel.findAll();
		res.json(loses);
	}
	catch(error) {
		next(error);
	}
});

// Fetch single los by id
router.get("/:id", passwordValidator, async (req, res, next) => {
	try {
		const los = await LosModel.findByPk(req.params.id);
		res.json(los);
	} catch(error) {
		next(error);
	}
});
  
// Create new los
router.post("/", sessionValidator, async (req, res, next) => {
	try {
		const { activities, outputs, usages, outcomes, programId } = req.body;
		const userId = req.user?.id; // Extract userId from the session


		if (!userId) {
			res.status(400).json({ error: "User not authenticated." });
			return;
		}

		const los = await LosModel.create({
			activities,
			outputs,
			usages,
			outcomes,
			userId,
			programId
		});

		const programToUpdate = await ProgramModel.findOne( {where: {id: programId} });
		if (!programToUpdate) {
			res.status(404).json({ error: "Program not found." });
			return;
		}

		const userToUpdate = await UserModel.findByPk(userId);
		if (!userToUpdate) {
			res.status(404).json({ error: "User not found." });
			return;
		}
		userToUpdate.losIds = [...(userToUpdate.losIds || []), los.id];
		programToUpdate.losIds = [...(programToUpdate.losIds || []), los.id];

		await userToUpdate.save();
		await programToUpdate.save();

		res.status(201).json(los);
		return;
	} catch (error) {
		next(error);
	}
});

// Edit pre-existing los
router.put("/:id", sessionValidator, async (req, res, next) => {
	const userId = req.user?.id; // Extract userId from the session

	if (!userId) {
		res.status(400).json({ error: "User not authenticated." });
		return;
	}

	const losToUpdate = await LosModel.findByPk(req.params.id);
	if (losToUpdate) {
		losToUpdate.activities = req.body.activities;
		losToUpdate.outputs = req.body.outputs;
		losToUpdate.usages = req.body.usages;
		losToUpdate.outcomes = req.body.outcomes;
		try {
			await losToUpdate.save();
			res.json(losToUpdate);
		} catch (error) {
			next(error);
		}          
	} else {
		res.status(400).json({error: Error});
	}
});

// Delete a los
router.delete("/:id", sessionValidator, async (req, res, next) => {
	const userId = req.user?.id; // Extract userId from the session

	if (!userId) {
		res.status(400).json({ error: "User not authenticated." });
		return;
	}

	const losToDelete = await LosModel.findByPk(req.params.id);
	if (!losToDelete) {
		res.status(404).json({ error: "LoS not found." });
		return;
	}

	try {
		// Update program to remove the deleted LoS
		const programToUpdate = await ProgramModel.findOne({ where: { id: losToDelete.programId } });
		if (!programToUpdate) {
			res.status(404).json({ error: "Program not found." });
			return;
		}

		// Filter out the losId from program's losIds and reassign
		programToUpdate.losIds = programToUpdate.losIds?.filter((id) => id !== losToDelete.id) || [];
		await programToUpdate.save();

		// Update user to remove the deleted LoS
		const userToUpdate = await UserModel.findByPk(userId);
		if (!userToUpdate) {
			res.status(404).json({ error: "User not found." });
			return;
		}

		// Filter out the losId from user's losIds and reassign
		userToUpdate.losIds = userToUpdate.losIds?.filter((id) => id !== losToDelete.id) || [];
		await userToUpdate.save();

		// Delete the LoS
		await losToDelete.destroy();
		res.status(204).end();
		return;

	} catch (error) {
		next(error);
	}
});

export default router;

