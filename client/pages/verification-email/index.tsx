import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Nav } from "../../components";

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
      <Nav loggedIn={false} />

      <h1>Verify your email</h1>
    </>
  );
}

export default VerificationEmail;