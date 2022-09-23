import * as attachments from "./botAttachments.json";
import { requiredRankMet } from "./requiredRankMet.util"

export const findRankAffordableBotAttachments = (rank: "Silver"|"Golden"|"Diamond") => {
  const silverRank = requiredRankMet(rank, "Silver");
  const goldRank = requiredRankMet(rank, "Golden");
  const diamondRank = requiredRankMet(rank, "Diamond");
  const affordableRanks = [silverRank && "Silver", goldRank && "Golden", diamondRank && "Diamond"].filter(r => r);

  return attachments.filter(attachment => affordableRanks.includes(attachment.attachmentRequiredRank));
}