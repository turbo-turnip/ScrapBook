import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Alert, Nav, Popup, PopupType, Post, Sidebar } from "../../components";
import styles from "../../styles/communities.module.css";
import { CommunityType } from "../../util/communityType.util";
import { UserType } from "../../util/userType.util";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";

const Community: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<UserType|null>();
  const [invalidUser, setInvalidUser] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [alerts, setAlerts] = useState<
    Array<
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
  const bannerBackgroundRef = useRef<HTMLDivElement | null>(null);
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

  // const followUser = async () => {
  //   const path = new URL(window.location.href).pathname;
  //   const user = decodeURIComponent(path.split("/")[2]);
  //   const accessToken = localStorage.getItem("at") || "";
  //   const refreshToken = localStorage.getItem("rt") || "";

  //   const req = await fetch(backendPath + "/users/follow", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ 
  //       accessToken, refreshToken,
  //       user
  //     }),
  //   });
  //   const res = await req.json();
  //   if (res.success) {
      
  //     return;
  //   } else {
      
  //   }
  // }

  useEffect(() => {
    auth();
  }, []);

  useEffect(() => {
    if (account && loggedIn) {
      fetchUser();
    }
  }, [account, loggedIn]);

  return (
    <>
      <Head>
        <title>ScrapBook - Community</title>

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

        {(!userLoading && !invalidUser && user) &&
          (
            <>
              <h1>{user.name}</h1>
            </>
          )}
      </div>
    </>
  );
};

export default Community;
