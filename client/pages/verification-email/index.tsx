import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Nav } from "../../components";
import styles from '../../styles/verificationEmail.module.css';
import Head from 'next/head';

const VerificationEmail: NextPage = () => {
  const router = useRouter();

  const sendEmail = async (id: string, email: string) => {
    const req = await fetch(backendPath + "/users/sendVerificationEmail", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, email })
    });
    const res: ServerResponse = await req.json();
    console.log(res);
  }

  useEffect(() => {
    const userID = localStorage.getItem("user_id") || "";
    const email = localStorage.getItem("user_email") || "";
    if (!userID || !email) {
      router.push('/login');
      return;
    }

    sendEmail(userID, email);
  }, []);
  
  return (
    <>
      <Head>

      </Head>

      <Nav loggedIn={false} />

      <h1 className={styles.heading}>Verify your email</h1>
      <p className={styles.info}>We have to make sure that the email you entered is yours!</p>
      <p className={styles.info}>We sent you an email, inside the email is a link that will verify you, so you can start using ScrapBook!</p>
      <p className={styles.info}>Please check your email</p>
    </>
  );
}

export default VerificationEmail;