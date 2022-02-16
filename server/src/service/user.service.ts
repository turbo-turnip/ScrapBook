import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

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
  type UserType = {
    name: string,
    email: string,
    [key: string]: string
  }

  return new Promise<UserType>(async (res) => {
    let query = {};
    if (prop && value)
      query = { where: { [prop]: value } };

    const user = await prisma.user.findFirst(query);
    res((user as any) as UserType);
  });
}