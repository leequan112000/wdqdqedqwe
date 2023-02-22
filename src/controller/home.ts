import { Request, Response } from "express";

export const indexHome = (req: Request, res: Response) => res.status(200).json({ message: 'Welcome to Cromatic' });