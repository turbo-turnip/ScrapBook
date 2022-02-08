import type { NextPage } from "next";
import { AuthForm, FieldType, Nav } from "../components";

const SignUp: NextPage = () => {
  const signUpHandler = async (inputs: Array<any>) => {
    const [name, email, password, suggestions]: Array<string> = inputs;

    const req = await fetch(backendPath + "/users", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, suggestions })
    });
    const res = await req.json();
    console.log(res);
  }

  return (
    <>
      <Nav loggedIn={false} />
      <AuthForm
        heading="Sign Up"
        submitHandler={signUpHandler}
        links={[
          { text: "Learn more about ScrapBook Suggestions 😮", href: "/suggestions" },
          { text: "Learn more about ScrapBook's User Privacy 🔒", href: "/privacy" },
          { text: "Go to home page 👈", href: "/" },
          { text: "Already have an account? Log In 📝", href: "/login" },
        ]}
        fields={[
          { label: "User Name", type: FieldType.INPUT, placeholder: "e.g. CoolUser1234", required: true },
          { label: "Email", type: FieldType.EMAIL, placeholder: "e.g. cooluser1234@example.com", required: true },
          { label: "Password", type: FieldType.PASS, placeholder: "e.g. cooluser1234@example.com", required: true },
          { label: "Opt-In To ScrapBook Suggestions", type: FieldType.CHECKBOX }
        ]}
      />
    </>
  );
};

export default SignUp;
