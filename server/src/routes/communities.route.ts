import { Router } from 'express';
import { createCommunity } from '../controller/communities.controller';

export const CommunitiesRouter = Router();

CommunitiesRouter.post('/', createCommunity);