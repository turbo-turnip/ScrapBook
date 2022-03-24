import { PrismaClient } from '@prisma/client';
import { JsonWebTokenError, JwtPayload, sign, TokenExpiredError } from 'jsonwebtoken';
import env from '../config/env.config';
import { getUser, UserType } from './user.service';
import { verify as verifyToken } from 'jsonwebtoken';
import { userExists } from './';
import { log, LogType } from '../util/log.util';

const prisma = new PrismaClient();

// Authenticate user and return account with accessToken and refreshToken
export const authenticateUser = (accessToken: string, refreshToken: string) => {
  return new Promise<{ success: boolean, response: any }>(async (res, rej) => {
    try {
      const decodedAccessToken = await verifyToken(accessToken, env.AT_SECRET as string) as JwtPayload;
      const accountExists = await userExists("id", decodedAccessToken?.id || "");
      if (!accountExists) {
        res({ success: false, response: "Invalid access token" });
        return;
      }

      res({ success: true, response: { generateNewTokens: false, account: decodedAccessToken } });
    } catch (err: any) {
      if (err instanceof JsonWebTokenError) {
        if (err instanceof TokenExpiredError || err.message === "jwt must be provided") {
          try {
            // Stores the user ID
            const decodedRefreshToken = await verifyToken(refreshToken, env.RT_SECRET as string) as { id: string, [key: string]: any };
  
            const account = await getUser("id", decodedRefreshToken.id || "");
            if (!account) {
              res({ success: false, response: "Invalid refresh token" });
              return;
            }
  
            const refreshTokenBanned = await refreshTokenIsBanned(refreshToken);
            if (refreshTokenBanned) {
              res({ success: false, response: "Invalid refresh token" });
              return;
            }
  
            await banRefreshToken(refreshToken);
  
            const [newAccessToken, newRefreshToken] = await generateTokens(account);
            res({ success: true, response: { generateNewTokens: true, newAccessToken, newRefreshToken, account } });
          } catch (err: any) {
            if (err instanceof JsonWebTokenError) {
              res({ success: false, response: "Invalid refresh token" });
              return;
            }
          }
        } else {
          res({ success: false, response: err });
          return;
        }
      }
    }
  });
}

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
    console.log(refreshTokenExists, 'refresh token exists');
    console.log("passed rt: ", refreshToken);
    res(refreshTokenExists?.id != null);
  });
}

// Insert a refresh token into the banned refresh token list
export const banRefreshToken = (refreshToken: string) => {
  return new Promise<void>(async (res) => {
    log(LogType.ADDED, `Banishing refresh token: ${refreshToken}`);
    await prisma.bannedRefreshTokens.create({
      data: { refreshToken }
    });

    res();
  });
}