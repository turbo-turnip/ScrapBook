import express, { Router } from 'express';
import { login } from '../controller/auth.controller';

export const AuthRouter = Router();

AuthRouter.post('/login', login);