import { PostType } from "./postType.util";
import { UserType } from "./userType.util"

export type CommunityMember = {
  id: string,
  nickname?: string,
  communityID?: string,
  userID?: string,
  user: UserType,
  community: CommunityType,
  owner?: boolean
}

export type CommunityType = {
  id: string,
  title: string,
  details: string,
  memberID?: any,
  membersUser?: Array<UserType>
  members: Array<CommunityMember>
  interests: Array<{ id: string, name: string }>,
  posts: Array<PostType>
};