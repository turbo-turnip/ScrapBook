import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { Form, FieldType, Nav, Popup, PopupType } from "../components";
import { queryLimitedInterests } from "../util/interests.util";

const useForceUpdate = () => {
  const [ _, setValue ] = useState(0);
  return () => setValue(value => value + 1);
}

const SignUp: NextPage = () => {
  const [successPopup, setSuccessPopup] = useState<{ message?: string; show: boolean }>({ message: "", show: false });
  const [errorPopups, setErrorPopups] = useState<Array<{ message?: string }>>([]);
  const [showInterests, setShowInterests] = useState(false);
  const [relatedInterests, setRelatedInterests] = useState<Array<string>>([]);
  const [interests, setInterests] = useState<Array<string>>([]);
  const forceUpdate = useForceUpdate();
  const router = useRouter();

  const signUpHandler = async (inputs: Array<any>, tags?: Array<any>) => {
    const [name, email, password, suggestions]: Array<string> = inputs;

    const req = await fetch(backendPath + "/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, suggestions, interests: tags ? tags : [] }),
    });

    const res: ServerResponse = await req.json();
    if (res.success) {
      localStorage.setItem("user_id", res?.id || "");
      localStorage.setItem("user_email", email);

      setSuccessPopup({ message: res?.message || "Successfully signed up!", show: true });
      setTimeout(() => {
        router.push('/verification-email');
      }, 6000);
    } else
      setErrorPopups(prevState => [...prevState, { message: res?.error }]);
  }

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

      <Form
        heading="Sign Up"
        submitHandler={signUpHandler}
        links={[
          {
            text: "Learn more about ScrapBook Suggestions 😮",
            href: "/info/suggestions",
          },
          {
            text: "Learn more about ScrapBook's User Privacy 🔒",
            href: "/info/privacy",
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
            onChange: (event) => { 
              const target: HTMLInputElement = event.target as any;
              setShowInterests(target.checked);
            }
          },
          showInterests ?
          {
            label: "What are you interested in?",
            type: FieldType.INPUT,
            placeholder: "Enter a hobby/interest you have",
            max: 255,
            onChange: (event) => { 
              const target: HTMLInputElement = event.target as any;
              const empty = !target.value || target.value == "";
              empty ? setRelatedInterests([]) : setRelatedInterests(queryLimitedInterests(target.value.toLowerCase()));
            }
          } : { skip: true }
        ]}
        tags={(showInterests) ? 
          [
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
          ] : []}
      />
    </>
  );
};

export default SignUp;
