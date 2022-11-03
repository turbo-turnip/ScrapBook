import { FC, useEffect, useRef } from "react";
import styles from '../styles/alert.module.css';

interface AlertProps {
  message: string;
  subheading?: string;
  input?: { placeholder?: string; };
  textArea?: { placeholder?: string; value?: string; };
  buttons: Array<{
    message: string;
    onClickInput?: (input: string) => any;
    onClickTextarea?: (input: string) => any;
    onClick?: () => any;
    color?: string;
  }>;
}

export const Alert: FC<AlertProps> = ({ message, input, textArea, buttons, subheading }) => {
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
      {subheading && <p className={styles.subheading}>{subheading || ""}</p>}
      {input && <input className={styles.input} placeholder={input?.placeholder || ""} />}
      {textArea && <textarea className={styles.textArea} placeholder={textArea?.placeholder || ""} defaultValue={textArea?.value || ""}></textarea>}
      <div className={styles.btns}>
        {buttons.map((btn, i) =>
          <button className={styles.btn} key={i} onClick={(event) => {
            if (alertRef.current) {
              const alert = alertRef.current;
              alert.style.opacity = "0";
              alert.style.transform = "translate(-50%, -80%)";
              setTimeout(() => {
                alert.style.display = "none";
              }, 500);
            }

            if (textArea && btn?.onClickTextarea)
              btn.onClickTextarea(((event.target as HTMLButtonElement)?.parentElement?.previousElementSibling as HTMLTextAreaElement)?.value || "");
            else if (input && btn?.onClickInput)
              btn.onClickInput(((event.target as HTMLButtonElement)?.parentElement?.previousElementSibling as HTMLInputElement)?.value || "");
            else if (btn?.onClick) btn.onClick();
          }} style={{
            background: btn?.color || "var(--blue)"
          }}>
            {btn.message}
          </button>)}
      </div>
    </div>
  );
}