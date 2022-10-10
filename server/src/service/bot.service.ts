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

export const multipleAttachments = (type: "Head"|"Face"|"Wrist"|"Feet", attachments: Array<BotAttachmentType>) => {
  return new Promise<Array<BotAttachmentType>|false>(async (res) => {
    let foundCount = 0;

    for (let i = 0; i < attachments.length; i++) {
      const attachment = await getBotAttachment(attachments[i].configID);
      if (attachment?.attachmentType === type)
        foundCount++;
    }

    if (foundCount < 2)
      res(false);

    let multipleAttachments: Array<BotAttachmentType> = [];
    for (let i = 0; i < attachments.length; i++) {
      const attachment = await getBotAttachment(attachments[i].configID);

      if (attachment?.attachmentType === type)
        multipleAttachments.push(attachment);
    }

    res(multipleAttachments);
  });
}

export const getAttachmentIDs = (type: "Head"|"Face"|"Wrist"|"Feet") => {
  return new Promise<Array<string>>(async (res) => {
    const attachmentsConfigFile = await readFile(process.cwd() + "/src/config/botAttachments.config.json");
    const botAttachments: Array<BotAttachmentType> = JSON.parse(attachmentsConfigFile.toString());

    const filteredAttachments = botAttachments.filter(attachment => attachment.attachmentType === type);

    res(filteredAttachments.map(attachment => attachment.configID));
  });
}