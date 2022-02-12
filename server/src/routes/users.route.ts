import express, { Router, Request, Response } from 'express';
import { addUser, sendVerificationEmail } from '../controller/user.controller';

export const UserRouter = Router();

UserRouter.post('/', addUser);
UserRouter.post('/sendVerificationEmail', sendVerificationEmail);