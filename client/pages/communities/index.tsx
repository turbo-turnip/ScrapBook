import { NextPage } from "next";
import { Nav, Sidebar, Popup, PopupType } from "../../components";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { UserType } from "../../util/userType.util";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";
import styles from '../../styles/communities.module.css';
import { CommunityType } from "../../util/communityType.util";
import { kMaxLength } from "buffer";

const Communities: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const topBarRef = useRef<HTMLDivElement|null>(null);
  const [communities, setCommunities] = useState<Array<CommunityType>>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);
  const [showFind, setShowFind] = useState(false);
  const [searchedCommunities, setSearchedCommunities] = useState<Array<CommunityType>|null>();
  const [searchCommunitiesLoading, setSearchCommunitiesLoading] = useState(false);
  const [showSearchedCommunityJoinSuccessPopup, setShowSearchedCommunityJoinSuccessPopup] = useState(false);
  const [searchedCommunityJoinErrorPopups, setSearchedCommunityJoinErrorPopups] = useState<Array<string>>([]);
  const [errorPopups, setErrorPopups] = useState<Array<string>>([]);
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

  const findCommunity = async (searchTitle: string) => {
    setSearchCommunitiesLoading(true);
    const req = await fetch(backendPath + "/communities/search", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: searchTitle })
    });
    const res = await req.json();

    if (res.success) {
      setSearchCommunitiesLoading(false);
      setSearchedCommunities(res?.communities || []);
      return;
    } else {
      setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again"]);
      return;
    }
  }

  const joinCommunity = async (communityID: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/communities/join", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        communityID,
        accessToken, refreshToken
      })
    });
    const res = await req.json();
    
    if (res.success) {
      if (res?.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      } 

      setSearchedCommunities((prevState) => {
        return prevState?.map(community => {
          return community.id === communityID ? res?.community || community : community;
        });
      });
      setShowSearchedCommunityJoinSuccessPopup(true);
      setTimeout(() => {
        setShowSearchedCommunityJoinSuccessPopup(false)
        router.push(`/community/${res.community?.title || ""}`);
      }, 5500);
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
      setTimeout(fetchCommunities, 500);
  }, [loggedIn]);

  return (
    <>
      <Head>
        <title>ScrapBook - Communities</title>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

      {errorPopups.map((errorPopup, i) =>
        <Popup 
          key={i}
          message={errorPopup || "An error occurred. Please refresh the page"}
          type={PopupType.ERROR}
          />)}
      {showSearchedCommunityJoinSuccessPopup &&
        <Popup
          message="Successfully joined community!"
          type={PopupType.SUCCESS}
        />}

      <Sidebar categories={getSidebarPropsWithOption("Communities")} onToggle={(value) => setSidebarCollapsed(value)} />
      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} /> 

      <div className={styles.topBar} data-collapsed={sidebarCollapsed} ref={topBarRef}>
        <button onClick={() => setShowFind(prev => !prev)}>{showFind ? "View joined communities 🗒" : "Find Community 🧐"}</button>
        <button onClick={() => router.push('/communities/create')}>Create Community ➕</button>
      </div>

      <div className={styles.communities} data-collapsed={sidebarCollapsed} style={{
        position: "relative",
        top: topBarRef?.current ? topBarRef?.current.getBoundingClientRect().top : "20vh"
      }}>
        {communitiesLoading ? <h1 className={styles.info}>Loading...</h1> : null}
        {(!showFind && !communitiesLoading && communities.length === 0) && <h1 className={styles.info}>Hmm, you don't seem to be in any communities...🤔</h1>}

        {showFind &&
          <>
            <form className={styles.findInput} onSubmit={(event) => {
              event.preventDefault();
              const target = event.target as HTMLFormElement;
              findCommunity((target.querySelector("input") as HTMLInputElement).value);
            }}>
              <input placeholder="Search for a community 🔎" />
              <button>Go 🧐</button>
            </form>

            {searchCommunitiesLoading && <h1 className={styles.info}>Loading...</h1>}
            {(!searchCommunitiesLoading && (searchedCommunities || []).length === 0) && <h1 className={styles.info}>Hmm, there aren't any communities that match that name. Try a different name 😐</h1>}
            {(!searchCommunitiesLoading && (searchedCommunities || []).length > 0) && 
              searchedCommunities?.map((community, i) => 
                <div className={styles.searchedCommunity} key={i}>
                  <h1 onClick={() => router.push(`/community/${community?.title || ""}`)}>{community.title}{(account && !(community?.membersUser || []).find(m => m.id === account.id)) && <button className={styles.joinCommunityBtn} onClick={() => joinCommunity(community.id)}>Join Community</button>}</h1>
                  <p>{community.details}</p>
                  <div className={styles.searchedCommunityInterests}>{community.interests.map(i => i.name).join(' • ')}{community.interests.length === 0 && "No community interests 🤷🏾‍♀️"}</div>
                  <div className={styles.userCount} data-user-count={community.members.length}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM20.59 22c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                </div>)}
          </>}
        {(!communitiesLoading && communities.length > 0 && !showFind) && 
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