import { Router } from 'express';
import { communitiesForUser, createCommunity, editCommunity, fetchCommunity, joinCommunity, leaveCommunity, searchCommunities } from '../controller/communities.controller';

export const CommunitiesRouter = Router();

CommunitiesRouter.post('/', createCommunity);
CommunitiesRouter.post('/forUser', communitiesForUser);
CommunitiesRouter.post('/community', fetchCommunity);
CommunitiesRouter.post('/search', searchCommunities);
CommunitiesRouter.post('/join', joinCommunity);
CommunitiesRouter.post('/leave', leaveCommunity);
CommunitiesRouter.post('/edit', editCommunity);