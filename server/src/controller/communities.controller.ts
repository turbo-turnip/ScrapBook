import { PrismaClient } from '.prisma/client';
import { log } from 'console';
import { Request, Response } from 'express';
import { authenticateUser, communityExists } from '../service';
import { LogType } from '../util/log.util';

const prisma = new PrismaClient();

// POST :8080/communities/create
// Create a community and insert it into the database
export const createCommunity = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const title: string = req.body?.title;
  const details: string = req.body?.details || "";
  const interests: Array<string> = req.body?.interests || [];

  const communityAlreadyExists = await communityExists("title", title);
  if (communityAlreadyExists) {
    res.status(400).json({ success: false, error: "That community already exists. Try a different name" });
    return;
  }

  try {
    const newCommunity = await prisma.community.create({
      data: {
        title,
        details,
        interests: {
          connectOrCreate: interests.map(interest => ({ create: { name: interest }, where: { name: interest } }))
        },
        members: {
          create: [{
            nickname: response.account.name,
            owner: true,
            user: {
              connect: { id: response.account.id }
            }
          }]
        },
        membersUser: {
          connect: { id: response.account.id }
        }
      },
      include: {
        interests: true,
        members: true,
        membersUser: true
      }
    });

    res.status(200).json({ success: true, community: newCommunity, ...response });
    return;
  } catch (err: any) {
    if ((err?.code || "") === "P2002") {
      res.status(400).json({ success: false, error: "That community already exists. Please choose a different name" });
      return;
    } 

    log(LogType.ERROR, err);
    res.status(500).json({ success: false, error: "An error occurred. Please refresh the page and try again" });
    return;
  }
}

// POST :8080/communities/forUser
// Fetch all communities that a user has joined
export const communitiesForUser = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  try {
    const userCommunities = await prisma.community.findMany({
      where: {
        members: {
          every: {
            userID: response?.account?.id || ""
          },
        }
      },
      include: {
        members: true,
        posts: true,
        interests: true
      }
    });

    res.status(200).json({ success: true, communities: userCommunities, ...response });
    return;
  } catch (err: any) {
    log(LogType.ERROR, err);
    res.status(500).json({ success: false, error: "An error occurred. Please refresh the page and try again" });
    return;
  }
}

// POST :8080/communities/community
// Fetch a community from the database
export const getCommunity = async (req: Request, res: Response) => {
  const title: string = req.body?.title || "";

  try {
    const community = await prisma.community.findUnique({
      where: { title },
      include: {
        membersUser: true,
        members: true,
        interests: true,
        posts: true
      }
    });

    if (community) {
      res.status(200).json({ success: true, community });
      return;
    } else {
      res.status(400).json({ success: false, error: "Invalid community" });
      return;
    }
  } catch (err: any) {
    console.log(err?.code || "", err?.message || "");
    res.status(500).json({ success: false, error: err });
  }
}

// POST :8080/communities/search
// Returns a list of communities similar to a query
export const searchCommunities = async (req: Request, res: Response) => {
  const query: string = req.body?.query || "";
  // Break the search query into it's consonants
  const queryConsonants = Array.from(query).filter(w => !["a", "e", "i", "o", "u"].includes(w) && w != " ");
  
  try {
    const allCommunities = await prisma.community.findMany({
      include: {
        members: true,
        interests: true,
        posts: true,
        membersUser: true
      }
    });

    const relevantCommunities = allCommunities.filter(community => {
      const matchingInterests = community.interests.filter(interest => {
        const lowerCaseInterest = interest.name.toLowerCase();
        const lowerCaseQuery = query.toLowerCase();

        return lowerCaseInterest.includes(lowerCaseQuery) || lowerCaseQuery.includes(lowerCaseInterest);
      });

      const communityTitle = community.title;
      // Break iterated community's title into it's consonants
      const communityTitleConsonants = Array.from(communityTitle).filter(w => !["a", "e", "i", "o", "u"].includes(w) && w != " ");
      let matchingCount = 0;
      // Add credit the more matching consonants query has to the community title
      queryConsonants.forEach(c => {
        matchingCount += communityTitleConsonants.includes(c) ? 1 : 0;
      });
      // Search accuracy is set as 80% of the matching consonants
      // If query shares at least 1 interest with community, it is taken as relevant
      return (matchingCount >= queryConsonants.length * 0.8 || matchingInterests.length >= 1);
    });
    
    res.status(200).json({ success: true, communities: relevantCommunities.slice(0, 50) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "An error occurred. Please refresh the page" });
  }
}

// POST :8080/communities/join
// Add a user to a the members list
export const joinCommunity = async (req: Request, res: Response) => {
  const communityID: string = req.body?.communityID;
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const doesCommunityExist = await communityExists("id", communityID);
  if (!doesCommunityExist) {
    res.status(400).json({ success: false, error: "That community doesn't exist" });
    return;
  }

  try {
    await prisma.communityMember.upsert({
      where: {
        userID: response.account.id
      },
      update: {},
      create: {
        nickname: response.account.name,
        user: {
          connect: { id: response.id }
        },
        community: {
          connect: { id: communityID }
        },
        owner: false
      }
    });

    const updatedCommunity = await prisma.community.findUnique({
      where: { id: communityID },
      include: {
        membersUser: true,
        members: true,
        interests: true,
        posts: true
      }
    });

    res.status(200).json({ success: true, community: updatedCommunity, ...response });
    return;
  } catch (err: any) {
    log(LogType.ERROR, err);
    res.status(500).json({ success: false, error: "An error occurred. Please refresh the page and try again" });
    return;
  }
}