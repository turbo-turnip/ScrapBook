import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Alert, Nav, Popup, PopupType, Post, Sidebar } from "../../components";
import styles from "../../styles/user.module.css";
import { UserType } from "../../util/userType.util";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";
import { findAttachment } from "../../util/findAttachment.util";
import { findMultipleBotAttachments } from "../../util/findMultipleBotAttachments.util";
import { BotAttachmentType } from "../../util/botAttachmentType";
import * as botAttachments from '../../util/botAttachments.json';

const UserPage: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<UserType|null>();
  const [invalidUser, setInvalidUser] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement|null>(null);
  const [alerts, setAlerts] = useState<Array<
      {
        message: string;
        buttons: Array<
          { message: string; onClick?: () => any; color?: string }
        >;
        input?: { placeholder?: string };
      }
    >
  >([]);
  const [errorPopups, setErrorPopups] = useState<Array<string>>([]);
  const [successPopups, setSuccessPopups] = useState<Array<string>>([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const router = useRouter();

  const auth = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const res = await fetchAccount(localStorage, accessToken, refreshToken);
    if (res.loggedIn) {
      setLoggedIn(true);
      setAccount(res.account);
      return;
    } else {
      router.push(res.redirect);
      return;
    }
  }

  const fetchUser = async () => {
    const path = new URL(window.location.href).pathname;
    const name = decodeURIComponent(path.split("/")[2]);

    const req = await fetch(backendPath + "/users/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name
      }),
    });
    const res = await req.json();
    setUserLoading(false);
    if (res.success) {
      setUser(res?.user);
      return;
    } else {
      setInvalidUser(true);
      setErrorPopups(prevState => [...prevState, "A problem occurred. Please refresh the page"]);
      return;
    }
  }

  const followUser = async () => {
    const path = new URL(window.location.href).pathname;
    const user = decodeURIComponent(path.split("/")[2]);
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/users/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        accessToken, refreshToken,
        user
      }),
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateTokens) {
        localStorage.setItem("at", res.newAccessToken);
        localStorage.setItem("rt", res.newRefreshToken);
      }

      setUser(res.updatedUser);
      setSuccessPopups(prevState => [...prevState, "Successfully followed " + user]);

      return;
    } else {
      setErrorPopups(prevState => [...prevState, "An error occurred, please try again."]);
    }
  }

  useEffect(() => {
    auth();
  }, []);

  useEffect(() => {
    if (account && loggedIn) {
      fetchUser();
    }
  }, [account, loggedIn]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    window.onresize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }
  }, []);


  useEffect(() => {
    // Very inelegant, I'll either fix it later, or forget about it, which most likely sums up at least 80% of the codebase...
    if (windowWidth !== 0) {
      if (windowWidth >= 600 && containerRef.current) {
        if (!sidebarCollapsed) {
          const sidebar = containerRef.current?.previousElementSibling?.previousElementSibling;
          if (sidebar) {
            const sidebarClientRect = sidebar.getBoundingClientRect();
            containerRef.current.style.width = `calc(100vw - ${sidebarClientRect.width}px)`;
          }
        } else {
          containerRef.current.style.width = "calc(100vw - 15px)";
        }
      } else if (windowWidth < 600 && containerRef.current) {
        setSidebarCollapsed(true);
        containerRef.current.style.width = "calc(100vw - 15px)";
        if (!sidebarCollapsed) {
          containerRef.current.style.filter = "blur(15px)";
          containerRef.current.style.pointerEvents = "none";
        } else {
          containerRef.current.style.filter = "none";
          containerRef.current.style.pointerEvents = "all";
        }
      }
    }
  }, [sidebarCollapsed, windowWidth]);

  return (
    <>
      <Head>
        <title>ScrapBook - {user ? user.name : "User"}</title>

        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

      {errorPopups.map((errorPopup, i) =>
        (
          <Popup
            key={i}
            message={errorPopup || "An error occurred. Please refresh the page"}
            type={PopupType.ERROR}
          />
        )
      )}
      {successPopups.map((successPopup, i) =>
        (
          <Popup
            key={i}
            message={successPopup ||
              "An error occurred. Please refresh the page"}
            type={PopupType.SUCCESS}
          />
        )
      )}

      <Sidebar
        categories={getSidebarPropsWithOption("Communities")}
        onToggle={(value) => setSidebarCollapsed(value)}
      />
      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} />
      {alerts.map((alert, i) =>
        (
          <Alert
            message={alert.message}
            buttons={alert.buttons}
            input={alert?.input}
            key={i}
          />
        )
      )}

      <div
        className={styles.communityContainer}
        data-collapsed={sidebarCollapsed}
      >
        {userLoading ? <h1 className={styles.info}>Loading...</h1> : null}
        {(!userLoading && invalidUser)
          ? (
            <h1 className={styles.info}>
              Hmm... That user doesn't exist 👁👄👁
            </h1>
          )
          : null}
        
        <div className={styles.container} ref={containerRef}>
          <div className={styles.infoTop}>
            <div>{user?.coins || 0} Coins</div>
            <button className={styles.follow} onClick={() => followUser()}>
              {user?.followers &&
                (user?.followers || []).find(user => user.followingUserID === account?.id) ? "Unfollow" : "Follow"}
            </button>
            <div>{user?.bot?.rank || "Silver"} Rank</div>
          </div>

          <div className={styles.userContainer}>
            <div className={styles.userInfoContainer}>
              <div className={styles.userInfo}>
                {user ? (
                  <>
                    <h1 className={styles.accountName}>{user.name}</h1>
                    <h4 className={styles.accountDetails}>{account?.details ? account.details : "This user doesn't have any personal details"}</h4>
                    <div>
                      <div>
                        <span>{user?.followers ? user.followers.length : "Loading..."} Follower{(user?.followers?.length || 0) != 1 && "s"}</span>
                        <span>{user?.communities ? user.communities.length : "Loading..."} Communit{(user?.communities?.length || 0) != 1 ? "ies" : "y"}</span>
                        <span>{user?.posts ? user.posts.length : "Loading..."} Post{(user?.posts?.length || 0) != 1 && "s"}</span>
                        <span>{user?.likes != null ? user?.likes : "Loading..."} Like{(user?.likes || 0) != 1 && "s"}</span>
                      </div>
                      <h4 className={styles.accountInterests}>
                        {user.suggestions ?
                          <>
                            Interests:&nbsp;
                            {(user?.interests?.length) != 0 ?
                              (user?.interests || [])
                                .map((interest, i) => interest.name)
                                .slice(0, (user?.interests?.length || 0) - 1)
                                .join(", ") + `${(user?.interests || []).length === 1 ? "" : " and "}` + user?.interests?.[user?.interests?.length - 1].name : "This user isn't opted in to ScrapBook Suggestions"}
                          </> : <h4>This user isn't opted in to ScrapBook Suggestions</h4>}
                      </h4>
                    </div>
                  </>
                ) : <h1>Loading...</h1>}
              </div>
            </div>
            <div className={styles.botContainer} style={{
              width: windowHeight / 3.75,
              height: windowHeight / 2.375
            }}>
              {user?.bot ?
                <div className={styles.accountBotAttachments}>
                  {(user.bot.attachments) ?
                  ((user.bot.attachments || []) as Array<{ configID: string }>)
                      .map((att: { configID: string }): BotAttachmentType => (user?.bot?.attachments || []).filter(a => a.configID === att?.configID)[0] as BotAttachmentType)
                      .map(att => {
                        return { ...botAttachments.find(iHaveRanOutOfVariableNamesForAttachmentsSoThisIsGoodEnough => iHaveRanOutOfVariableNamesForAttachmentsSoThisIsGoodEnough.configID === att.configID) as BotAttachmentType, main: att.main } ?? null;
                      })
                      .filter(att => att)
                      .filter(attachment => {
                        const multipleAttachments = findMultipleBotAttachments(attachment.attachmentType as ("Face"|"Head"|"Wrist"|"Feet"), user?.bot?.attachments?.map?.((att) => findAttachment(att.configID)) || []);
                        console.log(multipleAttachments)
                        if (!multipleAttachments) return true;

                        
                        return attachment.main;
                      })
                      .map((att: BotAttachmentType, i) => 
                        <div className={styles.attachment} key={i} style={{
                          top: att?.attachmentPosition || "0",
                          transform: `scale(${parseFloat(att?.attachmentScale?.replace("%", "")) / 100 || "1"}) translateX(${att?.attachmentType === "Feet" ? "0" : att?.attachmentType === "Wrist" ? "380%" : "10px"})`,
                        }}>
                          <img src={`/attachments/${att?.attachmentRequiredRank || "Silver"}/${att?.imgPath || ""}`} />
                        </div>) : <></>}
                </div> : <></>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
