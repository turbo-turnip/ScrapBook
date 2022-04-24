import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Alert, Nav, Popup, PopupType, Post, Sidebar } from "../../components";
import styles from "../../styles/communities.module.css";
import { CommunityType } from "../../util/communityType.util";
import { UserType } from "../../util/userType.util";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";
const ReactQuill = typeof window === "object"
  ? require("react-quill")
  : () => false;
require("react-quill/dist/quill.snow.css");

const Community: NextPage = () => {
  const [communityBannerImageSizes, setCommunityBannerImageSizes] = useState<
    Array<Array<number>>
  >([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [community, setCommunity] = useState<CommunityType | null>();
  const [communityLoading, setCommunityLoading] = useState(true);
  const [invalidCommunity, setInvalidCommunity] = useState(false);
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
  const [postBoxOpen, setPostBoxOpen] = useState(false);
  const postBarContainerRef = useRef<HTMLDivElement | null>(null);
  const [editorText, setEditorText] = useState("");
  const [newPostLoading, setNewPostLoading] = useState(false);
  const [showComments, setShowComments] = useState<Array<boolean>>([]);
  const [showFolders, setShowFolders] = useState<Array<boolean>>([]);
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
  };

  const fetchCommunity = async () => {
    const path = new URL(window.location.href).pathname;
    const title = decodeURIComponent(path.split("/")[2]);

    const req = await fetch(backendPath + "/communities/community", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    const res = await req.json();
    setCommunityLoading(false);
    setInvalidCommunity(!res.success);
    if (res.success) {
      setCommunity(res.community);
      return;
    }
  };

  const joinCommunity = async (communityID: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/communities/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        communityID,
        accessToken,
        refreshToken,
      }),
    });
    const res = await req.json();

    if (res.success) {
      if (res?.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      setCommunity((prevState) => res?.community || prevState);
      return;
    } else {
      setErrorPopups(
        (prevState) => [
          ...prevState,
          res?.error ||
          "An error occurred. Please refresh the page and try again 👁👄👁",
        ]
      );
      return;
    }
  };

  const leaveCommunity = async (communityID: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/communities/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        communityID,
        accessToken,
        refreshToken,
      }),
    });
    const res = await req.json();

    if (res.success) {
      if (res?.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      setCommunity((prevState) => res?.community || prevState);
      return;
    } else {
      setErrorPopups(
        (prevState) => [
          ...prevState,
          res?.error ||
          "An error occurred. Please refresh the page and try again 👁👄👁",
        ]
      );
      return;
    }
  };

  const submitPost = async (content: string, communityID: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    setNewPostLoading(true);
    const req = await fetch(backendPath + "/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
        communityID,
        content,
      }),
    });
    const res = await req.json();
    setNewPostLoading(false);
    setPostBoxOpen(false);
    postBarContainerRef?.current?.classList.remove(styles.postBarOpen);
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups(
        (prevState) => [...prevState, "Successfully created post"]
      );
      return;
    } else {
      setErrorPopups(
        (prevState) => [
          ...prevState,
          res?.error ||
          "An error occurred. Please refresh the page and try again",
        ]
      );
      return;
    }
  };

  useEffect(() => {
    const newSizes = [
      new Array(Math.floor(windowWidth / 200)).fill(null).map(() =>
        Math.floor(Math.random() * (80 - 40 + 1) + 40)
      ),
      new Array(Math.floor(windowWidth / 200)).fill(null).map(() =>
        Math.floor(Math.random() * (80 - 40 + 1) + 40)
      ),
    ];
    setCommunityBannerImageSizes(newSizes);
  }, [windowWidth]);

  useEffect(() => {
    auth();

    window.onmousemove = (event) => {
      if (bannerBackgroundRef?.current) {
        const bannerBackgroundImages = Array.from(
          bannerBackgroundRef.current.querySelectorAll("img"),
        );
        bannerBackgroundImages.forEach((img, i) => {
          const speed = Math.cos(i) * 10 + i;
          const x = (window.innerWidth - event.pageX * speed) / 500;
          const y = (window.innerHeight - event.pageY * speed) / 500;
          img.style.transform = `translate(${x}px, ${y}px)`;
        });
      }
    };

    setWindowWidth(window.innerWidth);
    window.onresize = () => {
      setWindowWidth(window.innerWidth);
    };
  }, []);

  useEffect(() => {
    if (community && community.posts) {
      const newArray = new Array(community.posts.length).fill(false);
      setShowComments((prevState) => {
        const tmp = newArray;
        prevState.slice(0, prevState.length).forEach((s, i) => {
          tmp[i] = s;
        });
        return tmp;
      });
      setShowFolders((prevState) => {
        const tmp = newArray;
        prevState.slice(0, prevState.length).forEach((s, i) => {
          tmp[i] = s;
        });
        return tmp;
      });
    }
  }, [community]);

  useEffect(() => {
    // Fix this later
    if (loggedIn) {
      setTimeout(fetchCommunity, 500);
    }
  }, [loggedIn]);

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
        {communityLoading ? <h1 className={styles.info}>Loading...</h1> : null}
        {(!communityLoading && invalidCommunity)
          ? (
            <h1 className={styles.info}>
              Hmm... That community doesn't exist 👁👄👁
            </h1>
          )
          : null}

        {(!communityLoading && !invalidCommunity && community) &&
          (
            <>
              <div className={styles.banner} data-title={community.title}>
                <div
                  className={styles.bannerBackground}
                  ref={bannerBackgroundRef}
                >
                  {new Array(2).fill(null).map((_, rowIndex) =>
                    (
                      <div className={styles.bannerBgRow} key={rowIndex}>
                        {new Array(Math.floor(windowWidth / 200)).fill(null)
                          .map((_, colIndex) =>
                            (
                              <div key={colIndex}>
                                {((windowWidth * colIndex) % 10) <= 5
                                  ? (
                                    <>
                                      <div>
                                        <img
                                          src="/logo-small.svg"
                                          width={`${
                                            communityBannerImageSizes[rowIndex][
                                              colIndex
                                            ]
                                          }px`}
                                        />
                                      </div>
                                      <div>
                                        <img
                                          src="/logo-small.svg"
                                          width={`${
                                            communityBannerImageSizes[rowIndex][
                                              colIndex
                                            ]
                                          }px`}
                                        />
                                      </div>
                                    </>
                                  )
                                  : <img src="/logo-large.svg" width="200px" />}
                              </div>
                            )
                          )}
                      </div>
                    )
                  )}
                </div>
                  {console.log(community)}
                <div className={styles.bannerCenter}>
                  {(account && community.members.find(member => member.userID === account.id && member.owner)) && 
                    <div className={styles.communitySettings} onClick={() => router.push(`/communities/settings/${community.title}`)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="var(--orange)" strokeWidth="2"></path><path d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99a1.899 1.899 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9Z" stroke="var(--orange)" strokeWidth="2"></path></svg>
                    </div>}
                  {(account && !!community?.membersUser?.find((u) =>
                    u?.id === account.id
                  )) && (
                    <div
                      className={styles.leaveCommunity}
                      onClick={() => {
                        setAlerts((prevState) => [
                          ...prevState,
                          {
                            message:
                              `Are you sure you want to leave ${community
                                ?.title || "this community"}?`,
                            buttons: [
                              {
                                message: "Yes 👋",
                                color: "var(--blue)",
                                onClick: () => {
                                  leaveCommunity(community?.id || "");
                                },
                              },
                              {
                                message: "No ☝️",
                                color: "var(--orange)",
                              },
                            ],
                          },
                        ]);
                      }}
                    >
                      ➡️
                    </div>
                  )}
                  <h1>
                    {community.title}
                  </h1>
                  <p>{community.details}</p>
                  <div className={styles.bannerStats}>
                    {(account && !community?.membersUser?.find((u) =>
                      u?.id === account.id
                    )) &&
                      (
                        <>
                          <button
                            className={styles.joinCommunity}
                            onClick={() => joinCommunity(community?.id || "")}
                          >
                            Join Community
                          </button>
                          <br />
                        </>
                      )}
                    {community.members.length}{" "}
                    Member{community.members.length != 1 ? "s" : null} •{" "}
                    {community.posts.length}{" "}
                    Post{community.posts.length != 1 ? "s" : null}
                    <p className={styles.communityInterests}>
                      Interests:{" "}
                      {community.interests.map((interest) => interest.name)
                        .filter((_, i) => i !== community.interests.length - 1)
                        .join(", ") +
                        `, and ${
                          community.interests[community.interests.length - 1]
                            .name
                        }`}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.postsContainer}>
                {community.posts.length === 0 &&
                  (
                    <h4 className={styles.info}>There aren't any posts yet...
                    </h4>
                  )}
                {community.posts.length > 0 && community.posts.map((post, i) =>
                  (
                    <Post
                      actionPermissions={!!community.membersUser?.find(user => user.id === account?.id)?.id}
                      account={account as UserType}
                      post={post}
                      key={i}
                      index={i}
                      showComments={showComments[i]}
                      setShowComments={setShowComments}
                      showFolders={showFolders[i]}
                      setShowFolders={setShowFolders}
                      router={router}
                      userID={account?.id}
                      setAlerts={setAlerts}
                      setErrorPopups={setErrorPopups}
                      setSuccessPopups={setSuccessPopups}
                      setCommunity={setCommunity}
                    />
                  )
                )}
              </div>
            </>
          )}
        {(loggedIn && community) &&
          (
            <div
              className={styles.postBarContainer}
              data-collapsed={sidebarCollapsed}
              ref={postBarContainerRef}
            >
              <form
                className={styles.postBar}
                onFocus={() => {
                  setPostBoxOpen(true);
                  const postBarContainer = postBarContainerRef?.current;
                  postBarContainer?.classList.add(styles.postBarOpen);
                }}
                onSubmit={(event) => {
                  event.preventDefault();
                  submitPost(editorText, community?.id || "");
                }}
              >
                {postBoxOpen &&
                  <button className={styles.postSubmit}>Submit Post</button>}
                {postBoxOpen &&
                  (
                    <div
                      className={styles.postBoxExit}
                      onClick={() => {
                        setPostBoxOpen(false);
                        const postBarContainer = postBarContainerRef?.current;
                        postBarContainer?.classList.remove(styles.postBarOpen);
                      }}
                    >
                      &times;
                    </div>
                  )}
                {!postBoxOpen &&
                  (
                    <textarea
                      className={styles.postInput}
                      placeholder={`Post to ${community?.title ||
                        "this community"}`}
                    >
                    </textarea>
                  )}
                {(postBoxOpen && newPostLoading) &&
                  <h1 className={styles.info}>Creating post...</h1>}
                {(postBoxOpen && !newPostLoading) &&
                  (
                    <ReactQuill
                      style={{
                        height: "100%",
                      }}
                      theme="snow"
                      placeholder={`Post to ${community?.title ||
                        "this community"}`}
                      onChange={setEditorText}
                      formats={[
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "blockquote",
                        "list",
                        "bullet",
                        "link",
                        "image",
                        "video",
                      ]}
                      modules={{
                        toolbar: [
                          [{ size: [] }],
                          ["bold", "italic", "underline", "blockquote"],
                          [{ "list": "ordered" }, { "list": "bullet" }],
                          ["link", "image", "video"],
                        ],
                        clipboard: {
                          matchVisual: true,
                        },
                      }}
                    />
                  )}
              </form>
            </div>
          )}
      </div>
    </>
  );
};

export default Community;
