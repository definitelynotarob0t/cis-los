import bcrypt from 'bcrypt'
import express from 'express';
import UserModel from '../models/user';
import PitchModel from '../models/pitch';
import LosModel from '../models/los';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';

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


// Reset user password and email a reset link
router.post('/forgot-password', async (req, res, next) => {
    const { email } = req.body;
    
    try {
        const user = await UserModel.findOne({ where: { email } });

        if (!user) {
            res.status(404).send('User not found');
            return
        }

        // Generate reset token and 5 minute expiration
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + (5 * 60 * 1000); // 5 minutes

        // Save reset token and expiry to user
        await user.update({
            resetToken,
            resetTokenExpiry
        });

        // Send email with reset link
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

        const mailOptions = {
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 5 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.send('Reset email sent');
    } catch (error) {
        next(error);
    }
});


// Update user password after reset
router.put('/reset-password', async (req, res, next) => {
    try {
        const { token, newPassword, email } = req.body;

        // Validate new password
        if (!newPassword || newPassword.length < 8) {
            res.status(400).json({ error: 'Password must be at least 8 characters long' });
            return
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
            res.status(404).json({ error: 'Invalid or expired token' });
            return
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

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
});

// Find user by email
router.get('/email/:email', async (req, res, next) => {
    try {
        const user = await UserModel.findOne({
            where: { email: req.params.email },
            attributes: ['id', 'email'] 
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
});


// Remove user
router.delete('/:id', async (req, res, next) => {
    try {
        const userToDelete = await UserModel.findByPk(req.params.id)
        if (userToDelete) {
            await userToDelete.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'User not found' })
            return
        }
    } catch (error) {
        next(error)
    }
})

export default router