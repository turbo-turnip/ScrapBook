import { PrismaClient } from ".prisma/client";
import { verify } from "argon2";

const prisma = new PrismaClient();

export type UserType = {
  id: string,
  name: string,
  email: string,
  password: string,
  details?: string,
  avatar?: string,
  activity?: string,
  likes?: number,
  suggestions?: boolean,
  verified?: boolean
}

// Check if user exists by a specific property `prop`
// userExists("id", "1234") would check if the user exists by ID
export const userExists = (prop: string, value: any) => {
  return new Promise<boolean>(async (res) => {
    const matching = await prisma.user.findFirst({
      select: { [prop]: true },
      where: { [prop]: value }
    });

    res(!!matching);
  });
}

// Query a user, or optionally query by a specific property `prop` with a `value`
// getUser("name", "Example") would get a user by the name of `Example`
export const getUser = (prop?: string, value?: any) => {
  return new Promise<UserType>(async (res) => {
    let query = {};
    if (prop && value)
      query = { where: { [prop]: value } };

    const user = await prisma.user.findFirst({
      ...query,
      include: {
        interests: true,
        blockedUsers: true,
        communities: true,
        followers: true,
        friends: true,
        messages: true,
        openDMs: true,
        folders: true
      }
    });
    res((user as any) as UserType);
  });
}

// Get a user by their email
// getUserByEmail("example@example.com") returns the user with that email
export const getUserByEmail = (value: string) => {
  return new Promise<UserType>(async (res, rej) => {
    const users = await prisma.user.findMany({ include: { interests: true }});
    for (let i = 0; i < users.length; i++) {
      const emailMatches = await verify(users[i].email, value);
      if (emailMatches) {
        res((users[i] as any) as UserType);
        return;
      }
    }

    rej();
  });
}