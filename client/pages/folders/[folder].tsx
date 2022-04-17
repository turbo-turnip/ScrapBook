import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { UserType } from "../../util/userType.util";
import { Nav, Popup, PopupType, Sidebar, Alert } from "../../components";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";
import styles from "../../styles/folders.module.css";  
import { FolderType } from "../../util/folderType.util";

const FolderPage: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [errorPopups, setErrorPopups] = useState<Array<string>>([]);
  const [successPopups, setSuccessPopups] = useState<Array<string>>([]);
  const [folder, setFolder] = useState<FolderType|null>();
  const [alerts, setAlerts] = useState<Array<{ message: string, buttons: Array<{ message: string, onClick?: () => any, color?: string }>, input?: { placeholder?: string } }>>([]);
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

  const fetchFolder = async () => {
    const path = new URL(window.location.href).pathname;
    const folderID = decodeURIComponent(path.split('/')[2]);
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/folders/find", {
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
    res?.folder && setFolder(res.folder);
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

  const removePostFromFolder = async (postID: string) => {
    const path = new URL(window.location.href).pathname;
    const folderID = decodeURIComponent(path.split('/')[2]);
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/folders/removePost", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        folderID,
        postID
      })
    });
    const res = await req.json();
    res?.folder && setFolder(res.folder);
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      setSuccessPopups(prevState => [...prevState, "Successfully removed post from folder"]);
      return;
    } else {
      setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
      return;
    }
  }

  const editLabel = async (label: string) => {
    const path = new URL(window.location.href).pathname;
    const folderID = decodeURIComponent(path.split('/')[2]);
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/folders/editLabel", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        folderID,
        label
      })
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      console.log(folderID);
      const updatedFolder = res?.folders?.find((f: FolderType) => f.id === folderID);
      setFolder(prevState => updatedFolder || prevState);
      setSuccessPopups(prevState => [...prevState, "Successfully removed post from folder"]);
      return;
    } else {
      setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
      return;
    }
  }

  const deleteFolder = async () => {
    const path = new URL(window.location.href).pathname;
    const folderID = decodeURIComponent(path.split('/')[2]);
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
      setTimeout(() => router.push('/folders'), 6500);

      return;
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
      setTimeout(fetchFolder, 500);
  }, [loggedIn]);
      
  return (
    <>
      <Head>
        <title>ScrapBook - Post</title>

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

      <div className={styles.folderViewContainer} data-collapsed={sidebarCollapsed}>
        {folder && 
          <>
            <div className={styles.folderTop}>
              <img src="/folder.svg" alt={`${folder.label} folder`} />
              <h1 onClick={() => setAlerts(prevState => [...prevState, { message: "What do you want to re-label this folder to?", input: { placeholder: "Enter new label" }, buttons: [{ message: "Re-label", color: "var(--orange)", onClickInput: (input: string) => editLabel(input) }, { message: "Cancel" }]}])}>{folder.label}</h1>
              <button className={styles.deleteFolder} onClick={() => setAlerts(prevState => [...prevState, { message: "Are you sure you want to delete this folder?", buttons: [{ message: "Yes 👀", color: "var(--orange)", onClick: () => deleteFolder() }, { message: "No 👎" }] }])}>Delete folder</button>
            </div>
            <div className={styles.folderBody}>
              {folder.posts.length === 0 && 
                <>
                  <h1 className={styles.info}>There aren't any posts in this folder... 👀</h1>
                  <p>To add posts to this folder, find a post, click the •••, and select "Add to folder", then you can choose which folder to add the post to by clicking on the different folders, and click add!</p>
                </>}
              {folder.posts.sort((a, b) => (a?.body?.length || 0) - (b?.body?.length || 0)).map((post, i) =>
                <div className={styles.folderPost} key={i} onClick={() => router.push(`/post/${post.id}`)}>
                  {post?.body?.length === 0 && <h4>No content</h4>}
                  {(post?.body?.length || 0) > 0 && <div dangerouslySetInnerHTML={{ __html: post?.body || "" }}></div>}
                  {(post?.images?.length || 0) > 0 && <h4>{post.images.length} Attachment{post.images.length != 1 && "s"}</h4>}
                  <p>{post.likes} Like{post.likes != 1 && "s"} • {post.comments.length} Comment{post.comments.length != 1 && "s"} • From {post.community.title}</p>
                  <p>Posted by {post.user.name}</p>
                  <button className={styles.removeBtn} onClick={(event) => {
                    event.stopPropagation();
                    setAlerts(prevState => [...prevState, { message: `Are you sure you want to remove this post from ${folder.label || "this folder"}?`, buttons: [{ message: "Yes 👍", color: "var(--orange)", onClick: () => removePostFromFolder(post.id) }, { message: "No 👎" }] }])
                  }}>Remove from folder</button>
                </div>)}
            </div>
          </>}
      </div>
    </>
  );
}

export default FolderPage;