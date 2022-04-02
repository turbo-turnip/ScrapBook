import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { UserType } from "../../../util/userType.util";
import { Nav, Popup, PopupType, Sidebar, Post, Alert } from "../../../components";
import { getSidebarPropsWithOption } from "../../../util/homeSidebarProps.util";
import styles from "../../../styles/post.module.css";
import { PostType } from "../../../util/postType.util";
import { CommunityType } from "../../../util/communityType.util";

const PostPage: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [errorPopups, setErrorPopups] = useState<Array<string>>([]);
  const [successPopups, setSuccessPopups] = useState<Array<string>>([]);
  const [post, setPost] = useState<PostType|null>();
  const [showComments, setShowComments] = useState(false);
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

  const fetchPost = async () => {
    const path = new URL(window.location.href).pathname;
    const postID = decodeURIComponent(path.split('/')[2]);
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/posts/find", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        postID
      })
    });
    const res = await req.json();
    res?.post && setPost(res.post);
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

  useEffect(() => {
    auth();
  }, []);

  useEffect(() => {
    // Fix this later
    if (loggedIn)
      setTimeout(fetchPost, 500);
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

      <Sidebar categories={getSidebarPropsWithOption("Communities")} onToggle={(value) => setSidebarCollapsed(value)} />
      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} /> 
      {alerts.map((alert, i) =>
        <Alert message={alert.message} buttons={alert.buttons} input={alert?.input} key={i} />)}

      <div className={styles.container} data-collapsed={sidebarCollapsed}>
        <Post
          post={post}
          showComments={showComments}
          setShowComments={(set: (comments: Array<boolean>) => Array<boolean>) => setShowComments(set([showComments])[0])} 
          index={0}
          router={router}
          userID={account?.id || ""}
          setAlerts={setAlerts}
          setErrorPopups={setErrorPopups}
          setSuccessPopups={setSuccessPopups}
          setCommunity={(set: CommunityType) => setPost(set.posts.find(communityPost => communityPost.id === post?.id))} />
      </div>
    </>
  );
}

export default PostPage;