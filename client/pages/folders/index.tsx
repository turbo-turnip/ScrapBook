import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { UserType } from "../../util/userType.util";
import { Nav, Popup, PopupType, Sidebar, Post, Alert } from "../../components";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";
import styles from "../../styles/folders.module.css";
import { FolderType } from "../../util/folderType.util";

const FoldersPage: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [errorPopups, setErrorPopups] = useState<Array<string>>([]);
  const [successPopups, setSuccessPopups] = useState<Array<string>>([]);
  const [alerts, setAlerts] = useState<Array<{ message: string, buttons: Array<{ message: string, onClick?: () => any, color?: string }>, input?: { placeholder?: string } }>>([]);
  const [folders, setFolders] = useState<Array<FolderType>>();
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

  const fetchFolders = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/folders/forUser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken
      })
    });
    const res = await req.json();
    res?.folders && setFolders(res.folders);
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }
    } else {
      setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
      return;
    }
  }

  const createFolder = async (label: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/folders", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        label
      })
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      setSuccessPopups(prevState => [...prevState, "Successfully created folder"]);
      setFolders(prevState => res?.folders || prevState);
    } else {
      setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
      return;
    }
  }

  const deleteFolder = async (folderID: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/folders/removeUser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        folderID
      })
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      setSuccessPopups(prevState => [...prevState, "Successfully deleted folder"]);
      setFolders(prevState => res?.folders || prevState);
    } else {
      setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
      return;
    }
  }

  useEffect(() => {
    auth();
  }, []);

  useEffect(() => {
    // Fix this later
    if (loggedIn)
      setTimeout(fetchFolders, 500);
  }, [loggedIn]);

  return (
    <>
      <Head>
        <title>ScrapBook - Folders</title>

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

      <Sidebar categories={getSidebarPropsWithOption("Folders")} onToggle={(value) => setSidebarCollapsed(value)} />
      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} /> 
      {alerts.map((alert, i) =>
        <Alert message={alert.message} buttons={alert.buttons} input={alert?.input} key={i} />)}

      <div className={styles.container} data-collapsed={sidebarCollapsed}>
        <button className={styles.create} onClick={() => setAlerts(prevState => [...prevState, { message: "Enter folder label", input: { placeholder: "e.g. Cool Posts" }, buttons: [{ message: "Create", color: "var(--orange)", onClickInput: (input: string) => createFolder(input) }, { message: "Cancel" }] }])}>Create new folder ➕</button>
        {(folders && folders.length === 0) && <h1 className={styles.info}>You don't have any folders yet... 👀</h1>}
        {(folders && folders.length > 0) && 
          <div className={styles.folderContainer}>
            {folders.map((folder, i) =>
              <div className={styles.folder} key={i} onClick={() => router.push(`/folders/${folder.id}`)} data-label={folder.label}>
                <div className={styles.moreOptions} onClick={(event) => event.stopPropagation()}>
                  ⋮
                  <div>
                    <p>Edit label</p>
                    <p onClick={() => setAlerts(prevState => [...prevState, { message: "Are you sure you want to delete this folder?", buttons: [{ message: "Yes 👍", onClick: () => deleteFolder(folder.id) }, { message: "No 👎" }] }])}>Delete folder</p>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
    </>
  );
}

export default FoldersPage;