import { Community, CommunityMember, Image, Post, Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

// Returns a boolean based on if the image is greater than the acceptable size (2mb)
export const acceptableImageSize = (content: string) => {
  return (content.length * 3) / 4 <= 2000000;
}

// Returns array of images from content 
export const getContentImages = (content: string) => {
  const images = (content.match(/<img src="(.)*">/g) || []).map(i => i.replace(/(<img src=")|(">)/g, ''));
  return images;
}

// Returns boolean based on if post exists or not
export const postExists = (prop: string, value: any) => {
  return new Promise<boolean>(async (res) => {
    const matching = await prisma.post.findFirst({
      select: { [prop]: true },
      where: { [prop]: value }
    });

    res(!!matching);
  });
}

// Returns a specific post by specific property
export const getPost = (prop: string, value: any) => {
  return new Promise<(Partial<Post> & { images: Array<Image> } & { user: User } & { membersLiked: Array<CommunityMember> } & { community: Partial<Community> & { membersUser: Array<User> } & { members: Array<CommunityMember> } })|null>(async (res) => {
    const post = await prisma.post.findFirst({
      where: { [prop]: value },
      include: {
        user: true,
        comments: {
          include: {
            user: true
          }
        },
        membersLiked: true,
        images: true,
        community: {
          include: {
            membersUser: true,
            members: true
          }
        }
      }
    });

    res(post);
  });
}

// Returns a specific comment by specific property
export const getComment = (prop: string, value: any) => {
  return new Promise<(Partial<Comment> & { memberLikes: Array<CommunityMember> } & { post: Partial<Post> & { user: User } & { community: Partial<Community> & { membersUser: Array<User> } & { members: Array<CommunityMember> } } })|null>(async (res) => {
    const comment = await prisma.comment.findFirst({
      where: { [prop]: value },
      include: {
        memberLikes: true,
        post: {
          include: {
            user: true,
            community: {
              include: {
                membersUser: true,
                members: true
              }
            }
          }
        }
      }
    });

    res(comment);
  });
}