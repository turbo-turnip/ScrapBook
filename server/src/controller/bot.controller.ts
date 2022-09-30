import { Request, Response } from 'express';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { canAffordAttachment, getAttachmentIDs, getBotAttachment, multipleAttachments } from '../service/bot.service';
import { authenticateUser, getUser } from '../service';
import { log, LogType } from '../util/log.util';

const prisma = new PrismaClient();

// POST :8080/bot/purchaseAttachment
// Purchase a certain attachment for a user
export const purchaseAttachment = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const attachmentID: string = req.body?.attachmentID || "";

  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const attachment = await getBotAttachment(attachmentID);
  if (!attachment) {
    res.status(400).json({ success: false, error: "Invalid attachment" });
    return;
  }

  const canAfford = await canAffordAttachment(attachment, response.account);
  if (!canAfford) {
    res.status(403).json({ success: false, error: "You can't afford this attachment!" });
    return;
  }

  
  var updatedBot: any = await prisma.bot.update({
    where: { id: response.account.bot.id },
    data: {
      attachments: {
        create: {
          configID: attachmentID,
          main: true
        }
      }
    },
    include: { attachments: true }
  });
  
  const multiplePurchasedAttachments = await multipleAttachments(attachment.attachmentType, updatedBot.attachments);

  if (multiplePurchasedAttachments) {
    const attachmentConfigIDs = await getAttachmentIDs(attachment.attachmentType);

    await prisma.botAttachment.updateMany({
      where: {
        bot: { id: response.account.bot.id },
        configID: {
          in: attachmentConfigIDs,
          not: attachmentID
        }
      },
      data: {
        main: false
      }
    });

    updatedBot = await prisma.bot.findUnique({
      where: { id: response.account.bot.id },
      include: { attachments: true }
    });
  }

  await prisma.user.update({
    where: { id: response.account.id },
    data: {
      coins: response.account.coins - parseFloat(attachment.attachmentCost)
    },
    include: {
      bot: {
        include: {
          attachments: true
        }
      }
    }
  });

  res.status(200).json({ success: true, ...response, attachments: updatedBot?.attachments || [] })
}

// POST :8080/bot
// Fetch a certain user's bot
export const findBot = async (req: Request, res: Response) => {
  const userID = req.body?.userID || "";
  const account = await getUser("id", userID);
  if (!account) {
    res.status(400).json({ success: false, error: "Invalid account" });
    return;
  }

  const userBot = await prisma.bot.findFirst({
    where: {
      user: { id: account.id }
    },
    include: { attachments: true }
  });

  res.status(200).json({ success: true, userBot, coins: account.coins });
}