import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { LockModel, Nav } from "../components";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ScrapBook - Home</title>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>

      <Nav loggedIn={false} />

      <main className={styles.banner}>
        <div className={styles.content}>
          <div className={styles.heading}>
            <h1>Connect with others online, with privacy</h1>
          </div>

          <div className={styles.model}>
            <Canvas style={{ background: "#0000", height: "60vh" }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[0, 8, 2]} intensity={0.25} />
              <pointLight position={[0, 6, 2]} intensity={0.25} />
              <pointLight position={[0, 4, 2]} intensity={0.25} />
              <pointLight position={[0, 2, 2]} intensity={0.25} />
              <pointLight position={[0, 0, 2]} intensity={0.25} />
              <pointLight position={[0, -2, 2]} intensity={0.25} />
              <pointLight position={[1, 8, 2]} intensity={0.25} />
              <pointLight position={[1, 6, 2]} intensity={0.25} />
              <pointLight position={[1, 4, 2]} intensity={0.25} />
              <pointLight position={[1, 2, 2]} intensity={0.25} />
              <pointLight position={[1, 0, 2]} intensity={0.25} />
              <pointLight position={[1, -2, 2]} intensity={0.25} />
              <pointLight position={[2, 8, 2]} intensity={0.25} />
              <pointLight position={[2, 6, 2]} intensity={0.25} />
              <pointLight position={[2, 4, 2]} intensity={0.25} />
              <pointLight position={[2, 2, 2]} intensity={0.25} />
              <pointLight position={[2, 0, 2]} intensity={0.25} />
              <pointLight position={[2, -2, 2]} intensity={0.25} />
              <pointLight position={[-1, 8, 2]} intensity={0.075} />
              <pointLight position={[-1, 6, 2]} intensity={0.075} />
              <pointLight position={[-1, 4, 2]} intensity={0.075} />
              <pointLight position={[-1, 2, 2]} intensity={0.075} />
              <pointLight position={[-1, 0, 2]} intensity={0.075} />
              <pointLight position={[-1, -2, 2]} intensity={0.075} />
              <Suspense fallback={null}>
                <LockModel
                  rotation={[0, 30.08, 0]}
                  position={[0, -1.5, 0]}
                  scale={[1.25, 1.25, 1.25]}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* SVG wave made by https://getwaves.io/ */}
        <svg
          className={styles.wave}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgb(52, 138, 167)"
            fillOpacity="1"
            d="M0,288L16,272C32,256,64,224,96,208C128,192,160,192,192,186.7C224,181,256,171,288,181.3C320,192,352,224,384,208C416,192,448,128,480,90.7C512,53,544,43,576,69.3C608,96,640,160,672,165.3C704,171,736,117,768,117.3C800,117,832,171,864,181.3C896,192,928,160,960,170.7C992,181,1024,235,1056,213.3C1088,192,1120,96,1152,85.3C1184,75,1216,149,1248,149.3C1280,149,1312,75,1344,48C1376,21,1408,43,1424,53.3L1440,64L1440,320L1424,320C1408,320,1376,320,1344,320C1312,320,1280,320,1248,320C1216,320,1184,320,1152,320C1120,320,1088,320,1056,320C1024,320,992,320,960,320C928,320,896,320,864,320C832,320,800,320,768,320C736,320,704,320,672,320C640,320,608,320,576,320C544,320,512,320,480,320C448,320,416,320,384,320C352,320,320,320,288,320C256,320,224,320,192,320C160,320,128,320,96,320C64,320,32,320,16,320L0,320Z"
          >
          </path>
        </svg>

        <a className={styles.scroll} href="#about">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path stroke="#FF8A65" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"></path></svg>
        </a>
      </main>

      <section className={styles.section}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className={styles.topWave}
        >
          <path
            fill="rgb(52, 138, 167)"
            fillOpacity="1"
            d="M0,288L16,277.3C32,267,64,245,96,240C128,235,160,245,192,250.7C224,256,256,256,288,229.3C320,203,352,149,384,122.7C416,96,448,96,480,85.3C512,75,544,53,576,69.3C608,85,640,139,672,138.7C704,139,736,85,768,85.3C800,85,832,139,864,133.3C896,128,928,64,960,64C992,64,1024,128,1056,165.3C1088,203,1120,213,1152,208C1184,203,1216,181,1248,170.7C1280,160,1312,160,1344,176C1376,192,1408,224,1424,240L1440,256L1440,0L1424,0C1408,0,1376,0,1344,0C1312,0,1280,0,1248,0C1216,0,1184,0,1152,0C1120,0,1088,0,1056,0C1024,0,992,0,960,0C928,0,896,0,864,0C832,0,800,0,768,0C736,0,704,0,672,0C640,0,608,0,576,0C544,0,512,0,480,0C448,0,416,0,384,0C352,0,320,0,288,0C256,0,224,0,192,0C160,0,128,0,96,0C64,0,32,0,16,0L0,0Z"
          >
          </path>

        </svg>

        <div className={styles.sectionContent}>
          <h1 className={styles.sectionHeading} id="#about">About ScrapBook</h1>
          <p className={styles.sectionDescription}>ScrapBook is an online social media platform that allows you to connect with your friends and communities, from all across the platform. We've heard about the problems of data collection and other complaints from other social media platforms, and we fixed them all up, into an amazing web app for you!</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h1 className={styles.sectionHeading}>Why Us?</h1>
          <p className={styles.sectionDescription}>We're open source, and we don't collect your personal data.</p>
          <p className={styles.sectionDescription}>Although, if you want us to recommend communities and other users, opt-in to <Link href="/suggestions">ScrapBook Suggestions</Link>, where you input your interests, and we try and find users and communities that share interests with you!</p>
          <p className={styles.sectionDescription}>We encrypt all of your private information and DMs.</p>
          <p className={styles.sectionDescription}>Discover and join, or create your own communities on ScrapBook!</p>
        </div>
      </section>

      <section className={styles.signup}>
        <h1>Well, what are you waiting for?</h1>
        <p>
          ✨ <Link href="/signup">Sign Up</Link> Today! ✨
        </p>
      </section>
    </>
  );
};

export default Home;
