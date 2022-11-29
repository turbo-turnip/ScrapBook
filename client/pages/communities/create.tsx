import { NextPage } from "next";
import Head from "next/head";
import { Sidebar, Nav, Form, PopupType, Popup } from "../../components";
import { useRouter } from "next/router";
import { getSidebarPropsWithOption } from "../../util/homeSidebarProps.util";
import React, { useState, useEffect } from "react";
import { UserType } from "../../util/userType.util";
import styles from '../../styles/communities.module.css';
import { queryInterests, queryLimitedInterests } from "../../util/interests.util";

const useForceUpdate = () => {
  const [ _, setValue ] = useState(0);
  return () => setValue(value => value + 1);
}

const Create: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType|null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [relatedInterests, setRelatedInterests] = useState<Array<string>>([]);
  const [interests, setInterests] = useState<Array<string>>([]);
  const [successPopup, setSuccessPopup] = useState<{ message?: string, show: boolean }>({ message: "", show: false });
  const [errorPopups, setErrorPopups] = useState<Array<{ message?: string }>>([]);
  const forceUpdate = useForceUpdate();
  const router = useRouter();

  const createCommunityHandler = async (inputs: Array<any>, tags?: Array<any>) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";
    const [title, details] = inputs;

    const req = await fetch(backendPath + "/communities", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, details, interests: tags || [], accessToken, refreshToken })
    });
    const res: ServerResponse = await req.json();
    if (res.success) {
      if (res?.generateNewTokens) {
        localStorage.setItem("at", res.newAccessToken);
        localStorage.setItem("rt", res.newRefreshToken);
      }

      setSuccessPopup({ message: res?.message ? res?.message : "Successfully created community!", show: true });
      setTimeout(() => {
        router.push(`/communities/${res.community.title}`);
      }, 6000);
    } else {
      setErrorPopups(prevState => [...prevState, { message: res?.error || "An error occurred. Please refresh the page and try again" }]);return;
    }
  }

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

  useEffect(() => {
    auth();
  }, []);

  return (
    <>
      <Head>
        <title>ScrapBook - Create a Community</title>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

      {successPopup.show &&
        (
          <Popup
            message={successPopup.message || "Success!"}
            type={PopupType.SUCCESS}
          />
        )}
      {errorPopups.map((errorPopup, i) =>
        (
          <Popup
            key={i}
            message={errorPopup.message || "An error occurred. Please refresh the page"}
            type={PopupType.ERROR}
          />
        )
      )}

      <Sidebar categories={getSidebarPropsWithOption("Communities")} onToggle={(value) => setSidebarCollapsed(value)} />
      <Nav loggedIn={loggedIn} account={loggedIn ? account : null} /> 

      <div className={styles.createContainer} data-collapsed={sidebarCollapsed}>
        <Form 
          heading="Create a community! 📝"
          fields={[
            {
              label: "Community Name",
              placeholder: "e.g. The Amazing Musicians",
              max: 35,
              required: true
            },
            {
              label: "Community Details",
              placeholder: "i.e. What's the community about?",
              max: 512,
              required: false
            },
            {
              label: "Community Interests",
              placeholder: "i.e. What's the community interested in?",
              required: true,
              max: 255,
              onChange: (event) => { 
                const target: HTMLInputElement = event.target as any;
                const empty = !target.value || target.value == "";
                empty ? setRelatedInterests([]) : setRelatedInterests(queryLimitedInterests(target.value.toLowerCase()));
              }
            }
          ]}
          tags={[
            ...relatedInterests.map((interest, i) => (
              { 
                value: interest, 
                active: false, 
                onClick: () => {
                  setRelatedInterests([]);
                  if (!interests.includes(interest)) {
                    setInterests(prevState => [...prevState, interest]); 
                  }
                  forceUpdate();
                }
              }
            )),
            ...interests.map((interest) => (
              {
                value: interest,
                active: true,
                onRemove: () => {
                  const newInterests = interests.filter(i => i != interest);
                  setInterests(newInterests);
                  forceUpdate();
                }
              }
            ))
          ]}
          links={[
          {
            text: "Learn more about communities 🧐",
            href: "/info/communities"
          },
          {
            text: "Learn how to create communities 😮",
            href: "/info/create-a-community"
          }
        ]} 
        submitHandler={createCommunityHandler}
        />
      </div>
    </>
  );
}

export default Create;