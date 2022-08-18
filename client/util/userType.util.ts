import { FolderType } from "./folderType.util";
import { FollowerType } from "./followerType.util";

export type UserType = {
  id: string,
  name: string,
  email: string,
  password: string,
  details?: string,
  avatar?: string,
  activity?: string,
  likes?: number,
  suggestions?: boolean,
  followers?: Array<FollowerType>,
  interests?: Array<{ id: number, name: string }>,
  verified?: boolean,
  folders?: Array<FolderType>
}