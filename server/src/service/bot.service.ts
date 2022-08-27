import { readFile } from "fs/promises";

export type BotAttachmentType = {
  configID: string;
  imgPath: string;
  attachmentName: string;
  attachmentRequiredRank: string;
  attachmentCost: string;
  attachmentPosition: string;
  attachmentScale: string;
  attachmentType: "Face"|"Head"|"Wrist"|"Feet";
};

export const getBotAttachment = (configID: string) => {
  return new Promise<BotAttachmentType|null>(async (res) => {
    const attachmentsConfigFile = await readFile(process.cwd() + "/src/config/botAttachments.config.json");
    const botAttachments: Array<BotAttachmentType> = JSON.parse(attachmentsConfigFile.toString());

    const attachment = botAttachments.find((att) => {
      return att.configID === configID;
    });

    res(attachment || null);
  });
}

export const canAffordAttachment = (attachment: BotAttachmentType, user: any) => {
  return new Promise<boolean>(async (res) => {
    if (user?.bot && attachment) {
      const userCoins = user?.coins || 0;
      const userRank = user.bot.rank;
      const rankHierarchy = ["Silver", "Golden", "Diamond"];

      const rankMet = rankHierarchy.indexOf(userRank) >= rankHierarchy.indexOf(attachment.attachmentRequiredRank);
      const canAfford = userCoins >= attachment.attachmentCost;
      
      res(rankMet && canAfford);
    } else res(false);
  });
}