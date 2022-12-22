import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { UserType } from "../util/userType.util";
import { Nav, Popup, PopupType, Sidebar, Alert } from "../components";
import { getSidebarPropsWithOption } from "../util/homeSidebarProps.util";
import styles from "../styles/friends.module.css";  

const FriendsPage: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [errorPopups, setErrorPopups] = useState<Array<string>>([]);
  const [successPopups, setSuccessPopups] = useState<Array<string>>([]);
  const [alerts, setAlerts] = useState<Array<{ message: string, buttons: Array<{ message: string, onClick?: () => any, color?: string }>, input?: { placeholder?: string } }>>([]);
  const [queriedName, setQueriedName] = useState("");
  const [friendsResponse, setFriendsResponse] = useState<Array<UserType>>([]);
  const [noFriendsSearchedResponse, setNoFriendsSearchedResponse] = useState(false);
  const [searchCursor, setSearchCursor] = useState<string|undefined>();
  const [currPage, setCurrPage] = useState(1);
  const [searchUserLength, setSearchUserLength] = useState(0);
  const router = useRouter();

  const auth = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const res = await fetchAccount(localStorage, accessToken, refreshToken);
    if (res.loggedIn) {
      setLoggedIn(true)
      setAccount(res.account);
      return;
    } else {
      router.push(res.redirect);
      return;
    }
  }

  const searchUsers = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/users/search", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: queriedName, 
        page: currPage,
        cursor: searchCursor,
        accessToken, refreshToken
      })
    });
    const res = await req.json();

    console.log(res);

    if (res.success) {
      setSearchUserLength(res.userLength);
      setFriendsResponse(res.users);

      if (res.users.length === 0) 
        setNoFriendsSearchedResponse(true);

      if (res.generateNewTokens) {
        localStorage.setItem("at", res.newAccessToken);
        localStorage.setItem("rt", res.newRefreshToken);
      }
    }
  }

  // const fetchFolder = async () => {
  //   const path = new URL(window.location.href).pathname;
  //   const folderID = decodeURIComponent(path.split('/')[2]);
  //   const accessToken = localStorage.getItem("at") || "";
  //   const refreshToken = localStorage.getItem("rt") || "";

  //   const req = await fetch(backendPath + "/folders/find", {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       accessToken, refreshToken,
  //       folderID
  //     })
  //   });
  //   const res = await req.json();
  //   res?.folder && setFolder(res.folder);
  //   if (res.success) {
  //     if (res.generateNewTokens) {
  //       localStorage.setItem("at", res?.newAccessToken || "");
  //       localStorage.setItem("rt", res?.newRefreshToken || "");
  //     }
  //   } else {
  //     setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
  //     return;
  //   }
  // }

  // const removePostFromFolder = async (postID: string) => {
  //   const path = new URL(window.location.href).pathname;
  //   const folderID = decodeURIComponent(path.split('/')[2]);
  //   const accessToken = localStorage.getItem("at") || "";
  //   const refreshToken = localStorage.getItem("rt") || "";

  //   const req = await fetch(backendPath + "/folders/removePost", {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       accessToken, refreshToken,
  //       folderID,
  //       postID
  //     })
  //   });
  //   const res = await req.json();
  //   res?.folder && setFolder(res.folder);
  //   if (res.success) {
  //     if (res.generateNewTokens) {
  //       localStorage.setItem("at", res?.newAccessToken || "");
  //       localStorage.setItem("rt", res?.newRefreshToken || "");
  //     }

  //     setSuccessPopups(prevState => [...prevState, "Successfully removed post from folder"]);
  //     return;
  //   } else {
  //     setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
  //     return;
  //   }
  // }

  useEffect(() => {
    auth();
  }, []);
      
  return (
    <>
      <Head>
        <title>ScrapBook - Friends</title>

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

      <Sidebar categories={getSidebarPropsWithOption("Friends")} onToggle={(value) => setSidebarCollapsed(value)} />
      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} /> 
      {alerts.map((alert, i) =>
        <Alert message={alert.message} buttons={alert.buttons} input={alert?.input} key={i} />)}

      <div className={styles.friendsContainer} data-collapsed={sidebarCollapsed}>
        <div className={styles.findFriend}>
          <input placeholder="Enter a user name" onChange={(e) => setQueriedName(e.target.value)} />
          <button onClick={() => searchUsers()}>Search 🔍</button>
        </div>
        <div className={styles.results}>
          {friendsResponse.length === 0 ? <h1>{noFriendsSearchedResponse ? "We can't find any users under that name... 🤔" : "Enter a username above to search for users to friend ❤️"}</h1> : 
            friendsResponse.map((friendUser, i) =>
              <div className={styles.friendUser} key={i}>
                <h4>{friendUser.name}</h4>
                <button>Add friend</button>
              </div>)}
          
          <div className={styles.arrows}>
            {(searchUserLength > 2 && (searchUserLength / 2 > currPage)) ? <button className={styles.arrow}>➡️</button> : <></>}
            {(searchUserLength > 2 && (searchUserLength / 2 < currPage)) ? <button className={styles.arrow}>⬅️</button> : <></>}
          </div>
        </div>
      </div>
    </>
  );
}

export default FriendsPage;