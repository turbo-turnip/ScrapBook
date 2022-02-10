import express, { Router, Request, Response } from 'express';
import { addUser } from '../controller/user.controller';

export const UserRouter = Router();

UserRouter.post('/', addUser);