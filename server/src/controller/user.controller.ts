import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addUser = async (req: Request, res: Response) => {
  const name: string = req.body.name;
  const email: string = req.body.email;
  const password: string = req.body.password;

  try { 
    await prisma.user.create({
      data: {
        name, email, password
      }
    });
  } catch (err) {
    console.log('error');
  }
}