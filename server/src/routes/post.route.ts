import express, { Router } from 'express';
import { createPost, likePost } from '../controller/post.controller';

export const PostRouter = Router();
PostRouter.post('/', createPost);
PostRouter.post('/like', likePost);