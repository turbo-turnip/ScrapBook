import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { AuthForm, FieldType, Nav, Popup, PopupType } from "../components";

const SignUp: NextPage = () => {
  const [successPopup, setSuccessPopup] = useState<{ message?: string; show: boolean }>({ message: "", show: false });
  const [errorPopups, setErrorPopups] = useState<Array<{ message?: string }>>([]);
  const router = useRouter();

  const signUpHandler = async (inputs: Array<any>) => {
    const [name, email, password, suggestions]: Array<string> = inputs;

    const req = await fetch(backendPath + "/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, suggestions }),
    });

    const res: ServerResponse = await req.json();
    if (res.success) {
      setSuccessPopup({ message: res?.message || "Successfully signed up!", show: true });
      setTimeout(() => {
        localStorage.setItem("user_id", res?.id || "");
        localStorage.setItem("user_email", email);
        router.push('/verification-email');
      }, 6000);
    } else
      setErrorPopups(prevState => [...prevState, { message: res?.error }]);
  };

  return (
    <>
      <Head>
        <title>ScrapBook - Sign Up</title>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

      <Nav loggedIn={false} />

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

      <AuthForm
        heading="Sign Up"
        submitHandler={signUpHandler}
        links={[
          {
            text: "Learn more about ScrapBook Suggestions 😮",
            href: "/suggestions",
          },
          {
            text: "Learn more about ScrapBook's User Privacy 🔒",
            href: "/privacy",
          },
          { text: "Go to home page 👈", href: "/" },
          { text: "Already have an account? Log In 📝", href: "/login" },
        ]}
        fields={[
          {
            label: "User Name",
            type: FieldType.INPUT,
            placeholder: "e.g. CoolUser1234",
            required: true,
            max: 35
          },
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
          },
          {
            label: "Opt-In To ScrapBook Suggestions",
            type: FieldType.CHECKBOX,
          },
        ]}
      />
    </>
  );
};

export default SignUp;
