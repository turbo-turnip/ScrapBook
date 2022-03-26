import { CommunityMember, CommunityType } from "./communityType.util";
import { UserType } from "./userType.util";

type ImageType = {
  id: string,
  url?: string,
  caption?: string,
  alt?: string,
  postID?: string,
  post: PostType
};

type VideoType = {
  id: string,
  url?: string,
  caption?: string,
  alt?: string,
  postID?: string,
  post: PostType
};

type CommentType = {
  id: string,
  userID?: string,
  content: string,
  postID?: string,
  post: PostType,
  user: UserType
  likes: number;
  memberLikes: Array<CommunityMember>;
};

type DMType = {
  id: string,
  messages: Array<MessageType>,
  users: Array<UserType>
};

type MessageType = {
  id: string,
  userID?: string,
  content: string,
  directMessageID?: string,
  directMessage?: DMType,
  user: UserType
};  

export type PostType = {
  id: string,
  title: string,
  body?: string,
  likes: number,
  userID?: string,
  membersLiked: Array<CommunityMember>,
  communityID?: string,
  community: CommunityType,
  user: UserType,
  comments: Array<CommentType>,
  images: Array<ImageType>,
  videos: Array<VideoType>
};