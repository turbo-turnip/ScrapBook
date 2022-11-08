import { Dispatch, SetStateAction } from "react";
import { FC, useState, useEffect, useRef } from "react";
import styles from '../styles/alert.module.css';
import { queryLimitedInterests } from "../util/interests.util";
import { UserType } from "../util/userType.util";

interface InterestsPopupProps {
  currInterests: Array<string>;
  suggestions: boolean;
  updateInterests: (newInterests: Array<string>) => void;
  setAlerts: Dispatch<SetStateAction<Array<{ message: string, subheading?: string, buttons: Array<{ message: string, onClick?: () => any, color?: string }>, textArea?: { placeholder?: string}, input?: { placeholder?: string } }>>>;
  setSuccessPopups: Dispatch<SetStateAction<Array<string>>>;
  setErrorPopups: Dispatch<SetStateAction<Array<string>>>;
  setAccount: Dispatch<SetStateAction<UserType|null>>;
}

export const InterestsPopup: FC<InterestsPopupProps> = ({ currInterests, suggestions, updateInterests, setAlerts, setSuccessPopups, setErrorPopups, setAccount }) => {
  const interestsPopupRef = useRef<HTMLDivElement|null>(null);
  const [interests, setInterests] = useState<Array<string>>(currInterests);
  const [relatedInterests, setRelatedInterests] = useState<Array<string>>([]);
  const [showSuggestionsInfo, setShowSuggestionsInfo] = useState(false);

  const optUserOut = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/users/optOut", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken
      })
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken || "");
        localStorage.setItem("rt", res?.newRefreshToken || "");
      }

      setSuccessPopups(prevState => [...prevState, "Successfully opted out"]);
      setAccount(res.updatedUser);

      return;
    } else {
      setErrorPopups(prevState => [...prevState, res?.error || "An error occurred. Please refresh the page and try again 👁👄👁"]);
      return;
    }
  }

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
        {suggestions && <button className={styles.optOut} onClick={() => {
          if (interestsPopupRef.current) {
            const interestsPopup = interestsPopupRef.current;
            interestsPopup.style.opacity = "0";
            interestsPopup.style.transform = "translate(-50%, -80%)";
            setTimeout(() => {
              interestsPopup.style.display = "none";
            }, 500);
          }

          setAlerts((prevState: any) => [...prevState, {
            message: "Are you sure you want to opt out?",
            subheading: "Your interests will be deleted, and we can't make recommendations towards communities and users for you.",
            buttons: [
              { message: "I'm sure ☝️", color: "var(--blue)", onClick: () => {
                optUserOut();
              } },
              { message: "Cancel", color: "var(--orange)" }
            ]
          }]);
        }}><span>Opt out of ScrapBook Suggestions</span> <span>➡️</span></button>}
        {!suggestions && <button className={styles.info} onClick={() => setShowSuggestionsInfo(prevState => !prevState)}>{showSuggestionsInfo ? "×" : "i"}</button>}
      </h4>
      {showSuggestionsInfo && <h4>ScrapBook Suggestions recommends certain communities or people based on your interests. Opting-out is always an option.</h4>}
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