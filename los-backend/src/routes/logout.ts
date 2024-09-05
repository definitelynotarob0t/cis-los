import express from 'express';
import sessionValidator from '../util/sessionValidator';
import Session from '../models/session';

const router = express.Router();

// Logout 
router.delete('/', sessionValidator, async (req, res, next) => {
  try {
    const authHeader = req.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(400).json({ error: 'Authorization header missing or invalid' });
        return;
    }

    const token = authHeader.substring(7);

    await Session.destroy({
      where: {
        userId: req.user?.id,
        token: token
      }
    });

    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    next(error);
  }
});

export default router;
