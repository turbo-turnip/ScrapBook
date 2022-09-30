import * as attachments from "./botAttachments.json";
import { BotAttachmentType } from "./botAttachmentType";


// Not very clean, but who cares...
const fallbackAttachment = {
  configID: "Loading...",
  imgPath: "Loading...",
  attachmentRequiredRank: "Loading...",
  attachmentName: "Loading...",
  attachmentCost: "Loading...",
  attachmentPosition: "Loading...",
  attachmentScale: "Loading...",
  attachmentType: "Loading..."
};

export const findAttachment = (configID: string): BotAttachmentType => {
  const attachment = attachments.find(attachment => attachment.configID === configID) || fallbackAttachment;

  return <BotAttachmentType>attachment;
}