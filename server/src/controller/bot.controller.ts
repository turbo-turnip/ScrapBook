import { Request, Response } from 'express';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { BotAttachmentType, canAffordAttachment, getAttachmentIDs, getBotAttachment, multipleAttachments } from '../service/bot.service';
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

  res.status(200).json({ success: true, ...response, attachments: updatedBot?.attachments || [] });
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

// POST :8080/bot/saveAttachments
// Save attachment positions on bot
export const saveAttachments = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || ""; 
  const newAttachments: { [key: string]: BotAttachmentType|null } = req.body?.newAttachments;
  const { newHeadAttachment, newFaceAttachment, newWristAttachment, newFeetAttachment } = newAttachments;

  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const userBot = await prisma.bot.findUnique({
    where: {
      userID: response.account.id
    },
    select: { id: true }
  });
 
  if (userBot) {
    if (newHeadAttachment) {
      const headConfigIDs = await getAttachmentIDs("Head");

      const headAttachments = await prisma.botAttachment.findMany({
        where: { 
          configID: {
            in: headConfigIDs
          }
        }
      });

      const mainHeadAttachment = headAttachments.find(att => att.main);
      const newHeadObj = headAttachments.find(att => att.configID === newHeadAttachment.configID);

      if (!mainHeadAttachment || !newHeadObj) 
        return res.status(500).json({ success: false, error: "Something went wrong. Please try again" });

      await prisma.botAttachment.update({
        where: { id: mainHeadAttachment.id },
        data: {
          main: false
        }
      });

      await prisma.botAttachment.update({
        where: { id: newHeadObj.id },
        data: {
          main: true
        }
      });
    }

    if (newFaceAttachment) {
      const faceConfigIDs = await getAttachmentIDs("Face");

      const faceAttachments = await prisma.botAttachment.findMany({
        where: { 
          configID: {
            in: faceConfigIDs
          }
        }
      });

      const mainFaceAttachment = faceAttachments.find(att => att.main);
      const newFaceObj = faceAttachments.find(att => att.configID === newFaceAttachment.configID);

      if (!mainFaceAttachment || !newFaceObj) 
        return res.status(500).json({ success: false, error: "Something went wrong. Please try again" });

      await prisma.botAttachment.update({
        where: { id: mainFaceAttachment.id },
        data: {
          main: false
        }
      });

      await prisma.botAttachment.update({
        where: { id: newFaceObj.id },
        data: {
          main: true
        }
      });
    }

    if (newWristAttachment) {
      const wristConfigIDs = await getAttachmentIDs("Wrist");

      const wristAttachments = await prisma.botAttachment.findMany({
        where: { 
          configID: {
            in: wristConfigIDs
          }
        }
      });

      const mainWristAttachment = wristAttachments.find(att => att.main);
      const newWristObj = wristAttachments.find(att => att.configID === newWristAttachment.configID);

      if (!mainWristAttachment || !newWristObj) 
        return res.status(500).json({ success: false, error: "Something went wrong. Please try again" });

      await prisma.botAttachment.update({
        where: { id: mainWristAttachment.id },
        data: {
          main: false
        }
      });

      await prisma.botAttachment.update({
        where: { id: newWristObj.id },
        data: {
          main: true
        }
      });
    }

    if (newFeetAttachment) {
      const feetConfigIDs = await getAttachmentIDs("Feet");

      const feetAttachments = await prisma.botAttachment.findMany({
        where: { 
          configID: {
            in: feetConfigIDs
          }
        }
      });

      const mainFeetAttachment = feetAttachments.find(att => att.main);
      const newFeetObj = feetAttachments.find(att => att.configID === newFeetAttachment.configID);

      if (!mainFeetAttachment || !newFeetObj) 
        return res.status(500).json({ success: false, error: "Something went wrong. Please try again" });

      await prisma.botAttachment.update({
        where: { id: mainFeetAttachment.id },
        data: {
          main: false
        }
      });

      await prisma.botAttachment.update({
        where: { id: newFeetObj.id },
        data: {
          main: true
        }
      });
    }

    const updatedAccount = await prisma.user.findUnique({
      where: { id: response.account.id },
      include: {
        interests: true,
        blockedUsers: true,
        communities: true,
        posts: true,
        followers: true,
        friends: true,
        messages: true,
        openDMs: true,
        bot: {
          include: {
            attachments: true
          }
        },
        folders: {
          include: {
            posts: true
          }
        }
      }
    });
    
    res.status(200).json({ success: true, message: "Successfully saved attachments", updatedAccount, ...response });
    return;
  }
  
  res.status(500).json({ success: false, error: "Please refresh the page" });
}