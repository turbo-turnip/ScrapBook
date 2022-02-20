import { Request, Response } from 'express';
import { generateTokens, getUserByEmail } from '../service';
import { PrismaClient } from '@prisma/client';
import { verify } from 'argon2';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

// POST :8080/auth/login
// Generate access token and refresh tokens from email and password
export const login = async (req: Request, res: Response) => {
  const email: string = req.body?.email || "";
  const password: string = req.body?.password || "";
  let user;

  try {
    user = await getUserByEmail(email);
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ success: false, error: "Invalid email" });
    return;
  }

  const passwordCorrect = await verify(user.password, password);
  if (!passwordCorrect) {
    res.status(403).json({ success: false, error: "Invalid password" });
    return;
  }

  const [accessToken, refreshToken] = await generateTokens(user);
  res.status(200).json({ success: true, accessToken, refreshToken });
}