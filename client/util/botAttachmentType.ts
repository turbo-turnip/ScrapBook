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