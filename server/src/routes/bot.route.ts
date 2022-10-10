import { Router } from 'express';
import { findBot, purchaseAttachment, saveAttachments } from '../controller/bot.controller';

export const BotRouter = Router();

BotRouter.post('/purchaseAttachment', purchaseAttachment);
BotRouter.post('/saveAttachments', saveAttachments);
BotRouter.post('/', findBot);