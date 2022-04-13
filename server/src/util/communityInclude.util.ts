export const communityInclude = {
  membersUser: true,
  members: true,
  interests: true,
  posts: {
    include: {
      user: true,
      folders: {
        include: {
          posts: true
        }
      },
      comments: {
        include: {
          user: true,
          memberLikes: true,
          replies: {
            include: {
              user: true
            }
          }
        }
      },
      community: true,
      images: true,
      videos: true,
      membersLiked: true
    }
  }  
};