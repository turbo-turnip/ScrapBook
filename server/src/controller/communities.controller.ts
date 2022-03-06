import { PrismaClient } from '.prisma/client';
import { log } from 'console';
import { Request, Response } from 'express';
import { authenticateUser } from '../service';
import { LogType } from '../util/log.util';

const prisma = new PrismaClient();

export const createCommunity = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const title: string = req.body?.title;
  const details: string = req.body?.details || "";
  const interests: Array<string> = req.body?.interests || [];

  try {
    const newCommunity = await prisma.community.create({
      data: {
        title,
        details,
        interests: {
          connectOrCreate: interests.map(interest => ({ create: { name: interest }, where: { name: interest } }))
        },
        members: {
          create: [{
            nickname: response.account.name,
            owner: true,
            user: {
              connect: { id: response.account.id }
            }
          }]
        },
        membersUser: {
          connect: { id: response.account.id }
        }
      },
      include: {
        interests: true,
        members: true,
        membersUser: true
      }
    });

    res.status(200).json({ success: true, community: newCommunity });
    return;
  } catch (err: any) {
    log(LogType.ERROR, err);
    res.status(500).json({ success: false, error: "An error occurred. Please refresh the page and try again" });
    return;
  }
}