import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Nav, LockModel } from "../components";
import { Canvas } from '@react-three/fiber';
import { Suspense } from "react";

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
            <h1>
              <span>Connect</span> <span>Online,</span> <span>with</span>{" "}
              <span>Privacy</span>
            </h1>
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
                <LockModel rotation={[0, 30.08, 0]} position={[0, -1.5, 0]} scale={[1.25, 1.25, 1.25]} />
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
      </main>
    </>
  );
};

export default Home;
