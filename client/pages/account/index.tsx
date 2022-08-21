import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { UserType } from "../../util/userType.util";
import { Nav, Popup, PopupType, Sidebar, Post, Alert } from "../../components";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";
import styles from '../../styles/account.module.css';
import { CommunityType } from "../../util/communityType.util";

const PostPage: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [errorPopups, setErrorPopups] = useState<Array<string>>([]);
  const [successPopups, setSuccessPopups] = useState<Array<string>>([]);
  const [alerts, setAlerts] = useState<Array<{ message: string, buttons: Array<{ message: string, onClick?: () => any, color?: string }>, input?: { placeholder?: string } }>>([]);
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

  useEffect(() => {
    auth();
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
      {alerts.map((alert, i) =>
        <Alert message={alert.message} buttons={alert.buttons} input={alert?.input} key={i} />)}

      <div className={styles.container} data-collapsed={sidebarCollapsed}>
        <div className={styles.userContainer}>
          <div className={styles.botContainer}>
            <img src="/bot.png" alt="ScrapBook Bot" />
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
        </div>
      </div>
    </>
  );
}

export default PostPage;