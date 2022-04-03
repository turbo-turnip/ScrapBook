import express, { Router } from 'express';
import { createFolder, foldersForUser } from '../controller/folders.controller';

export const FoldersRouter = Router();
FoldersRouter.post('/forUser', foldersForUser);
FoldersRouter.post('/', createFolder);