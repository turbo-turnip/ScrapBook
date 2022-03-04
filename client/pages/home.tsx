import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Nav, Sidebar } from "../components";
import { UserType } from "../util/userType.util";

const Home: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
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

      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} /> 

      <Sidebar categories={[
        {
          title: "Discover",
          options: [
            {
              title: "Feed",
              tooltip: "New and cool posts from all your joined communities!",
              emoji: "☝️"
            },
            {
              title: "Communities",
              tooltip: "See what's goin' on in your communities!",
              emoji: "👀"
            },
            {
              title: "Friends",
              tooltip: "Add new friends, and view your current ones!",
              emoji: "⭐️"
            },
            {
              title: "Messages",
              tooltip: "Message people you know, or talk with your friends!",
              emoji: "📨"
            },
            {
              title: "Account",
              tooltip: "View your account and manage your user settings!",
              emoji: "⚙️"
            }
          ]
        },
        {
          title: "More",
          options: [
            {
              title: "Folders",
              tooltip: "Manage your post and event folders",
              emoji: "📁"
            }
          ]
        }
      ]} />
    </>
  );
}

export default Home;