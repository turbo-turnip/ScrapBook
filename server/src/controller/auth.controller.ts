import { Request, Response } from 'express';
import { generateTokens, getUser, getUserByEmail, userExists, UserType, refreshTokenIsBanned, banRefreshToken, authenticateUser } from '../service';
import { PrismaClient } from '@prisma/client';
import { verify as verifyHash } from 'argon2';
import { decode, JsonWebTokenError, JwtPayload, sign, TokenExpiredError, verify as verifyToken } from 'jsonwebtoken';
import env from '../config/env.config';
import { log, LogType } from '../util/log.util';

const prisma = new PrismaClient();

// POST :8080/auth/login
// Generate access token and refresh tokens from email and password
export const login = async (req: Request, res: Response) => {
  const email: string = req.body?.email || "";
  const password: string = req.body?.password || "";
  let user: UserType;

  try {
    user = await getUserByEmail(email);
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ success: false, error: "Invalid email" });
    return;
  }

  const passwordCorrect = await verifyHash(user.password, password);
  if (!passwordCorrect) {
    res.status(403).json({ success: false, error: "Invalid password" });
    return;
  }

  const [accessToken, refreshToken] = await generateTokens(user);
  res.status(200).json({ success: true, accessToken, refreshToken });
}

// POST :8080/auth/account
// Use access and refresh tokens to get user account
export const getAccount = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";

  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (success) {
    res.status(200).json({ success, ...response });
    return;
  } else {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid access or refresh token" });
    return;
  }
}