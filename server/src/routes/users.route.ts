import { Router } from 'express';
import { addUser, findUser, renameUser, sendVerificationEmail, verifyUser } from '../controller/user.controller';

export const UserRouter = Router();

UserRouter.post('/', addUser);
UserRouter.post('/sendVerificationEmail', sendVerificationEmail);
UserRouter.post('/verify', verifyUser);
UserRouter.post('/find', findUser);
UserRouter.post('/rename', renameUser);