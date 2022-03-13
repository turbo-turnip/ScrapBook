import { NextPage } from "next";
import { Nav, Sidebar } from "../../components";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { UserType } from "../../util/userType.util";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";
import styles from '../../styles/communities.module.css';
import { CommunityType } from "../../util/communityType.util";

const Communities: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const topBarRef = useRef<HTMLDivElement|null>(null);
  const [communities, setCommunities] = useState<Array<CommunityType>>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);
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

  const fetchCommunities = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/communities/forUser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accessToken, refreshToken })
    });
    const res = await req.json();
    setCommunitiesLoading(false);
    if (res.success) {
      if (res?.generateNewTokens) {
        console.log('setting new tokens:', res?.newAccessToken, res?.newRefreshToken);
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      setCommunities(res.communities);
      return;
    } else {
      router.push('/login');
      return;
    }
  }

  useEffect(() => {
    auth();
  }, []);

  useEffect(() => {
    // Fix this later
    if (loggedIn)
      setTimeout(fetchCommunities, 500);
  }, [loggedIn]);

  return (
    <>
      <Head>
        <title>ScrapBook - Feed</title>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

      <Sidebar categories={getSidebarPropsWithOption("Communities")} onToggle={(value) => setSidebarCollapsed(value)} />
      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} /> 

      <div className={styles.topBar} data-collapsed={sidebarCollapsed} ref={topBarRef}>
        <button>Find Community 🧐</button>
        <button onClick={() => router.push('/communities/create')}>Create Community ➕</button>
      </div>

      <div className={styles.communities} data-collapsed={sidebarCollapsed} style={{
        position: "relative",
        top: topBarRef?.current ? topBarRef?.current.getBoundingClientRect().top : "20vh"
      }}>
        {communitiesLoading ? <h1 className={styles.info}>Loading...</h1> : null}
        {(!communitiesLoading && communities.length === 0) ? <h1 className={styles.info}>Hmm, you don't seem to be in any communities...🤔</h1> : null}
        {(!communitiesLoading && communities.length > 0) && 
          <>
            {communities.map((community, i) =>
              <div className={styles.community} key={i} onClick={() => router.push(`/communities/${community.title}`)}>
                <img src="/community-banner.svg" alt="Community Banner" />
                <div className={styles.communityContent}>
                  <h1 className={styles.communityTitle}>{community.title}</h1>
                  <div className={styles.communityInfo}>
                    <span>{community.members.length} Member{community.members.length != 1 && "s"}</span>
                    <span>•</span>
                    <span>{community.posts.length} Post{community.posts.length != 1 && "s"}</span>
                    <div className={styles.communityDetails}>
                      {community.details}
                    </div>
                  </div>
                </div>
              </div>)}
          </>}
      </div>
    </>
  );
}

export default Communities;