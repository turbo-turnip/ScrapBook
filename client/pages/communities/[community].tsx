import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Sidebar, Nav, Alert } from "../../components";
import styles from '../../styles/communities.module.css';
import { CommunityType } from "../../util/communityType.util";
import { UserType } from "../../util/userType.util";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";

const Community: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [community, setCommunity] = useState<CommunityType|null>();
  const [communityLoading, setCommunityLoading] = useState(true);
  const [invalidCommunity, setInvalidCommunity] = useState(false);
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

  const fetchCommunity = async () => {
    const path = new URL(window.location.href).pathname;
    const title = decodeURIComponent(path.split('/')[2]);

    const req = await fetch(backendPath + "/communities/community", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });
    const res = await req.json();
    setCommunityLoading(false);
    setInvalidCommunity(!res.success);
    if (res.success) {
      setCommunity(res.community);
      return;
    }
  }

  useEffect(() => {
    auth();
  }, []);

  useEffect(() => {
    // Fix this later
    if (loggedIn)
      setTimeout(fetchCommunity, 500);
  }, [loggedIn]);

  return (
    <>
      <Head>
        <title>ScrapBook - Community</title>

        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

      <Sidebar categories={getSidebarPropsWithOption("Communities")} onToggle={(value) => setSidebarCollapsed(value)} />
      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} /> 

      <div className={styles.communityContainer} data-collapsed={sidebarCollapsed}>

        {communityLoading ? <h1 className={styles.info}>Loading...</h1> : null}
        {(!communityLoading && invalidCommunity) ? <h1 className={styles.info}>Hmm... That community doesn't exist 👁👄👁</h1> : null}

        {(!communityLoading && !invalidCommunity && community) &&
          <div className={styles.banner} data-title={community.title}>
            <div className={styles.bannerCenter}>
              <div className={styles.leaveCommunity}>➡️</div>
              <h1>{community.title}</h1>
              <p>{community.details}</p>
            </div>
            <div className={styles.bannerStats}>
              {community.members.length} Member{community.members.length != 1 ? "s" : null} • {community.posts.length} Post{community.posts.length != 1 ? "s" : null}  
            </div>  
          </div>}
      </div>
    </>
  );
}

export default Community;