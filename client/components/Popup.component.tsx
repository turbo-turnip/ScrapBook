import { FC, useEffect, useRef, useState } from "react";
import styles from "../styles/popup.module.css";

export enum PopupType {
  SUCCESS = "#0ac704",
  ERROR = "#ed3b3b",
  WARNING = "#d8db23",
}

const getMessageColor = (type: PopupType) => {
  return type === PopupType.SUCCESS
    ? "#064500"
    : type === PopupType.ERROR
    ? "#6e0000"
    : "#6e6103";
}

interface PopupProps {
  type: PopupType;
  message: string;
}

export const Popup: FC<PopupProps> = ({ type, message }) => {
  const [show, setShow] = useState(true);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
    if (show && popupRef.current)
      popupRef.current.style.transform = "translate(-50%, 0%)";
    else if (!show && popupRef.current)
      popupRef.current.style.transform = "translate(-50%, -200%)";
    }, 500);
  }, [show]);

  useEffect(() => {
    setTimeout(() => setShow(false), 5000);
  }, []);

  return (
    <div className={styles.popup} style={{ background: type }} ref={popupRef}>
      <span className={styles.message} style={{ color: getMessageColor(type) }}>{message}</span>
    </div>
  );
}
