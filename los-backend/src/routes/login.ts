import jwt from 'jsonwebtoken'
import express from 'express';
import { SECRET } from '../util/config'
import UserModel from '../models/user';
import Session from '../models/session';
import bcrypt from 'bcrypt'

const router = express.Router();


// Log-in user, create session (by posting email and password in req.body)
router.post('/', async (req, res, next) => {
  const body = req.body

  try {
    const user = await UserModel.findOne({
        where: {
          email: body.email
        }
      })
    
    if (!user) {
        res.status(401).json({ error: 'Email not registered' });
    }

    // Check if user exists and password is correct
    if (user && await bcrypt.compare(body.password, user.passwordHash)) {
        if (user.disabled) {
          res.status(401).json({ error: 'Account disabled' });
          return
        } 
    
        // Prepare payload for JWT
        const userForToken = {
            email: user.email,
            id: user.id,
          }
        
          if (!SECRET) {
            throw new Error('SECRET is not defined in the environment variables');
          }
        
          // Create JWT
          const token = jwt.sign(userForToken, SECRET)
          // add expiration? - const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' });
        
          // Store session
          await Session.create({
            userId: user.id,
            token
          });
        
          // Send response with JWT and user details
          res.status(200).send({ token, name: user.name, id: user.id, pitchId: user.pitchId })
    // } else {
    //     res.status(401).json({ error: 'Incorrect password' });
    //     return
    }  
  } catch (error) {
    next(error)
  }
});


export default router;