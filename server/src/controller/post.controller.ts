import { Request, Response } from "express";
import { authenticateUser, communityExists } from "../service";
import { LogType, log } from "../util/log.util";
import { v2 as cloudinary } from "cloudinary";
import env from "../config/env.config";
import { acceptableImageSize, getContentImages } from "../service/post.service";
import { PrismaClient } from "@prisma/client";

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

  res.status(200).json({ success: true, post: newPost, ...response });
}