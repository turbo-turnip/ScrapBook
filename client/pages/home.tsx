import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Nav, Sidebar } from "../components";
import { UserType } from "../util/userType.util";
import { homeSidebarProps } from "../util/homeSidebarProps.util";

const Home: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const router = useRouter();

  const auth = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const res = await fetchAccount(localStorage, accessToken, refreshToken);
    if (res.loggedIn) {
      setLoggedIn(true)
      setAccount(res.account);                                                                                                  x                                                  z                   
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

      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} /> 

      <Sidebar categories={homeSidebarProps} />
    </>
  );
}

export default Home;