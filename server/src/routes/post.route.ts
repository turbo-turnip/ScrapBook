import express, { Router } from 'express';
import { createPost } from '../controller/post.controller';

export const PostRouter = Router();
PostRouter.post('/', createPost);