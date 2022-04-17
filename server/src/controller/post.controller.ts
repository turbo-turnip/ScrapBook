import { Request, Response } from "express";
import { authenticateUser, communityExists } from "../service";
import { LogType, log } from "../util/log.util";
import { v2 as cloudinary } from "cloudinary";
import env from "../config/env.config";
import { acceptableImageSize, getComment, getContentImages, getPost, postExists, userInCommunity } from "../service/post.service";
import { PrismaClient } from "@prisma/client";
import { communityInclude } from "../util/communityInclude.util";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});

// POST :8080/posts/
// Create a post for a certain community
export const createPost = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const communityID: string = req.body?.communityID || "";
  const content: string = req.body?.content || "";
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

  const userExistsInCommunity = await userInCommunity(response.account.id, communityID);
  if (!userExistsInCommunity) {
    res.status(403).json({ success: false, error: "You need to join this community before you can post!" });
    return;
  }

  const images = getContentImages(content);
  for (let i = 0; i < images.length; i++) {
    if (!acceptableImageSize(images[i])) {
      res.status(400).json({ success: false, error: "Please keep image files under 2 megabytes!" });
      return;
    }
  }

  const uploadedImages = [];

  for (let i = 0; i < images.length; i++) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(images[i], {});
      const secureImageURL = uploadResponse.secure_url;
      uploadedImages.push(secureImageURL);

      log(LogType.ADDED, "Successfully uploaded image");
    } catch (err: any) {
      log(LogType.ERROR, "Error uploading image: " + err?.message || err);
      res.status(500).json({ success: false, message: "We couldn't upload an image. Please refresh the page and try again" });
    }
    try {
      const uploadResponse = await cloudinary.uploader.upload(images[i], {});
      console.log(uploadResponse);
    } catch (err: any) {
      console.log(err);
    }
  }

  const newPost = await prisma.post.create({
    data: {
      body: content.replace(/<img src="(.)*">/g, ''),
      likes: 0,
      membersLiked: {
        create: []
      },
      user: {
        connect: { id: response.account.id }
      },
      community: {
        connect: { id: communityID }
      },
      comments: {
        create: []
      },
      images: {
        createMany: {
          data: uploadedImages.map(image => ({
            url: image
          }))
        }
      }
    }
  });

  const updatedCommunity = await prisma.community.findUnique({
    where: { id: communityID },
    include: communityInclude
  });

  res.status(200).json({ success: true, post: newPost, community: updatedCommunity, ...response });
}

// POST :8080/posts/like
// Like a user's post
export const likePost = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const postID: string = req.body?.postID || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const post = await getPost("id", postID);
  if (!post) {
    res.status(400).json({ success: false, error: "That post doesn't exist" });
    return;
  }

  const userInPostCommunity = await userInCommunity(response.account.id, post?.community?.id || "");
  if (!userInPostCommunity) {
    res.status(403).json({ success: false, error: "You need to join this community before you can like it's posts" });
    return;
  }

  const userAlreadyLiked = !!(post.membersLiked.find(member => member.userID === response.account.id));
  const communityMember = post.community.members.find(member => member.userID === response.account.id);
  const membersLikedPost = post.membersLiked;

  await prisma.post.update({
    where: { id: postID },
    data: {
      likes: { increment: userAlreadyLiked ? -1 : 1 },
      membersLiked: {
        [userAlreadyLiked ? "set" : "connect"]: userAlreadyLiked ? membersLikedPost.filter(member => member.userID != response.account.id) : { id: communityMember?.id || "" }
      }
    }
  });

  const updatedCommunity = await prisma.community.findUnique({
    where: { id: post.community.id },
    include: communityInclude
  });

  res.status(200).json({ success: true, community: updatedCommunity, option: userAlreadyLiked ? "dislike" : "like", ...response });
}

// POST :8080/post/comment
// Add a comment to a specific post
export const commentOnPost = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const postID: string = req.body?.postID || "";
  const comment: string = req.body?.comment || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const post = await getPost("id", postID);
  if (!post) {
    res.status(400).json({ success: false, error: "That post doesn't exist" });
    return;
  }

  const userInPostCommunity = await userInCommunity(response.account.id, post?.community?.id || "");
  if (!userInPostCommunity) {
    res.status(403).json({ success: false, error: "You need to join this community before you can like it's posts" });
    return;
  }

  await prisma.post.update({
    where: { id: postID },
    data: {
      comments: {
        create: {
          user: { connect: { id: response.account.id } },
          content: comment,
          likes: 0,
          memberLikes: { connect: [] }
        }
      }
    }
  });

  const updatedCommunity = await prisma.community.findUnique({
    where: { id: post.community.id },
    include: communityInclude
  });

  res.status(200).json({ success: true, community: updatedCommunity, ...response });
}

// POST :8080/posts/likeComment
// Like a user's comment on a post
export const likeComment = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const commentID: string = req.body?.commentID || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const comment = await getComment("id", commentID);
  if (!comment) {
    res.status(400).json({ success: false, error: "That comment doesn't exist" });
    return;
  }

  const userInPostCommunity = await userInCommunity(response.account.id, comment?.post?.community?.id || "");
  if (!userInPostCommunity) {
    res.status(403).json({ success: false, error: "You need to join this community before you can like it's comments" });
    return;
  }

  const userAlreadyLiked = !!(comment.memberLikes.find(member => member.userID === response.account.id));
  const communityMember = comment.post.community.members.find(member => member.userID === response.account.id);
  const membersLikedComment = comment.memberLikes;

  await prisma.comment.update({
    where: { id: commentID },
    data: {
      likes: { increment: userAlreadyLiked ? -1 : 1 },
      memberLikes: {
        [userAlreadyLiked ? "set" : "connect"]: userAlreadyLiked ? membersLikedComment.filter(member => member.userID != response.account.id) : { id: communityMember?.id || "" }
      }
    }
  });

  const updatedCommunity = await prisma.community.findUnique({
    where: { id: comment.post.community.id },
    include: communityInclude
  });

  res.status(200).json({ success: true, community: updatedCommunity, option: userAlreadyLiked ? "dislike" : "like", ...response });
}

// POST :8080/posts/replyComment
// Like a user's comment on a post
export const replyToComment = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const commentID: string = req.body?.commentID || "";
  const reply: string = req.body?.reply || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const comment = await getComment("id", commentID);
  if (!comment) {
    res.status(400).json({ success: false, error: "That comment doesn't exist" });
    return;
  }

  const userInPostCommunity = await userInCommunity(response.account.id, comment?.post?.community?.id || "");
  if (!userInPostCommunity) {
    res.status(403).json({ success: false, error: "You need to join this community before you can reply to comments" });
    return;
  }

  await prisma.commentReply.create({
    data: {
      content: reply,
      user: { 
        connect: { id: response.account.id }
      },
      comment: {
        connect: { id: commentID }
      }
    }
  });

  const updatedCommunity = await prisma.community.findUnique({
    where: { id: comment.post.community.id },
    include: communityInclude
  });

  res.status(200).json({ success: true, community: updatedCommunity, ...response });
}

// POST :8080/posts/delete
// Deletes a post from the database
export const deletePost = async (req: Request, res: Response) =>{
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const postID: string = req.body?.postID || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const post = await getPost("id", postID);
  if (!post) {
    res.status(400).json({ success: false, error: "That post doesn't exist" });
    return;
  }

  const userInPostCommunity = await userInCommunity(response.account.id, post?.community?.id || "");
  if (!userInPostCommunity) {
    res.status(403).json({ success: false, error: "You need to join this community before you can delete a post" });
    return;
  }

  if (post.user.id !== response.account.id) {
    res.status(403).json({ success: false, error: "You can't delete a post you don't own" });
    return;
  }

  await prisma.post.delete({ 
    where: { id: postID }
  });

  for (let i = 0; i < post?.images?.length; i++) {
    const imagePublicID: string = (post?.images?.[i]?.url || "").replace(/(https\:\/\/res\.cloudinary\.com\/scrapbooksite\/image\/upload\/v([0-9]*)\/)|\.png/g, '');
    await cloudinary.uploader.destroy(imagePublicID, {});
  }

  const updatedCommunity = await prisma.community.findUnique({
    where: { id: post.community.id },
    include: communityInclude
  });

  res.status(200).json({ success: true, community: updatedCommunity, ...response });
}

// POST :8080/posts/find 
// Finds a specific post
export const findPost = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const postID: string = req.body?.postID || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const post = await getPost("id", postID);

  res.status(200).json({ success: true, post, ...response });  
}

// POST :8080/posts/edit
// Edits a specific post's content
export const editPost = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const postID: string = req.body?.postID || "";
  const content: string = req.body?.content || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const post = await getPost("id", postID);
  if (!post) {
    res.status(400).json({ success: false, error: "That post doesn't exist" });
    return;
  }

  const userInPostCommunity = await userInCommunity(response.account.id, post?.community?.id || "");
  if (!userInPostCommunity) {
    res.status(403).json({ success: false, error: "You need to join this community before you can edit it's posts" });
    return;
  }

  if (post.user.id !== response.account.id) {
    res.status(403).json({ success: false, error: "You can't edit a post you don't own" });
    return;
  }

  const images = getContentImages(content);
  for (let i = 0; i < images.length; i++) {
    if (!acceptableImageSize(images[i])) {
      res.status(400).json({ success: false, error: "Please keep image files under 2 megabytes!" });
      return;
    }
  }

  const uploadedImages = [];

  for (let i = 0; i < images.length; i++) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(images[i], {});
      const secureImageURL = uploadResponse.secure_url;
      uploadedImages.push(secureImageURL);

      log(LogType.ADDED, "Successfully uploaded image");
    } catch (err: any) {
      log(LogType.ERROR, "Error uploading image: " + err?.message || err);
      res.status(500).json({ success: false, message: "We couldn't upload an image. Please refresh the page and try again" });
    }
    try {
      const uploadResponse = await cloudinary.uploader.upload(images[i], {});
      console.log(uploadResponse);
    } catch (err: any) {
      console.log(err);
    }
  }

  await prisma.post.update({
    where: { id: postID },
    data: {
      images: {
        set: []
      },
      body: content.replace(/<img src="(.)*">/g, '')
    }
  });

  await prisma.post.update({
    where: { id: postID },
    data: {
      images: {
        createMany: {
          data: uploadedImages.map(image => ({
            url: image
          }))
        }
      }
    }
  });

  res.status(200).json({ success: true, ...response });  
}