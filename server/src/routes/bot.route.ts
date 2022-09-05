import { Router } from 'express';
import { findBot, purchaseAttachment } from '../controller/bot.controller';

export const BotRouter = Router();

BotRouter.post('/purchaseAttachment', purchaseAttachment);
BotRouter.post('/', findBot);