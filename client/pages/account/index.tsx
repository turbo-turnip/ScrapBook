import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { UserType } from "../../util/userType.util";
import { Nav, Popup, PopupType, Sidebar, InterestsPopup,  Alert } from "../../components";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";
import styles from '../../styles/account.module.css';
import * as botAttachments from '../../util/botAttachments.json';
import { BotAttachmentType } from "../../util/botAttachmentType";
import { BotType } from "../../util/botType.util";
import { BotAttachmentPreview } from "../../components";
import { findRankAffordableBotAttachments } from "../../util/findRankAffordableBotAttachments.util";
import { findMultipleBotAttachments } from "../../util/findMultipleBotAttachments.util";
import { findAttachment } from "../../util/findAttachment.util";

const AccountPage: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [errorPopups, setErrorPopups] = useState<Array<string>>([]);
  const [successPopups, setSuccessPopups] = useState<Array<string>>([]);
  const [alerts, setAlerts] = useState<Array<{ message: string, subheading?: string, buttons: Array<{ message: string, onClick?: () => any, color?: string }>, textArea?: { placeholder?: string}, input?: { placeholder?: string } }>>([]);
  const [interestsPopups, setInterestsPopups] = useState<Array<Array<string>>>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Array<{ userBot?: BotType, userCoins?: number, attachment: BotAttachmentType }>>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachmentFaceSliderPos, setAttachmentFaceSliderPos] = useState(0);
  const [attachmentHeadSliderPos, setAttachmentHeadSliderPos] = useState(0);
  const [attachmentWristSliderPos, setAttachmentWristSliderPos] = useState(0);
  const [attachmentFeetSliderPos, setAttachmentFeetSliderPos] = useState(0);
  const [attachmentsChanged, setAttachmentsChanged] = useState(false);
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

  const updateName = async (name: string, password: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/users/rename", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        name, password
      })
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      setSuccessPopups(prevState => [...prevState, "Successfully updated name"]);
      setAccount(res.updatedUser);

      return;
    } else {
      setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
      return;
    }
  }

  const updateInterests = async (interests: Array<string>) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/users/updateInterests", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        interests
      })
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      setSuccessPopups(prevState => [...prevState, "Successfully updated interests"]);
      setAccount(res.updatedUser);

      return;
    } else {
      setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
      return;
    }
  }

  const updateDetails = async (details: string, password: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/users/updateDetails", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        details, password
      })
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      setSuccessPopups(prevState => [...prevState, "Successfully updated details"]);
      setAccount(res.updatedUser);

      return;
    } else {
      setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
      return;
    }
  }

  useEffect(() => {
    auth();
  }, [showAttachments]);

  useEffect(() => {
    if (account && account?.bot?.attachments) {
      const currAttachments = account?.bot?.attachments?.map?.((att: any) => ({ main: att.main, ...findAttachment(att.configID) }));
      const multipleFaceAttachments = findMultipleBotAttachments("Face", currAttachments || []) as Array<BotAttachmentType>;
      const multipleHeadAttachments = findMultipleBotAttachments("Head", currAttachments || []) as Array<BotAttachmentType>;
      const multipleWristAttachments = findMultipleBotAttachments("Wrist", currAttachments || []) as Array<BotAttachmentType>;
      const multipleFeetAttachments = findMultipleBotAttachments("Feet", currAttachments || []) as Array<BotAttachmentType>;

      if (multipleFaceAttachments)
        setAttachmentFaceSliderPos(multipleFaceAttachments.findIndex(att => att.main) || 0);
      if (multipleHeadAttachments)
        setAttachmentHeadSliderPos(multipleHeadAttachments.findIndex(att => att.main) || 0);
      if (multipleWristAttachments)
        setAttachmentWristSliderPos(multipleWristAttachments.findIndex(att => att.main) || 0);
      if (multipleFeetAttachments)
        setAttachmentFeetSliderPos(multipleFeetAttachments.findIndex(att => att.main) || 0);
    }
  }, [account]);

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

      {interestsPopups.map((popups, i) => 
        <InterestsPopup
          currInterests={popups}
          suggestions={account?.suggestions || false}
          updateInterests={updateInterests}
          setAlerts={setAlerts}
          setSuccessPopups={setSuccessPopups}
          setErrorPopups={setErrorPopups}
          setAccount={setAccount}
          key={i} />)}
      {alerts.map((a, i) => 
        <Alert 
          message={a.message}
          buttons={a.buttons}
          input={a?.input}
          textArea={a?.textArea}
          subheading={a?.subheading}
          key={i} />)}
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
        <BotAttachmentPreview 
          userID={account?.id || ""} 
          attachment={preview.attachment} 
          setShowAttachments={setShowAttachments} 
          key={i} />)}

      <div className={styles.container} data-collapsed={sidebarCollapsed}>
        <div className={styles.infoTop}>
          <div>{account?.coins || 0} Coins</div>
          <button onClick={() => setShowAttachments(prevState => !prevState)}>{showAttachments ? "View Bot" : "Shop"}</button>
          {(attachmentsChanged && !showAttachments) && <button style={{ fontSize: "1rem" }} onClick={async () => {
            const multipleHeadAttachments = (findMultipleBotAttachments("Head", account?.bot?.attachments?.map?.((att) => ({ ...findAttachment(att.configID), main: att?.main || false })) || []) as Array<BotAttachmentType>);
            const multipleFaceAttachments = (findMultipleBotAttachments("Face", account?.bot?.attachments?.map?.((att) => ({ ...findAttachment(att.configID), main: att?.main || false })) || []) as Array<BotAttachmentType>);
            const multipleWristAttachments = (findMultipleBotAttachments("Wrist", account?.bot?.attachments?.map?.((att) => ({ ...findAttachment(att.configID), main: att?.main || false })) || []) as Array<BotAttachmentType>);
            const multipleFeetAttachments = (findMultipleBotAttachments("Feet", account?.bot?.attachments?.map?.((att) => ({ ...findAttachment(att.configID), main: att?.main || false })) || []) as Array<BotAttachmentType>);

            const newAttachments: { [key: string]: BotAttachmentType|null } = {
              newHeadAttachment: null,
              newFaceAttachment: null,
              newWristAttachment: null,
              newFeetAttachment: null
            };

            if (multipleHeadAttachments) {
              newAttachments.newHeadAttachment = multipleHeadAttachments[attachmentHeadSliderPos];
              const mainHeadAttachment = multipleHeadAttachments.find(att => att.main) || { configID: "" };

              if (mainHeadAttachment.configID === newAttachments.newHeadAttachment.configID)
                newAttachments.newHeadAttachment = null;
            }

            if (multipleFaceAttachments) {
              newAttachments.newFaceAttachment = multipleFaceAttachments[attachmentFaceSliderPos];

              const mainFaceAttachment = multipleFaceAttachments.find(att => att.main) || { configID: "" };

              if (mainFaceAttachment.configID === newAttachments.newFaceAttachment.configID)
                newAttachments.newFaceAttachment = null;
            }

            if (multipleWristAttachments) {
              newAttachments.newWristAttachment = multipleWristAttachments[attachmentWristSliderPos];

              const mainWristAttachment = multipleWristAttachments.find(att => att.main) || { configID: "" };

              if (mainWristAttachment.configID === newAttachments.newWristAttachment.configID)
                newAttachments.newWristAttachment = null;
            }

            if (multipleFeetAttachments) {
              newAttachments.newFeetAttachment = multipleFeetAttachments[attachmentFeetSliderPos];

              const mainFeetAttachment = multipleFeetAttachments.find(att => att.main) || { configID: "" };

              if (mainFeetAttachment.configID === newAttachments.newFeetAttachment.configID)
                newAttachments.newFeetAttachment = null;
            }

            if (!newAttachments.newHeadAttachment && !newAttachments.newFaceAttachment && !newAttachments.newWristAttachment && !newAttachments.newFeetAttachment) return;

            const accessToken = localStorage.getItem("at") || "";
            const refreshToken = localStorage.getItem("rt") || "";
            
            const req = await fetch(backendPath + "/bot/saveAttachments", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                accessToken, refreshToken,
                newAttachments
              })
            });
            const res: ServerResponse = await req.json();
            if (res.success) {
              if (res.generateTokens) {
                localStorage.setItem("at", res?.accessToken || "");
                localStorage.setItem("rt", res?.refreshToken || "");
              }
        
              setAttachmentsChanged(false);
              setSuccessPopups(prevState => [...prevState, "Successfully saved attachments"]);
            } else {
              setErrorPopups(prevState => [...prevState, res?.message || "An error occurred. Please refresh the page and try again"]);
            }
          }}>Save Attachments</button>}
          <div>{account?.bot?.rank || "Silver"} Rank</div>
        </div>
        {(!showAttachments && findMultipleBotAttachments("Face", account?.bot?.attachments?.map?.((att) => findAttachment(att.configID)) || [])) &&
          <div className={styles.slider} style={{
            top: "27%"
          }} onClick={() => {
            const attachmentLength = (findMultipleBotAttachments("Face", account?.bot?.attachments?.map?.((att) => findAttachment(att.configID)) || []) as Array<BotAttachmentType>).length;

            if (attachmentFaceSliderPos === attachmentLength - 1)
              setAttachmentFaceSliderPos(0);
            else
              setAttachmentFaceSliderPos(prev => ++prev);

            if (!attachmentsChanged)
              setAttachmentsChanged(true);
          }}>
            <div className={styles.sliderBtn} data-tooltip={`Switch face attachment`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path stroke="#FF8A65" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"></path></svg>
            </div>
          </div>}
          {(!showAttachments && findMultipleBotAttachments("Head", account?.bot?.attachments?.map?.((att) => findAttachment(att.configID)) || [])) &&
            <div className={styles.slider} style={{
              top: "15%"
            }} onClick={() => {
              const attachmentLength = (findMultipleBotAttachments("Head", account?.bot?.attachments?.map?.((att) => findAttachment(att.configID)) || []) as Array<BotAttachmentType>).length;

              if (attachmentHeadSliderPos === attachmentLength - 1)
                setAttachmentHeadSliderPos(0);
              else
                setAttachmentHeadSliderPos(prev => ++prev);
              
              if (!attachmentsChanged)
                setAttachmentsChanged(true);
            }}>
              <div className={styles.sliderBtn} data-tooltip={`Switch head attachment`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path stroke="#FF8A65" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"></path></svg>
              </div>
            </div>}
            {(!showAttachments && findMultipleBotAttachments("Wrist", account?.bot?.attachments?.map?.((att) => findAttachment(att.configID)) || [])) &&
              <div className={styles.slider} style={{
                top: "53%"
              }} onClick={() => {
                const attachmentLength = (findMultipleBotAttachments("Wrist", account?.bot?.attachments?.map?.((att) => findAttachment(att.configID)) || []) as Array<BotAttachmentType>).length;

                if (attachmentWristSliderPos === attachmentLength - 1)
                  setAttachmentWristSliderPos(0);
                else
                  setAttachmentWristSliderPos(prev => ++prev);

                if (!attachmentsChanged)
                  setAttachmentsChanged(true);
              }}>
                <div className={styles.sliderBtn} data-tooltip={`Switch wrist attachment`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path stroke="#FF8A65" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"></path></svg>
                </div>
              </div>}
              {(!showAttachments && findMultipleBotAttachments("Feet", account?.bot?.attachments?.map?.((att) => findAttachment(att.configID)) || [])) &&
                <div className={styles.slider} style={{
                  top: "80%"
                }} onClick={() => {
                  const attachmentLength = (findMultipleBotAttachments("Feet", account?.bot?.attachments?.map?.((att) => findAttachment(att.configID)) || []) as Array<BotAttachmentType>).length;

                  if (attachmentFeetSliderPos === attachmentLength - 1)
                    setAttachmentFeetSliderPos(0);
                  else
                    setAttachmentFeetSliderPos(prev => ++prev);

                  if (!attachmentsChanged)
                    setAttachmentsChanged(true);
                }}>
                  <div className={styles.sliderBtn} data-tooltip={`Switch feet attachment`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path stroke="#FF8A65" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"></path></svg>
                  </div>
          </div>}
        {(showAttachments) ?
          <div className={styles.attachmentsContainer}>
            {findRankAffordableBotAttachments((account?.bot?.rank || "Silver") as ("Silver"|"Golden"|"Diamond"))
              .filter(attachment => !(account?.bot?.attachments || []).find(att => att.configID === attachment.configID))
              .map((attachment, i) => 
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
                      .filter(attachment => {
                        const multipleAttachments = findMultipleBotAttachments(attachment.attachmentType as ("Face"|"Head"|"Wrist"|"Feet"), account?.bot?.attachments?.map?.((att) => findAttachment(att.configID)) || []);
                        if (!multipleAttachments) return attachment;
                        
                        switch (attachment.attachmentType) {
                          case "Face": 
                            return (multipleAttachments[attachmentFaceSliderPos].configID === attachment.configID);
                          case "Head": 
                            return (multipleAttachments[attachmentHeadSliderPos].configID === attachment.configID);
                          case "Wrist": 
                            return (multipleAttachments[attachmentWristSliderPos].configID === attachment.configID);
                          case "Feet": 
                            return (multipleAttachments[attachmentFeetSliderPos].configID === attachment.configID);
                        }
                      })
                      .map((att: BotAttachmentType, i) => 
                        <div className={styles.attachment} key={i} style={{
                          top: att?.attachmentPosition || "0",
                          transform: `scale(${parseFloat(att?.attachmentScale.replace("%", "")) / 100 || "1"}) translateX(${att?.attachmentType === "Feet" ? "0" : att?.attachmentType === "Wrist" ? "380%" : "10px"})`,
                        }}>
                          {console.log(att?.attachmentScale)}
                          <img src={`/attachments/${att?.attachmentRequiredRank || "Silver"}/${att?.imgPath || ""}`} />
                        </div>) : <></>}
                </div> : <></>}
            </div>
            <div className={styles.userInfoContainer}>
              <div className={styles.userInfo}>
                {account ? (
                  <>
                    <h1 className={styles.accountName} onClick={() => {
                      setAlerts(prevState => [...prevState, { 
                        message: "Change your username", 
                        input: { placeholder: "New username" },
                        buttons: [
                          { 
                            message: "Update", 
                            color: "var(--blue)",
                            onClickInput: (name: string) => {
                              setAlerts(prevState => [...prevState, {
                                message: "Enter your password",
                                input: { placeholder: "Password here..." },
                                buttons: [
                                  {
                                    message: "Update name",
                                    color: "var(--blue)",
                                    onClickInput: (password: string) => {
                                      updateName(name, password);
                                    }
                                  },
                                  {
                                    message: "Cancel",
                                    color: "var(--orange)"
                                  }
                                ]
                              }]);
                            }
                          },
                          { message: "Cancel", color: "var(--orange)" }
                        ] 
                      }])
                    }}>{account.name}</h1>
                    <h4 onClick={() => {
                      setAlerts(prevState => [...prevState, { 
                        message: "Change your user details", 
                        textArea: { placeholder: "What do you want people to know about you? 🤔", value: account.details || "" },
                        buttons: [
                          { 
                            message: "Submit", 
                            color: "var(--blue)",
                            onClickTextarea: (details: string) => {
                              setAlerts(prevState => [...prevState, {
                                message: "Enter your password",
                                input: { placeholder: "Password here..." },
                                buttons: [
                                  {
                                    message: "Submit",
                                    color: "var(--blue)",
                                    onClickInput: (password: string) => {
                                      updateDetails(details, password);
                                    }
                                  },
                                  {
                                    message: "Cancel",
                                    color: "var(--orange)"
                                  }
                                ]
                              }]);
                            }
                          },
                          { message: "Cancel", color: "var(--orange)" }
                        ] 
                      }])
                    }} className={styles.accountDetails}>{account?.details ? account.details : "No details. Click to add"}</h4>
                    <div>
                      <h4>{account?.followers ? account.followers.length : "Loading..."} Follower{(account?.followers?.length || 0) != 1 && "s"} • {account?.communities ? account.communities.length : "Loading..."} Communit{(account?.communities?.length || 0) != 1 ? "ies" : "y"} • {account?.posts ? account.posts.length : "Loading..."} Post{(account?.posts?.length || 0) != 1 && "s"} • {account?.likes != null ? account?.likes : "Loading..."} Like{(account?.likes || 0) != 1 && "s"}</h4>
                      <h4 onClick={() => {
                        setInterestsPopups(prevState => [...prevState, (account?.interests || []).map(i => i.name)])
                      }} className={styles.accountInterests}>
                        {account.suggestions ?
                          <>
                            Interests:&nbsp;
                            {(account?.interests?.length) != 0 ?
                              (account?.interests || [])
                                .map((interest, i) => interest.name)
                                .slice(0, (account?.interests?.length || 0) - 1)
                                .join(", ") + `${(account?.interests || []).length === 1 ? "" : " and "}` + account?.interests?.[account?.interests?.length - 1].name : "Opt-in to ScrapBook suggestions to add your interests!"}
                          </> : <h4>Opt-in to ScrapBook Suggestions to add your interests</h4>}
                      </h4>
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

export default AccountPage;