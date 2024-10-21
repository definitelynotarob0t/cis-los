import { Request, Response, NextFunction } from 'express';

const passwordValidator = (req: Request, res: Response, next: NextFunction) => {
  const providedPassword = req.headers['x-api-password'];

  if (providedPassword === process.env.API_PASSWORD) {
    next(); // Password is correct, proceed to the next middleware/route handler
  } else {
    res.status(403).json({ error: 'Access denied' });
    return 
  }
};

export default passwordValidator;
