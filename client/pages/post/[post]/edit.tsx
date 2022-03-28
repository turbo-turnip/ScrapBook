import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { UserType } from "../../../util/userType.util";
import { Nav, Popup, PopupType, Sidebar } from "../../../components";
import { getSidebarPropsWithOption } from "../../../util/homeSidebarProps.util";
import styles from "../../../styles/post.module.css";
import { PostType } from "../../../util/postType.util";
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
require('react-quill/dist/quill.snow.css');

const EditPage: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [errorPopups, setErrorPopups] = useState<Array<string>>([]);
  const [editorText, setEditorText] = useState("");
  const [successPopups, setSuccessPopups] = useState<Array<string>>([]);
  const [post, setPost] = useState<PostType|null>();
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
    setPost(res?.post);
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

  const submitEditedPost = async () => {
    if (post && account)
      if (post.user.id === account?.id) {
        const accessToken = localStorage.getItem("at") || "";
        const refreshToken = localStorage.getItem("rt") || "";

        const req = await fetch(backendPath + "/posts/edit", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accessToken, refreshToken,
            postID: post.id,
            content: editorText
          })
        });
        const res = await req.json();
        if (res.success) {
          if (res.generateNewTokens) {
            localStorage.setItem("at", res?.newAccessToken || "");
            localStorage.setItem("rt", res?.newRefreshToken || "");
          }

          setSuccessPopups(prevState => [...prevState, "Successfully edited post"]);
          setTimeout(() => router.push(`/post/${post.id}`), 5500);
          return;
        } else {
          setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
          return;
        }
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

      <div className={styles.container} data-collapsed={sidebarCollapsed}>
        {(post && post.user.id === account?.id) && 
          <>
            <button className={styles.submit} onClick={() => submitEditedPost()}>Submit edited post</button>
            <ReactQuill
              style={{
                height: "100%"
              }}
              theme="snow" 
              defaultValue={post.body + (post?.images || []).map((image) => `<img src="${image.url}" />`).join('<br/>')}
              placeholder={`Edit this post`} 
              onChange={setEditorText}
              formats={[
                'size',
                'bold', 'italic', 'underline', 'blockquote',
                'list', 'bullet',
                'link', 'image', 'video'
              ]} 
              modules={{
                toolbar: [
                  [{ size: [] }],
                  ['bold', 'italic', 'underline', 'blockquote'],
                  [{'list': 'ordered'}, {'list': 'bullet'}],
                  ['link', 'image', 'video']
                ],
                clipboard: {
                  matchVisual: true
                }
              }} />
            </>}
        </div>
    </>
  );
}

export default EditPage;