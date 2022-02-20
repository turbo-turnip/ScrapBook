import express, { Router } from 'express';
import { addUser, sendVerificationEmail, verifyUser } from '../controller/user.controller';

export const UserRouter = Router();

UserRouter.post('/', addUser);
UserRouter.post('/sendVerificationEmail', sendVerificationEmail);
UserRouter.post('/verify', verifyUser);