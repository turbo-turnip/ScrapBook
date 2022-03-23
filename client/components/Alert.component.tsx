import { FC, useEffect, useRef } from "react";
import styles from '../styles/alert.module.css';

interface AlertProps {
  message: string;
  buttons: Array<{
    message: string;
    onClick?: () => any;
    color?: string;
  }>;
}

export const Alert: FC<AlertProps> = ({ message, buttons }) => {
  const alertRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (alertRef.current) {
        alertRef.current.style.opacity = "1";
        alertRef.current.style.transform = "translate(-50%, -50%)";
      }
    }, 500);
  }, []);

  return (
    <div className={styles.alert} ref={alertRef}>
      <h4 className={styles.message}>{message}</h4>
      <div className={styles.btns}>
        {buttons.map((btn, i) =>
          <button className={styles.btn} key={i} onClick={() => {
            if (alertRef.current) {
              const alert = alertRef.current;
              alert.style.opacity = "0";
              alert.style.transform = "translate(-50%, -80%)";
              setTimeout(() => {
                alert.style.display = "none";
              }, 500);
            }

            if (btn?.onClick)
              btn.onClick();
          }} style={{
            background: btn?.color || "var(--blue)"
          }}>
            {btn.message}
          </button>)}
      </div>
    </div>
  );
}