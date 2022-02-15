import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Nav, AuthForm, FieldType } from "../../components";


const Verify: NextPage = () => {
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
        username: searchParams.get("u"),
        code: searchParams.get("c")
      })
    });
    const res: ServerResponse = await req.json();
    console.log(res);
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
      ]} links={[]} submitHandler={verifyUser} />
    </>
  );
}

export default Verify;