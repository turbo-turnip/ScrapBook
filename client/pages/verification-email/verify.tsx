import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Nav, AuthForm, FieldType } from "../../components";

const Verify: NextPage = () => {
  const router = useRouter();

  const verifyUser = async () => {
    const req = await fetch(backendPath + "/users/verify", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({

      })
    })
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

      <AuthForm heading="Verify" fields={[
        { label: "Password", placeholder: "Please enter your password", required: true, type: FieldType.PASS }
      ]} />
    </>
  );
}

export default Verify;