import Link from "next/link";
import { FC } from "react";
import styles from '../styles/nav.module.css';

interface NavProps {
  loggedIn: boolean;
  account?: { [key: string]: any }|null;
}

export const Nav: FC<NavProps> = ({ loggedIn, account }) => {
  return (
    <nav className={styles.nav}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <img src="/logo-large.svg" alt="ScrapBook" className={styles.largeLogo} />
          <img src="/logo-small.svg" alt="ScrapBook" className={styles.smallLogo} />
        </div>

        <div className={styles.right}>
          <input type="text" placeholder="🔎 Search" className={styles.search} />
          {!loggedIn ? 
            <>
              <button className={styles.btn}>
                <Link href="/login">Login</Link>
              </button>
              <button className={styles.btn}>
                <Link href="/signup">Sign Up</Link>
              </button>
            </> :
            account && 
            <>
              <img src={account.avatar} className={styles.avatar} />
              <h4 className={styles.name}>{account.name}</h4>
            </>
          }
        </div>
      </div>
    </nav>
  );
}