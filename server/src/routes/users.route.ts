import { Router } from 'express';
import { addUser, findUser, followUser, optUserOut, renameUser, searchUsers, sendVerificationEmail, updateDetails, updateInterests, verifyUser } from '../controller/user.controller';

export const UserRouter = Router();

UserRouter.post('/', addUser);
UserRouter.post('/sendVerificationEmail', sendVerificationEmail);
UserRouter.post('/verify', verifyUser);
UserRouter.post('/find', findUser);
UserRouter.post('/rename', renameUser);
UserRouter.post('/updateDetails', updateDetails);
UserRouter.post('/updateInterests', updateInterests);
UserRouter.post('/optOut', optUserOut);
UserRouter.post('/follow', followUser);
UserRouter.post('/search', searchUsers);