import express from 'express';
import LosModel from '../models/los';
import sessionValidator from '../util/sessionValidator';

const router = express.Router();

// Fetch all loses
router.get('/', async (_req, res , next) => {
    try {
        const loses = await LosModel.findAll()
        res.json(loses)
    }
    catch(error) {
        next(error)
    }
});

// Fetch single los by id
router.get('/:id', async (req, res, next) => {
    try {
        const los = await LosModel.findByPk(req.params.id)
        res.json(los)
    } catch(error) {
        next(error)
    }
  });
  
// Create new los
router.post('/', sessionValidator, async (req, res, next) => {
    try {
        const { inputs, activities, outputs, usages, outcomes } = req.body;
        const userId = req.user?.id; // Extract userId from the session

        if (!userId) {
            res.status(400).json({ error: 'User not authenticated.' });
            return
        }

        const los = await LosModel.create({
        inputs,
        activities,
        outputs,
        usages,
        outcomes,
        userId 
        });

        res.status(201).json(los);
    } catch (error) {
        next(error);
    }
});

// Edit pre-existing los
router.put('/:id', async (req, res, next) => {
    const losToUpdate = await LosModel.findByPk(req.params.id)
    if (losToUpdate) {
            losToUpdate.inputs = req.body.inputs
            losToUpdate.activities = req.body.activities
            losToUpdate.outputs = req.body.outputs
            losToUpdate.usages = req.body.usages
            losToUpdate.outcomes = req.body.outcomes
        try {
            await losToUpdate.save()
            res.json(losToUpdate)
        } catch (error) {
            next(error)
        }          
    } else {
        res.status(400).json({error: Error})
    }
})

// Delete a los
router.delete('/:id', async (req, res, next) => {
    const losToDelete = await LosModel.findByPk(req.params.id)
    if (losToDelete) {
        // if (losToDelete.userId === req.user?.id) {
            try {
                await losToDelete.destroy();
                res.status(204).end()
            } catch(error) {
                next(error)
            }
        // } else {
        //     res.status(403).json({ error: 'You are not authorized to delete this los.' });
        //     return
        // }
    } else {
        res.status(400).json({ error: Error})
    }
})

export default router;

