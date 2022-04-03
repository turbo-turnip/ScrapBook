import express, { Router } from 'express';
import { createFolder, foldersForUser, removeUserFolder } from '../controller/folders.controller';

export const FoldersRouter = Router();
FoldersRouter.post('/forUser', foldersForUser);
FoldersRouter.post('/', createFolder);
FoldersRouter.post('/removeUser', removeUserFolder);