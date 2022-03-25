import "../styles/globals.css";
import type { AppProps } from "next/app";

global.backendPath = "http://localhost:8080";
global.frontendPath = "http://localhost:3000";
global.hexToASCII = (hex: string): string => {
  let out = "";

  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex[i] + hex[i + 1], 16);
    out += String.fromCharCode(charCode);
  }

  return out;
}
global.fetchAccount = (localStorage: Storage, accessToken: string, refreshToken: string) => {
  return new Promise(async (resolve) => {
    if (!refreshToken) {
      resolve({ loggedIn: false, redirect: '/login' });
      return;
    }

    const req = await fetch(backendPath + "/auth/account", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        accessToken,
        refreshToken
      })
    });

    const res: ServerResponse = await req.json();
    console.log(res);
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      resolve({ loggedIn: true, account: res.account });
      return;
    } else {
      resolve({ loggedIn: false, redirect: '/login' });
      return;
    }
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  );
}

export default MyApp;
