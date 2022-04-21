import { Community, CommunityInterest, CommunityMember, PrismaClient } from "@prisma/client";

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

export const getCommunity = (prop: string, value: any) => {
  return new Promise<Partial<Community> & { members: Array<CommunityMember> } & { interests: Array<CommunityInterest> }>(async (res) => {
    const result = await prisma.community.findFirst({
      where: {
        [prop]: value
      },
      include: {
        members: true,
        interests: true
      }
    });

    res((result as any) as Partial<Community> & { members: Array<CommunityMember> } & { interests: Array<CommunityInterest> });
  });
}