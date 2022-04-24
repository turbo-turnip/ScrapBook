import express, { Router } from 'express';
import { addUser, findUser, sendVerificationEmail, verifyUser } from '../controller/user.controller';

export const UserRouter = Router();

UserRouter.post('/', addUser);
UserRouter.post('/sendVerificationEmail', sendVerificationEmail);
UserRouter.post('/verify', verifyUser);
UserRouter.post('/find', findUser);