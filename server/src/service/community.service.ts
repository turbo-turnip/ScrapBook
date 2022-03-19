import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const communityExists = (prop: string, value: any) => {
  return new Promise<boolean>(async (res) => {
    const matching = await prisma.community.findFirst({
      select: { [prop]: true },
      where: { [prop]: value }
    });

    res(!!matching);
  });
}