import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

export const userExistsID = (id: string) => {
  return new Promise<boolean>(async (res) => {
    const matching = await prisma.user.findFirst({
      select: { id: true },
      where: { id }
    });

    res(!!matching);
  });
}

export const getUserByID = (id: string) => {
  type UserType = {
    name: string,
    [key: string]: string
  }

  return new Promise<UserType>(async (res, rej) => {
    const user = await prisma.user.findFirst({
      where: { id }
    });

    res((user as any) as UserType);
  });
}