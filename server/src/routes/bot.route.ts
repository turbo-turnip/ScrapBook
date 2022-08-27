import { Router } from 'express';
import { purchaseAttachment } from '../controller/bot.controller';

export const BotRouter = Router();

BotRouter.post('/purchaseAttachment', purchaseAttachment);