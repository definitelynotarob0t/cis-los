import express from 'express';
import PitchModel from '../models/pitch';
import sessionValidator from '../util/sessionValidator';

const router = express.Router();

// Fetch all pitches
router.get('/', async (_req, res , next) => {
    try {
        const pitches = await PitchModel.findAll()
        res.json(pitches)
    }
    catch(error) {
        next(error)
    }
});

// Fetch single pitch by id
router.get('/:id', async (req, res, next) => {
    try {
        const pitch = await PitchModel.findByPk(req.params.id)
        res.json(pitch)
    } catch(error) {
        next(error)
    }
  });
  
// Create new pitch
router.post('/', sessionValidator, async (req, res, next) => {
    try {
        const { title, mainActivity, challenge, outcome } = req.body;
        const userId = req.user?.id; // Extract userId from the session

        if (!userId) {
            res.status(400).json({ error: 'User not authenticated.' });
            return
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
router.put('/:id', async (req, res, next) => {
    const pitchToUpdate = await PitchModel.findByPk(req.params.id)
    if (pitchToUpdate) {
            pitchToUpdate.title = req.body.title
            pitchToUpdate.mainActivity = req.body.mainActivity
            pitchToUpdate.challenge = req.body.challenge
            pitchToUpdate.outcome = req.body.outcome
        try {
            await pitchToUpdate.save()
            res.json(pitchToUpdate)
        } catch (error) {
            next(error)
        }          
    } else {
        res.status(400).json({error: Error})
    }
})

// Delete a pitch
router.delete('/:id', async (req, res, next) => {
    const pitchToDelete = await PitchModel.findByPk(req.params.id)
    if (pitchToDelete) {
        // if (pitchToDelete.userId === req.user?.id) {
            try {
                await pitchToDelete.destroy();
                res.status(204).end()
            } catch(error) {
                next(error)
            }
        // } else {
        //     res.status(403).json({ error: 'You are not authorized to delete this pitch.' });
        //     return
        // }
    } else {
        res.status(400).json({ error: Error})
    }
})

export default router;

