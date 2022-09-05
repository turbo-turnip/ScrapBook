import { BotType } from "./botType.util";
import { CommunityType } from "./communityType.util";
import { FolderType } from "./folderType.util";
import { FollowerType } from "./followerType.util";
import { PostType } from "./postType.util";

export type UserType = {
  id: string,
  name: string,
  coins: number,
  email: string,
  password: string,
  details?: string,
  avatar?: string,
  activity?: string,
  communities?: Array<CommunityType>,
  posts?: Array<PostType>,
  likes?: number,
  suggestions?: boolean,
  followers?: Array<FollowerType>,
  interests?: Array<{ id: number, name: string }>,
  verified?: boolean,
  bot?: BotType,
  folders?: Array<FolderType>
}