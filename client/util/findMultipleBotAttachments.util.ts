import { BotAttachmentType } from "./botAttachmentType";

export const findMultipleBotAttachments = (type: "Face"|"Head"|"Wrist"|"Feet", attachments: Array<BotAttachmentType>) => {
  let foundCount = 0;

  attachments.forEach(attachment => {
    if (attachment.attachmentType === type) 
      foundCount++;
  });

  if (foundCount < 2)
    return false;

  return attachments.filter(attachment => attachment.attachmentType === type);
}