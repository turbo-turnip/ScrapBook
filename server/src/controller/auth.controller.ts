import { Request, Response } from 'express';
import { generateTokens, getUser, getUserByEmail, userExists, UserType, refreshTokenIsBanned, banRefreshToken } from '../service';
import { PrismaClient } from '@prisma/client';
import { verify as verifyHash } from 'argon2';
import { decode, JsonWebTokenError, JwtPayload, sign, TokenExpiredError, verify as verifyToken } from 'jsonwebtoken';

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

  try {
    // Stores the whole account; see UserType
    const decodedAccessToken = await verifyToken(accessToken, process.env.AT_SECRET as string) as JwtPayload;
    const accountExists = await userExists("id", decodedAccessToken?.id || "");
    if (!accountExists) {
      res.status(400).json({ success: false, message: "Invalid access token" });
      return;
    }

    res.status(200).json({ success: true, generateNewTokens: false, account: decodedAccessToken });
  } catch (err: any) {
    if (err instanceof JsonWebTokenError) {
      if (err instanceof TokenExpiredError) {
        try {
          // Stores the user ID
          const decodedRefreshToken = await verifyToken(refreshToken, process.env.RT_SECRET as string) as { id: string, [key: string]: any };

          const account = await getUser("id", decodedRefreshToken.id || "");
          if (!account) {
            res.status(400).json({ success: false, error: "Invalid refresh token" });
            return;
          }

          const refreshTokenBanned = await refreshTokenIsBanned(refreshToken);
          if (refreshTokenBanned) {
            res.status(400).json({ success: false, error: "Invalid refresh token" });
            return;
          }

          await banRefreshToken(refreshToken);

          const [newAccessToken, newRefreshToken] = await generateTokens(account);
          res.status(200).json({ success: true, generateNewTokens: true, newAccessToken, newRefreshToken, account });
        } catch (err: any) {
          if (err instanceof JsonWebTokenError) {
            res.status(400).json({ success: false, error: "Invalid refresh token" });
            return;
          }
        }
      } else {
        res.status(500).json({ success: false, error: `An error occurred. Please refresh the page. (${err.message})` });
        return;
      }
    }
  }
}