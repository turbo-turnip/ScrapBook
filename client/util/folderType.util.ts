import { PostType } from "./postType.util";
import { UserType } from "./userType.util";

export type FolderType = {
  id: string;
  label: string;
  color?: string;
  posts: Array<PostType>;
  users: Array<UserType>;
};