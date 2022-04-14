import express, { Router } from 'express';
import { addPostToFolder, createFolder, editFolderLabel, findFolder, foldersForUser, removePostFromFolder, removeUserFolder } from '../controller/folders.controller';

export const FoldersRouter = Router();
FoldersRouter.post('/forUser', foldersForUser);
FoldersRouter.post('/', createFolder);
FoldersRouter.post('/removeUser', removeUserFolder);
FoldersRouter.post('/find', findFolder);
FoldersRouter.post('/addPost', addPostToFolder);
FoldersRouter.post('/removePost', removePostFromFolder);
FoldersRouter.post('/editLabel', editFolderLabel);