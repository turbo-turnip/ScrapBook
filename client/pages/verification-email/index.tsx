import { NextPage } from "next"
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Nav, Popup, PopupType } from "../../components";
import styles from '../../styles/verificationEmail.module.css';
import Head from 'next/head';

const VerificationEmail: NextPage = () => {
  const [successPopups, setSuccessPopups] = useState<Array<{ message?: string }>>([]);
  const [errorPopups, setErrorPopups] = useState<Array<{ message?: string }>>([]);
  const router = useRouter();

  const sendEmail = async () => {
    const id = localStorage.getItem("user_id") || "";
    const email = localStorage.getItem("user_email") || "";

    const req = await fetch(backendPath + "/users/sendVerificationEmail", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, email })
    });
    const res: ServerResponse = await req.json();
    if (res.success) {
      setSuccessPopups(prevState => [...prevState, { message: res?.message || "Verification email sent" }]);
      return;
    } else {
      setErrorPopups(prevState => [...prevState, { message: res?.error || "An error occurred sending the verification email. Please refresh the page" }]);
      return;
    }
  }

  useEffect(() => {
    const userID = localStorage.getItem("user_id") || "";
    const email = localStorage.getItem("user_email") || "";
    if (!userID || !email) {
      router.push('/login');
      return;
    }

    sendEmail();
  }, []);
  
  return (
    <>
      <Head>
        <title>ScrapBook - Verify your email</title>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

      <Nav loggedIn={false} />

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

      <h1 className={styles.heading}>Verify your email</h1>
      <p className={styles.info}>We have to make sure that the email you signed up with is yours!</p>
      <p className={styles.info}>We sent you an email, inside the email is a link that will verify you, so you can start using ScrapBook!</p>
      <p className={styles.info}>Please check your email</p>
      <button className={styles.resend} onClick={sendEmail}>Resend Verification Email</button>
    </>
  );
}

export default VerificationEmail;