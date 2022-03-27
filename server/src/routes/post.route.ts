import express, { Router } from 'express';
import { commentOnPost, createPost, likeComment, likePost, replyToComment } from '../controller/post.controller';

export const PostRouter = Router();
PostRouter.post('/', createPost);
PostRouter.post('/like', likePost);
PostRouter.post('/comment', commentOnPost);
PostRouter.post('/likeComment', likeComment);
PostRouter.post('/replyComment', replyToComment);