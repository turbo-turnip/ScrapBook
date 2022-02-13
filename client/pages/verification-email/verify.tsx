import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Nav } from "../../components";

const Verify: NextPage = () => {
  const router = useRouter();

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
    </>
  );
}

export default Verify;