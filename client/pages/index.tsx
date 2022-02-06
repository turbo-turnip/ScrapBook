import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Nav } from "../components";

const Home: NextPage = () => {
  return (
    <>
      <Nav loggedIn={false} />
    </>
  );
};

export default Home;
