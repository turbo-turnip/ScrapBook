import { UserType } from "./userType.util";

export type BotType = {
  id: string;
  rank: string;
  attachments: Array<{ configID: string, main?: boolean }>;
  userID?: string;
  user: UserType;
};