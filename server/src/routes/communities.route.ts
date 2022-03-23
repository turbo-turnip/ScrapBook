import { Router } from 'express';
import { communitiesForUser, createCommunity, getCommunity, joinCommunity, leaveCommunity, searchCommunities } from '../controller/communities.controller';

export const CommunitiesRouter = Router();

CommunitiesRouter.post('/', createCommunity);
CommunitiesRouter.post('/forUser', communitiesForUser);
CommunitiesRouter.post('/community', getCommunity);
CommunitiesRouter.post('/search', searchCommunities);
CommunitiesRouter.post('/join', joinCommunity);
CommunitiesRouter.post('/leave', leaveCommunity);