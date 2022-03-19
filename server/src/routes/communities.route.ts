import { Router } from 'express';
import { communitiesForUser, createCommunity, getCommunity, searchCommunities } from '../controller/communities.controller';

export const CommunitiesRouter = Router();

CommunitiesRouter.post('/', createCommunity);
CommunitiesRouter.post('/forUser', communitiesForUser);
CommunitiesRouter.post('/community', getCommunity);
CommunitiesRouter.post('/search', searchCommunities);