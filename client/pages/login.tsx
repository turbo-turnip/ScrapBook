import { NextPage } from "next";
import { Nav, AuthForm, FieldType, Popup, PopupType } from '../components';
import Head from 'next/head';
import { useRouter } from "next/router";
import { useState } from "react";

const Login: NextPage = () => {
  const [successPopup, setSuccessPopup] = useState<{ message?: string; show: boolean }>({ message: "", show: false });
  const [errorPopups, setErrorPopups] = useState<Array<{ message?: string }>>([]);
  const router = useRouter();

  const loginHandler = async (inputs: Array<any>) => {
    const [email, password]: Array<string> = inputs;

    const req = await fetch(backendPath + "/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const res: ServerResponse = await req.json();
    if (res.success) {
      localStorage.setItem("at", res?.accessToken || "");
      localStorage.setItem("rt", res?.refreshToken || "");
      setSuccessPopup({ message: "Successfully logged in", show: true  });
      setTimeout(() => {
        router.push('/home');
      }, 6000);
    } else {
      setErrorPopups(prevState => [...prevState, { message: res?.error || "An error occurred. Please refresh the page and try again" }]);
    }
  }

  return (
    <>
      <Nav loggedIn={false} />

      <Head>
        <title>ScrapBook - Login</title>
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
      {successPopup.show &&
        (
          <Popup
            message={successPopup.message || "Success!"}
            type={PopupType.SUCCESS}
          />
        )}

      <AuthForm
        heading="Login"
        submitHandler={loginHandler}
        links={[
          {
            text: "Learn more about ScrapBook's User Privacy 🔒",
            href: "/privacy",
          },
          { text: "Go to home page 👈", href: "/" },
          { text: "Don't have an account? Sign Up! 📝", href: "/signup" },
        ]}
        fields={[
          {
            label: "Email",
            type: FieldType.EMAIL,
            placeholder: "e.g. cooluser1234@example.com",
            required: true,
            max: 150
          },
          {
            label: "Password",
            type: FieldType.PASS,
            placeholder: "e.g. co0lUs3R1234!!!@",
            required: true,
            max: 512
          }
        ]}
      />
    </>
  );
}

export default Login;