import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { UserType } from "../../util/userType.util";
import { Nav, Popup, PopupType, Sidebar, Post, Alert } from "../../components";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";
import styles from '../../styles/account.module.css';
import * as botAttachments from '../../util/botAttachments.json';
import { BotAttachmentType } from "../../util/botAttachmentType";
import { BotType } from "../../util/botType.util";
import { BotAttachmentPreview } from "../../components/BotAttachmentPreview.component";
import { findRankAffordableBotAttachments } from "../../util/findRankAffordableBotAttachments.util";

const PostPage: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [errorPopups, setErrorPopups] = useState<Array<string>>([]);
  const [successPopups, setSuccessPopups] = useState<Array<string>>([]);
  const [alerts, setAlerts] = useState<Array<{ message: string, buttons: Array<{ message: string, onClick?: () => any, color?: string }>, input?: { placeholder?: string } }>>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Array<{ userBot?: BotType, userCoins?: number, attachment: BotAttachmentType }>>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showAttachments, setShowAttachments] = useState(false);
  const router = useRouter();

  const auth = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const res = await fetchAccount(localStorage, accessToken, refreshToken);
    if (res.loggedIn) {
      setLoggedIn(true)
      setAccount(res.account);
      console.log(res.account)
      return;
    } else {
      router.push(res.redirect);
      return;
    }
  }

  const showAttachmentBuyOptions = (attachment: BotAttachmentType) => {
    setAttachmentPreviews(prevState => [
      ...prevState,
      {
        userBot: account?.bot,
        userCoins: account?.coins || 0,
        attachment
      }
    ]);
  }

  useEffect(() => {
    auth();
  }, []);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.onresize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  return (
    <>
      <Head>
        <title>ScrapBook - Account</title>

        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

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

      <Sidebar categories={getSidebarPropsWithOption("Account")} onToggle={(value) => setSidebarCollapsed(value)} />
      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} /> 
      {attachmentPreviews.map((preview, i) =>
        <BotAttachmentPreview userID={account?.id || ""} attachment={preview.attachment} key={i} />)}

      <div className={styles.container} data-collapsed={sidebarCollapsed}>
        <div className={styles.infoTop}>
          <div>{account?.coins || 0} Coins</div>
          <button onClick={() => setShowAttachments(prevState => !prevState)}>{showAttachments ? "View Bot" : "Shop"}</button>
          <div>{account?.bot?.rank || "Silver"} Rank</div>
        </div>
        {(showAttachments) ?
          <div className={styles.attachmentsContainer}>
            {findRankAffordableBotAttachments((account?.bot?.rank || "Silver") as ("Silver"|"Golden"|"Diamond")).map((attachment, i) => 
              <div className={styles.botAttachment} onClick={() => showAttachmentBuyOptions(attachment as BotAttachmentType)} data-name={attachment.attachmentName} key={i} style={{
                opacity: (new Number(attachment.attachmentCost) > (account?.coins || 0)) ? "0.5" : "1",
              }}>
                <img src={`/attachments/${attachment.attachmentRequiredRank}/${attachment.imgPath}`} />
                <h4>{attachment.attachmentCost}</h4>
              </div>)}
          </div> :
          <div className={styles.userContainer}>
            <div className={styles.botContainer} style={{
              width: windowSize.height / 3.75,
              height: windowSize.height / 2.375
            }}>
              {account?.bot ?
                <div className={styles.accountBotAttachments}>
                  {(account.bot.attachments) ?
                  ((account.bot.attachments || []) as Array<{ configID: string }>)
                      .map((att: { configID: string }): BotAttachmentType => botAttachments.filter(a => a.configID === att?.configID)[0] as BotAttachmentType)
                      .map((att: BotAttachmentType, i) => 
                        <div className={styles.attachment} key={i} style={{
                          top: att?.attachmentPosition || "0",
                          transform: `scale(${att?.attachmentScale || "1"}) translateX(${att?.attachmentType === "Feet" ? "0" : att?.attachmentType === "Wrist" ? "380%" : "10px"})`,
                        }}>
                          <img src={`/attachments/${att?.attachmentRequiredRank || "Silver"}/${att?.imgPath || ""}`} />
                        </div>) : <></>}
                </div> : <></>}
            </div>
            <div className={styles.userInfoContainer}>
              <div className={styles.userInfo}>
                {account ? (
                  <>
                    <h1>{account.name}</h1>
                    {account?.details ? <h4>{account.details}</h4> : <></>}
                    <div>
                      <h4>{account?.followers ? account.followers.length : "Loading..."} Follower{(account?.followers?.length || 0) != 1 && "s"} • {account?.communities ? account.communities.length : "Loading..."} Communit{(account?.communities?.length || 0) != 1 ? "ies" : "y"} • {account?.likes != null ? account?.likes : "Loading..."} Like{(account?.likes || 0) != 1 && "s"} • {account?.posts ? account.posts.length : "Loading..."} Post{(account?.posts?.length || 0) != 1 && "s"}</h4>
                      {account?.suggestions ? 
                        (
                          <h4>
                            Interests:&nbsp;
                            {(account?.interests?.length) != 0 ?
                              (account?.interests || []).map((interest, i) => interest.name).slice(0, (account?.interests?.length || 0) - 1).join(", ") + " and " + account?.interests?.[account?.interests?.length - 1].name : "Opt-in to ScrapBook suggestions to add your interests!"}
                          </h4>
                        ) : <></>}
                    </div>
                  </>
                ) : <h1>Loading...</h1>}
              </div>
            </div>
        </div>}
      </div>
    </>
  );
}

export default PostPage;