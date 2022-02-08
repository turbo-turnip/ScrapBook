import "../styles/globals.css";
import type { AppProps } from "next/app";

global.backendPath = "http://localhost:8080";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
