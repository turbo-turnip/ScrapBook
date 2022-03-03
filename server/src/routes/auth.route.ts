import express, { Router } from 'express';
import { getAccount, login } from '../controller/auth.controller';

export const AuthRouter = Router();

AuthRouter.post('/login', login);
AuthRouter.post('/account', getAccount);