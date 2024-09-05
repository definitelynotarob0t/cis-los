import Session from '../models/session';
import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';


// Define a type for the decoded token payload
interface DecodedToken {
    id: number;      // User ID
    email: string;  
  }

// Validate session
const sessionValidator = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');
  let token = null;

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7);
  }

  if (!token) {
    res.status(401).json({ error: 'Token missing or invalid.' });
    return
  }

  if (!SECRET) {
    res.status(401).json({ error: 'SECRET is not defined in the environment variables.' });
    throw new Error('SECRET is not defined in the environment variables.');
  }

  try {
    const decodedToken = jwt.verify(token, SECRET) as DecodedToken;

    const session = await Session.findOne({
      where: {
        userId: decodedToken.id,
        token: token,
      }
    });

    if (!session) {
        res.status(401).json({ error: 'Session invalid.' });
        return
    }

    const user = await UserModel.findByPk(decodedToken.id);
    if (!user) {
        res.status(401).json({ error: 'User not found.' });
        return
    }

    req.user = {
      id: decodedToken.id,
      email: decodedToken.email 
    };

    next();
  } catch (error) {
        res.status(401).json({ error: 'Token invalid.' });
        return;
  }
};

export default sessionValidator
