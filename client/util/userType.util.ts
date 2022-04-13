import { FolderType } from "./folderType.util";

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
  verified?: boolean,
  folders?: Array<FolderType>
}