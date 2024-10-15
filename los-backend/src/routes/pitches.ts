import express from "express";
import PitchModel from "../models/pitch";
import sessionValidator from "../util/sessionValidator";

const router = express.Router();

// Fetch all pitches
router.get("/", async (_req, res , next) => {
	try {
		const pitches = await PitchModel.findAll();
		res.json(pitches);
	}
	catch(error) {
		next(error);
	}
});

// Fetch single pitch by id
router.get("/:id", async (req, res, next) => {
	try {
		const pitch = await PitchModel.findByPk(req.params.id);
		res.json(pitch);
	} catch(error) {
		next(error);
	}
});
  
// Create new pitch
router.post("/", sessionValidator, async (req, res, next) => {
	try {
		const { title, mainActivity, challenge, outcome } = req.body;
		const userId = req.user?.id; // Extract userId from the session

		if (!userId) {
			res.status(400).json({ error: "User not authenticated." });
			return;
		}

		const pitch = await PitchModel.create({
			title,
			mainActivity,
			challenge,
			outcome,
			userId 
		});

		res.status(201).json(pitch);
	} catch (error) {
		next(error);
	}
});

// Edit pre-existing pitch
router.put("/:id", sessionValidator, async (req, res, next) => {
	const userId = req.user?.id; // Extract userId from the session

	if (!userId) {
		res.status(400).json({ error: "User not authenticated." });
		return;
	}

	const pitchId = parseInt(req.params.id, 10);

	if (isNaN(pitchId)) {
		res.status(400).json({ error: "Invalid pitch ID" });
		return;
	}

	try {
		const pitchToUpdate = await PitchModel.findByPk(pitchId);
        
		if (pitchToUpdate) {
			pitchToUpdate.title = req.body.title;
			pitchToUpdate.mainActivity = req.body.mainActivity;
			pitchToUpdate.challenge = req.body.challenge;
			pitchToUpdate.outcome = req.body.outcome;
            
			await pitchToUpdate.save();
			res.json(pitchToUpdate);
		} else {
			res.status(404).json({ error: "Pitch not found" });
		}
	} catch (error) {
		next(error);
	}
});

// Delete a pitch
router.delete("/:id", async (req, res, next) => {
	const pitchToDelete = await PitchModel.findByPk(req.params.id);
	if (pitchToDelete) {
		try {
			await pitchToDelete.destroy();
			res.status(204).end();
		} catch(error) {
			next(error);
		}
	} else {
		res.status(400).json({ error: Error});
	}
});

export default router;

