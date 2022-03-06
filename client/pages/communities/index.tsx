import { NextPage } from "next";
import { Nav, Sidebar } from "../../components";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserType } from "../../util/userType.util";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";
import styles from '../../styles/communities.module.css';

const Communities: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  const auth = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const res = await fetchAccount(accessToken, refreshToken);
    if (res.loggedIn) {
      setLoggedIn(true)
      setAccount(res.account);
      return;
    } else {
      router.push(res.redirect);
      return;
    }
  }

  useEffect(() => {
    auth();
  }, []);

  return (
    <>
      <Head>
        <title>ScrapBook - Home</title>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

      <Sidebar categories={getSidebarPropsWithOption("Communities")} onToggle={(value) => setSidebarCollapsed(value)} />
      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} /> 

      <div className={styles.topBar} data-collapsed={sidebarCollapsed}>
        <button>Find Community 🧐</button>
        <button onClick={() => router.push('/communities/create')}>Create Community ➕</button>
      </div>
    </>
  );
}

export default Communities;