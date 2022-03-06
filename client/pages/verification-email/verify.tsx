import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Nav, Form, FieldType, PopupType, Popup } from "../../components";


const Verify: NextPage = () => {
  const [successPopups, setSuccessPopups] = useState<Array<{ message?: string }>>([]);
  const [errorPopups, setErrorPopups] = useState<Array<{ message?: string }>>([]);
  const router = useRouter();

  const verifyUser = async (inputs: Array<any>) => {
    const address = new URL(window.location.href);
    const searchParams = new URLSearchParams(address.search);

    const req = await fetch(backendPath + "/users/verify", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: hexToASCII(searchParams.get("u") as string),
        code: hexToASCII(searchParams.get("c") as string),
        password: inputs[0]
      })
    });

    if (req.status === 304) {
      router.push('/home');
      return;
    } else {
      const res: ServerResponse = await req.json();
      if (res.success) {
        setSuccessPopups(prevState => [...prevState, { message: res?.message || "Successfully verified email" }]);
        setTimeout(() => router.push('/login'), 5500);
        return;
      } else {
        setErrorPopups(prevState => [...prevState, { message: res?.error || "An error occurred. Please refresh the page" }]);
        return;
      }
    }
  }

  useEffect(() => {
    const address = new URL(window.location.href);
    const searchParams = new URLSearchParams(address.search);
    if (!searchParams.has("u") || !searchParams.has("c")) {
      router.push('/login');
      return;
    }
  }, []);

  return (
    <>
      <Nav loggedIn={false} />

      <Head>
        <title>ScrapBook - Verify</title>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

      {errorPopups.map((errorPopup, i) =>
        (
          <Popup
            key={i}
            message={errorPopup.message || "An error occurred. Please refresh the page"}
            type={PopupType.ERROR}
          />
        )
      )}
      {successPopups.map((successPopup, i) =>
        (
          <Popup
            key={i}
            message={successPopup.message || "An error occurred. Please refresh the page"}
            type={PopupType.SUCCESS}
          />
        )
      )}

      <Form heading="Verify" fields={[
        { label: "Password", placeholder: "Please enter your password", required: true, type: FieldType.PASS, max: 512 }
      ]} links={[]} submitHandler={verifyUser} />
    </>
  );
}

export default Verify;