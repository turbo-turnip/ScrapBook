import "../styles/globals.css";
import type { AppProps } from "next/app";

global.backendPath = "http://localhost:8080";
global.hexToASCII = (hex: string): string => {
  let out = "";

  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex[i] + hex[i + 1], 16);
    out += String.fromCharCode(charCode);
  }

  return out;
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
