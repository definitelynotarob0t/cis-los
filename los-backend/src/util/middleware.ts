import { Request, Response, NextFunction } from 'express';

interface ErrorWithName extends Error {
    name: string;
}

export const unknownEndpoint = (_req: Request, res: Response): void => {
    res.status(404).send({ error: 'unknown endpoint' })
}

export const errorHandler = (error: ErrorWithName , _req: Request, res: Response, next: NextFunction)
: Response<any, Record<string, any>> | void => {
    if (error.name === 'SequelizeValidationError') {
        // add specific error handling for invalid email
        return res.status(400).json({ error: error.message })
    } else if (error.name === 'NotFoundError') { 
        return res.status(404).json({ error: 'Not found' })
    } else if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).json({error: error.message})
    }

    console.error(error)
    res.status(500).json({ error: 'An unknown error occurred' })

    next(error)
}
    

  