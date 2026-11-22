import type {NextFunction } from "express";


export function isLoggedIn( req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        return next()
    }
      res.status(401).send({ message: 'you need to be logged in to acess this content' });
}

