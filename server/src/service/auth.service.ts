import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import env from '../config/env.config';
import { UserType } from './user.service';

const prisma = new PrismaClient();

// Generate access and refresh tokens
export const generateTokens = (user: UserType) => {
  return new Promise<Array<string>>(async (res) => {
    // Access token expires in 15 minutes
    const accessToken = await sign(user, env.AT_SECRET, {
      expiresIn: 60 * 15
    });
    // Refresh token expires in 30 days
    const refreshToken = await sign({ id: user.id }, env.RT_SECRET, {
      expiresIn: 60 * 60 * 24 * 30
    });

    res([accessToken, refreshToken]);
  });
}

// Returns a [Promise] boolean wether the refresh token is in the banned table or not
export const refreshTokenIsBanned = (refreshToken: string) => {
  return new Promise<boolean>(async res => {
    // Find first refresh token that matches parameter
    const refreshTokenExists = await prisma.bannedRefreshTokens.findFirst({ where: { refreshToken } });
    res(refreshTokenExists != null);
  });
}

// Insert a refresh token into the banned refresh token list
export const banRefreshToken = (refreshToken: string) => {
  return new Promise<void>(async (res) => {
    await prisma.bannedRefreshTokens.create({
      data: { refreshToken }
    });

    res();
  });
}