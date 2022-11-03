import { FC, useState, useEffect, useRef } from "react";
import styles from '../styles/alert.module.css';
import { queryInterests, queryLimitedInterests } from "../util/interests.util";

interface InterestsPopupProps {
  currInterests: Array<string>;
  suggestions: boolean;
  updateInterests: (newInterests: Array<string>) => void;
}

export const InterestsPopup: FC<InterestsPopupProps> = ({ currInterests, suggestions, updateInterests }) => {
  const interestsPopupRef = useRef<HTMLDivElement|null>(null);
  const [interests, setInterests] = useState<Array<string>>(currInterests);
  const [relatedInterests, setRelatedInterests] = useState<Array<string>>([]);

  const onInterestInput = (input: string) => {
    const relatedInterests = queryLimitedInterests(input.toLowerCase()).slice(0, 6);
    const filtered = relatedInterests.filter(interest => !interests.includes(interest));

    if (input != "") setRelatedInterests(filtered);
    else setRelatedInterests([]);
  }

  useEffect(() => {
    setTimeout(() => {
      if (interestsPopupRef.current) {
        interestsPopupRef.current.style.opacity = "1";
        interestsPopupRef.current.style.transform = "translate(-50%, -50%)";
      }
    }, 500);
  }, []);

  return (
    <div className={styles.alert} ref={interestsPopupRef}>
      <h4 className={styles.message}>
        Update interests
        {suggestions && <button className={styles.optOut}><span>Opt out of ScrapBook Suggestions</span> <span>➡️</span></button>}
        {!suggestions && <button className={styles.info}>i</button>}
      </h4>
      <div className={styles.subheading}>
        {interests.map((interest, i) =>
          <div className={styles.interest} key={i}>{interest} <span onClick={() => {
            setInterests(prevState => prevState.filter(int => int !== interest));
            setRelatedInterests([]);
          }}>&times;</span></div>)}
        {relatedInterests.map((interest, i) =>
          <div className={styles.relatedInterest} key={i}>{interest} <span onClick={() => {
            setInterests(prevState => [...prevState, interest]);
            setRelatedInterests([]);
          }}>&#43;</span></div>)}
      </div>
      <input className={styles.input} onInput={(e) => onInterestInput((e.target as HTMLInputElement).value)} placeholder="e.g. Hobbies, occupations, etc." />
      <div className={styles.btns}>
        <button className={styles.btn} style={{ background: "var(--blue)" }} onClick={(event) => {
          if (interestsPopupRef.current) {
            const interestsPopup = interestsPopupRef.current;
            interestsPopup.style.opacity = "0";
            interestsPopup.style.transform = "translate(-50%, -80%)";
            setTimeout(() => {
              interestsPopup.style.display = "none";
            }, 500);
          }

          updateInterests(interests);
        }}>
          Update
        </button>
        <button className={styles.btn} style={{ background: "var(--orange)" }} onClick={(event) => {
          if (interestsPopupRef.current) {
            const interestsPopup = interestsPopupRef.current;
            interestsPopup.style.opacity = "0";
            interestsPopup.style.transform = "translate(-50%, -80%)";
            setTimeout(() => {
              interestsPopup.style.display = "none";
            }, 500);
          }
        }}>
          Cancel
        </button>
      </div>
    </div>
  );
}