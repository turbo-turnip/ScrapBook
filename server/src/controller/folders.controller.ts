import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { authenticateUser, getUser } from "../service";
import { communityInclude } from "../util/communityInclude.util";
import { log, LogType } from "../util/log.util";
import { getCommunity } from "./communities.controller";

const prisma = new PrismaClient();

// POST :8080/folders/forUser
// Returns all folders that belong to a user
export const foldersForUser = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const folders = await prisma.folder.findMany({
    where: {
      user: { id: response.account.id }
    }
  });

  res.status(200).json({ success: true, folders, ...response });  
}

// POST :8080/folders
// Create a new user folder
export const createFolder = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const label: string = req.body?.label || "New Folder";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  await prisma.folder.create({
    data: {
      label,
      posts: {
        connect: []
      },
      user: { 
        connect: { id: response.account.id }
      }
    }
  });

  const userFolders = await prisma.folder.findMany({
    where: {
      user: { id: response.account.id }
    }
  });

  res.status(200).json({ success: true, folders: userFolders, ...response });  
}

// POST :8080/folders/removeUser
// Removes a user from a folder
export const removeUserFolder = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const folderID: string = req.body?.folderID || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const folder = await prisma.folder.findUnique({
    where: { id: folderID },
    include: { user: true }
  });
  if (folder?.user?.id !== response.account.id) {
    res.status(403).json({ success: false, error: "You don't have this folder!" });
    return;
  }
  
  await prisma.folder.delete({ where: { id: folderID } });


  const userFolders = await prisma.folder.findMany({
    where: {
      user: { id: response.account.id }
    }
  });

  res.status(200).json({ success: true, folders: userFolders, ...response });  
}

// POST :8080/folders/find
// Returns a specific folder 
export const findFolder = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const folderID: string = req.body?.folderID || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const folder = await prisma.folder.findUnique({
    where: { id: folderID },
    include: {
      posts: {
        include: communityInclude.posts.include
      }
    }
  });

  res.status(200).json({ success: true, folder, ...response });  
}

// POST :8080/folders/addPost
// Adds a post to a specific folder
export const addPostToFolder = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const folderID: string = req.body?.folderID || "";
  const postID: string = req.body?.postID || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const folderExists = await prisma.folder.findUnique({
    where: { id: folderID },
    include: { 
      posts: { include: { community: true } } 
    }
  });

  if (!folderExists?.id) {
    res.status(400).json({ success: false, error: "That folder doesn't exist" });
    return;
  }

  if (folderExists.posts.find(post => post.id === postID)) {
    res.status(400).json({ success: false, error: "That folder already contains this post" });
    return;
  }

  await prisma.folder.update({
    where: { id: folderID },
    data: {
      posts: {
        connect: { id: postID }
      }
    }
  });

  const communityID = folderExists.posts.find(post => post.id === postID)?.community.id || "";
  const updatedCommunity = await prisma.community.findUnique({
    where: { id: communityID },
    include: communityInclude
  });

  res.status(200).json({ success: true, community: updatedCommunity, ...response });  
}

// POST :8080/folders/removePost
// Removes a post from a folder
export const removePostFromFolder = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const folderID: string = req.body?.folderID || "";
  const postID: string = req.body?.postID || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const folderExists = await prisma.folder.findUnique({
    where: { id: folderID },
    include: { 
      posts: { 
        include: { 
          community: true,
          folders: true
        } 
      } 
    }
  });

  if (!folderExists?.id) {
    res.status(400).json({ success: false, error: "That folder doesn't exist" });
    return;
  }
  
  const post = folderExists.posts.find(post => post.id === postID);
  if (!post) {
    res.status(400).json({ success: false, error: "That folder doesn't have this post" });
    return;
  }

  await prisma.folder.update({
    where: { id: folderID },
    data: {
      posts: {
        set: folderExists.posts.filter(post => post.id !== postID).map(post => ({ id: post.id }))
      }
    }
  });

  const updatedFolder = await prisma.folder.findUnique({
    where: { id: folderID },
    include: {
      user: true,
      posts: {
        include: communityInclude.posts.include
      }
    }
  });

  res.status(200).json({ success: true, folder: updatedFolder, ...response });  
}