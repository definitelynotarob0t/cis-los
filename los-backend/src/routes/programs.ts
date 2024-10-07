import express from 'express';
import ProgramModel from '../models/program';
import sessionValidator from '../util/sessionValidator';
import { sequelize } from '../util/db'; 
import PitchModel from '../models/pitch';
import LosModel from '../models/los';
import UserModel from '../models/user';


const router = express.Router();

// Fetch all programs
router.get('/', async (_req, res , next) => {
    try {
        const programs = await ProgramModel.findAll()
        res.json(programs)
    }
    catch(error) {
        next(error)
    }
});



// Fetch single program by id
router.get('/:id', async (req, res, next) => {
    try {
        const program = await ProgramModel.findByPk(req.params.id);
        if (!program) {
            res.status(404).json({ error: 'Program not found' });
            return
        }
        res.json(program);
    } catch (error) {
        next(error);
    }
});
  
// Create new program with a pitch and los
router.post('/', sessionValidator, async (req, res, next) => {
    const t = await sequelize.transaction(); // Start transaction
    try {
        const userId = req.user?.id; // Extract userId from the session

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated.' });
            return;
        }

        const user = await UserModel.findByPk(userId)

        if (!user) {
            res.status(404).json({ error: 'User not found.' });
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
            id: newPitch.id,
            inputs: [],
            activities: [],
            outputs: [],
            usages: [],
            outcomes: [],
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

        // Ensure programIds is initialized if it's null
        const updatedProgramIds = user.programIds ? [...user.programIds] : [];
        updatedProgramIds.push(newProgram.id);

        // Assign the updated array back to the user instance
        user.programIds = updatedProgramIds;

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
router.delete('/:id', sessionValidator, async (req, res, next) => {
    try {
        const programToDelete = await ProgramModel.findByPk(req.params.id);


        if (!programToDelete) {
            res.status(404).json({ error: 'Program not found' });
            return
        }
    
        const userToUpdate = await UserModel.findByPk(programToDelete.userId);

        if (programToDelete.userId === req.user?.id && userToUpdate && userToUpdate.programIds) {
            try {
                userToUpdate.programIds = userToUpdate.programIds.filter((id: number) => id !== programToDelete.id);
                await userToUpdate.save();
                await programToDelete.destroy();
                res.status(204).end()
            } catch(error) {
                next(error)
            }
        } else {
            res.status(403).json({ error: 'You are not authorized to delete this program.' });
            return
        }
    } catch (error) {
        next(error);
    }
});

export default router;

