import { UserType } from "./userType.util";

export type FollowerType = {
  id: string,
  followingUserID: string,
  followerUserID: string,
  followerUser: UserType
};