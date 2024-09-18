import bcrypt from 'bcrypt'
import express from 'express';
import UserModel from '../models/user';
import PitchModel from '../models/pitch';
import LosModel from '../models/los';

const router = express.Router();


// Get all users
router.get('/', async (_req, res, next) => {
    try {
        const users = await UserModel.findAll({ 
            attributes: ['id', 'email', 'name', 'pitchId'],
            // include: { 
            //     model: PitchModel, 
            //     attributes: ['id', 'title'], 
            //     required: false 
            // }
        })
        res.json(users)
    }    catch(error) {
        next(error)
    }
}) 

// Get individual user
router.get('/:id', async (req, res, next) => {
    try {
        const user = await UserModel.findOne({
            where: { id: req.params.id},
            attributes: ['id', 'email', 'name', 'pitchId'],
            // include: { 
            //     model: PitchModel, 
            //     attributes: ['id', 'title'], 
            //     required: false 
            // }
        })

        if (user) {
            res.json(user)
        } else {
            res.status(404).json({ error: 'User not found' })
            return
        }
    } catch (error) {
        next(error)
    }
})

// Update user password 
router.put('/:id', async (req, res, next) => {
    try {
        const { password: newPassword } = req.body;

        // Validate new password
        if (!newPassword || newPassword.length < 8) {
            res.status(400).json({ error: 'Password must be at least 8 characters long' });
            return;
        }

        const userToUpdate = await UserModel.findByPk(req.params.id);

        if (!userToUpdate) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        await userToUpdate.update({ passwordHash: newPasswordHash });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
}); // implement validation - user inputs email and old password before changing? ... email sent to user saying password updated?



// Create new user
router.post('/', async (req, res, next) => {
    const { email, name, password } = req.body

    // Validate password
    if (!password || password.length < 8) {
        res.status(400).json({ error: 'Password must be at least 8 characters long.' }).end();
        return;
    }

    // Check for existing email
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
        res.status(400).json({ error: 'Email is already registered.' });
        return;
    }

    // Encrypt password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)


    // Create a blank pitch to associate with new user
    const blankPitch = await PitchModel.create({
        title: "",
        mainActivity: "",
        challenge: "",
        outcome: "",
        userId: null // Will be assigned after user creation
    });

    // Create a blank LoS to associate with new user
    const blankLos = await LosModel.create({
        id: blankPitch.id,
        inputs: [],
        activities: [],
        outputs: [],
        usages: [],
        outcomes: [],
        userId: null // Will be assigned after user creation
    })

    // Create user 
    try {
        const userToAdd = await UserModel.create({
            email,
            name,
            passwordHash,
            pitchId: blankPitch.id 
        })

        // Update the pitch with the created user's ID
        blankPitch.userId = userToAdd.id;
        await blankPitch.save();

        // Update the LoS with the created user's ID
        blankLos.userId = userToAdd.id;
        await blankLos.save()

        res.status(201).json(userToAdd)

    } catch (error) {
        next(error)
    }
})


// Remove user
router.delete('/:id', async (req, res, next) => {
    try {
        const userToDelete = await UserModel.findByPk(req.params.id)
        if (userToDelete) {
            await userToDelete.destroy();
            res.status(204)
        } else {
            res.status(404).json({ error: 'User not found' })
            return
        }
    } catch (error) {
        next(error)
    }
})

export default router