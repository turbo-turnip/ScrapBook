import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import styles from '../styles/account.module.css';
import { BotAttachmentType } from "../util/botAttachmentType";
import { BotType } from "../util/botType.util";
import * as botAttachments from '../util/botAttachments.json';
import { requiredRankMet } from "../util/requiredRankMet.util";
import { useRef } from "react";
import { Popup, PopupType } from "./";
import { findMultipleBotAttachments } from "../util/findMultipleBotAttachments.util";
import { findAttachment } from "../util/findAttachment.util";

interface BotAttachmentPreviewProps {
  attachment?: BotAttachmentType;
  userID: string;
  setShowAttachments: (value: boolean) => void;
}

export const BotAttachmentPreview: FC<BotAttachmentPreviewProps> = ({ attachment, userID, setShowAttachments }) => {
  const previewRef = useRef<HTMLDivElement|null>(null);
  const [errorPopups, setErrorPopups] = useState<Array<string>>([]);
  const [successPopups, setSuccessPopups] = useState<Array<string>>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [userBot, setUserBot] = useState<BotType|null>(null);
  const [coins, setCoins] = useState(0);
  const [mainFaceAttachment, setMainFaceAttachment] = useState(0); 
  const [mainHeadAttachment, setMainHeadAttachment] = useState(0); 
  const [mainFeetAttachment, setMainFeetAttachment] = useState(0); 
  const [mainWristAttachment, setMainWristAttachment] = useState(0); 

  const fetchBot = async () => {
    const req = await fetch(backendPath + "/bot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID }),
    });

    const res: ServerResponse = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      setUserBot(res?.userBot);
      setCoins(res?.coins || 0);
    } else
      setErrorPopups(prevState => [...prevState, res?.error || "Something went wrong trying to preview your bot... Please refresh the page"]);
  }

  const purchaseAttachment = async () => {
    if (attachment) {
      const accessToken = localStorage.getItem("at") || "";
      const refreshToken = localStorage.getItem("rt") || "";

      const req = await fetch(backendPath + "/bot/purchaseAttachment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken, refreshToken, attachmentID: attachment.configID }),
      });

      const res: ServerResponse = await req.json();
      if (res.success) {
        if (res.generateNewTokens) {
          localStorage.setItem("at", res?.newAccessToken || "");
          localStorage.setItem("rt", res?.newRefreshToken || "");
        }

        if (previewRef?.current)
          previewRef.current.style.display = "none";

        setSuccessPopups(prevState => [...prevState, res?.message || "Successfully purchased attachment!"]);
        setShowAttachments(false);
      } else
        setErrorPopups(prevState => [...prevState, res?.error || "Something went wrong purchasing that attachment... Please try again"]);
    }
  }

  useEffect(() => {
    fetchBot();

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.onresize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  useEffect(() => {
    if (userBot && userBot?.attachments) {
      const currAttachments = userBot.attachments.map((att: any) => ({ main: att.main, ...findAttachment(att.configID) }));
      const multipleFaceAttachments = findMultipleBotAttachments("Face", currAttachments || []) as Array<BotAttachmentType>;
      const multipleHeadAttachments = findMultipleBotAttachments("Head", currAttachments || []) as Array<BotAttachmentType>;
      const multipleWristAttachments = findMultipleBotAttachments("Wrist", currAttachments || []) as Array<BotAttachmentType>;
      const multipleFeetAttachments = findMultipleBotAttachments("Feet", currAttachments || []) as Array<BotAttachmentType>;

      if (multipleFaceAttachments)
        setMainFaceAttachment(multipleFaceAttachments.findIndex(att => att.main) || 0);
      if (multipleHeadAttachments)
        setMainHeadAttachment(multipleHeadAttachments.findIndex(att => att.main) || 0);
      if (multipleWristAttachments)
        setMainWristAttachment(multipleWristAttachments.findIndex(att => att.main) || 0);
      if (multipleFeetAttachments)
        setMainFeetAttachment(multipleFeetAttachments.findIndex(att => att.main) || 0);
    }
  }, [userBot]);

  return (
    <>
      {errorPopups.map((errorPopup, i) =>
          <Popup 
            key={i}
            message={errorPopup || "An error occurred. Please refresh the page"}
            type={PopupType.ERROR}
            />)}
        {successPopups.map((successPopup, i) =>
          <Popup 
            key={i}
            message={successPopup || "An error occurred. Please refresh the page"}
            type={PopupType.SUCCESS}
            />)}
      <div className={styles.attachmentPreview} ref={previewRef}>
        <div className={styles.previewCoins}>{attachment?.attachmentCost || "Loading..."} Coins</div>
        <div className={styles.cancelPreview} onClick={() => {
          if (previewRef?.current) {
            previewRef.current.style.display = "none";
          }
        }}>&times;</div>

        <h1>{attachment?.attachmentName || "Loading..."}</h1>
        <div className={styles.botPreview} style={{
          width: windowSize.height / 3.3,
          height: windowSize.height / 2.1
        }}>
          <div className={styles.botAttachments}>
            {(attachment && userBot?.attachments) ?
              ((userBot.attachments || []) as Array<{ configID: string }>)
                  .map((att: { configID: string }): BotAttachmentType => botAttachments.filter(a => a.configID === att?.configID)[0] as BotAttachmentType)
                  .filter((att: BotAttachmentType) => {
                    const multipleAttachments = findMultipleBotAttachments(att.attachmentType as ("Face"|"Head"|"Wrist"|"Feet"), userBot?.attachments?.map?.((att) => findAttachment(att.configID)) || []);
                    if (!multipleAttachments) return true;
                    
                    switch (att.attachmentType) {
                      case "Face": 
                        return (multipleAttachments[mainFaceAttachment].configID === att.configID);
                      case "Head": 
                        return (multipleAttachments[mainHeadAttachment].configID === att.configID);
                      case "Wrist": 
                        return (multipleAttachments[mainWristAttachment].configID === att.configID);
                      case "Feet": 
                        return (multipleAttachments[mainFeetAttachment].configID === att.configID);
                    }
                  })
                  .filter((att: BotAttachmentType) => att.attachmentType !== attachment.attachmentType)
                  .map((att: BotAttachmentType, i) => 
                    <div className={styles.attachment} key={i} style={{
                      top: att?.attachmentPosition || "0",
                      transform: `scale(${parseFloat(att?.attachmentScale.replace("%", "")) / 100 || "1"}) translateX(${att?.attachmentType === "Feet" ? "0" : att?.attachmentType === "Wrist" ? "380%" : "10px"})`,
                    }}>
                      <img src={`/attachments/${att?.attachmentRequiredRank || "Silver"}/${att?.imgPath || ""}`} />
                    </div>) : <></>}
            <div className={styles.attachment} style={{
              top: attachment?.attachmentPosition,
              transform: `scale(${parseFloat((attachment?.attachmentScale.replace("%", "") as string)) / 100 || "1"}) translateX(${attachment?.attachmentType === "Feet" ? "0" : attachment?.attachmentType === "Wrist" ? "380%" : "10px"})`,
            }}>
              <img src={`/attachments/${attachment?.attachmentRequiredRank}/${attachment?.imgPath}`} />
            </div>
          </div>
        </div>

        {(attachment && userBot) ?
          <button className={styles.purchaseBtn} onClick={() => purchaseAttachment()}>
            {console.log(attachment)}
            {(((new Number(attachment.attachmentCost) || 0) <= (coins || 0)) && requiredRankMet(userBot.rank, attachment.attachmentRequiredRank)) ?
              `Purchase ${attachment.attachmentName} for ${attachment.attachmentCost} coins`
              : `You need ${parseFloat(attachment.attachmentCost) - (coins || 0)} more coins ${!requiredRankMet(userBot.rank, attachment.attachmentRequiredRank) ? `and ${BotAttachmentPreview} Rank ` : ""}to purchase this attachment.`}
          </button> : <h1>Loading...</h1>}
      </div>
    </>
  );
}