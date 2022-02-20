import { sign } from 'jsonwebtoken';
import env from '../config/env.config';

type UserType = {
  id: string,
  name: string,
  email: string,
  [key: string]: string
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