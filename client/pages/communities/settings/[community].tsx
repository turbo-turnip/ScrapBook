import { NextPage } from "next";
import { useRouter } from "next/router";
import { queryInterests, queryLimitedInterests } from "../../../util/interests.util";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Alert, Form, Nav, Popup, PopupType, Post, Sidebar } from "../../../components";
import styles from "../../../styles/communities.module.css";
import { CommunityMember, CommunityType } from "../../../util/communityType.util";
import { UserType } from "../../../util/userType.util";
import { getSidebarPropsWithOption } from "../../../util/homeSidebarProps.util";

const useForceUpdate = () => {
  const [ _, setValue ] = useState(0);
  return () => setValue(value => value + 1);
}

const CommunitySettings: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<UserType | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [community, setCommunity] = useState<CommunityType | null>();
  const [communityLoading, setCommunityLoading] = useState(true);
  const [invalidCommunity, setInvalidCommunity] = useState(false);
  const [relatedInterests, setRelatedInterests] = useState<Array<string>>([]);
  const [interests, setInterests] = useState<Array<string>>([]);
  const [name, setName] = useState<null|string>();
  const [details, setDetails] = useState<null|string>();
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
  const router = useRouter();
  const forceUpdate = useForceUpdate();

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
    const title = decodeURIComponent(path.split("/")[3]);

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
      const ownerID = res.community.members.find((member: CommunityMember) => member.owner)?.userID;
      if (ownerID !== account?.id) {
        console.log(ownerID, account?.id);
        // router.push(`/communities/${res.community.title}`);
        return;
      }

      setInterests(res.community.interests.map((interest: { name: string }) => interest.name));

      return;
    }
  }

  const editCommunity = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";
    const path = new URL(window.location.href).pathname;
    const title = decodeURIComponent(path.split("/")[3]);

    const req = await fetch(backendPath + "/communities/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        accessToken, refreshToken,
        title, 
        details, name, interests
      }),
    });
    const res = await req.json();
    if (res.success) {
      setCommunity(res.community);
      setInterests(res.community.interests.map((interest: { name: string }) => interest.name));
      setSuccessPopups(prevState => [...prevState, "Successfully edited community!"]);
      setTimeout(() => router.push(`/communities/${res.community.title}`), 6500);
      return;
    } else {
      setErrorPopups(prevState => [...prevState, res?.error || "A problem occurred. Please refresh the page and try again."]);
      return;
    }
  }

  useEffect(() => {
    auth();
  }, []);

  useEffect(() => {
    if (loggedIn && account)
      fetchCommunity();
  }, [loggedIn, account]);

  return (
    <>
      <Head>
        <title>ScrapBook - Community Settings</title>

        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

      {communityLoading && <h1 className={styles.info}>Community Loading...</h1>}
      {invalidCommunity && <h1 className={styles.info}>Invalid Community!</h1>}

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

      <div className={styles.createContainer} data-collapsed={sidebarCollapsed}>
        <Form 
          heading="Edit community"
          cancelBtn={true}
          fields={[
            {
              label: "Community Name",
              placeholder: "e.g. The Edited Musicians",
              max: 35,
              required: true,
              default: community?.title || "",
              onChange: (event) => {
                const target: HTMLInputElement = event.target as any;
                if (target.value)
                  setName(target.value);
              }
            },
            {
              label: "Community Details",
              placeholder: "i.e. New community details",
              max: 512,
              required: false,
              default: community?.details || "",
              onChange: (event) => {
                const target: HTMLInputElement = event.target as any;
                if (target.value)
                  setDetails(target.value);
              }
            },
            {
              label: "Community Interests",
              placeholder: "i.e. New interests",
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
          links={[]} 
          submitHandler={() => editCommunity()}
        />
      </div>
    </>
  );
};

export default CommunitySettings;
