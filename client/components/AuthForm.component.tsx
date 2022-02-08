import styles from '../styles/authform.module.css';
import Link from 'next/link';
import { FC } from "react";

export enum FieldType {
  CHECKBOX = "checkbox",
  INPUT = "text",
  EMAIL = "email",
  PASS = "password",
  SLIDER = "range"
}

interface AuthFormProps {
  heading?: string;
  submitHandler: (inputs: Array<any>) => void;
  fields: Array<{
    label: string,
    placeholder?: string,
    max?: number,
    required?: boolean,
    type: FieldType
  }>;
  links: Array<{
    text: string,
    href: string
  }>;
}

export const AuthForm: FC<AuthFormProps> = ({ submitHandler, heading, fields, links }) => {
  return (
    <form className={styles.form} onSubmit={(event) => {
      event.preventDefault();
      submitHandler(Array.from((event.target as HTMLFormElement).querySelectorAll("input")).map((input, i) => fields[i].type === FieldType.CHECKBOX ? input.checked : input.value));
    }}>
      {heading && <h1 className={styles.heading}>{heading}</h1>}
      {fields.map((field, i) => 
        <div className={styles.field} key={i}>
          <label className={styles.label}>{field.label}</label>
          <input className={styles.input} type={field.type} placeholder={field?.placeholder || ""} maxLength={field?.max || 1024} required={field?.required || false} />
        </div>)}
      {links.map((link, i) =>
        <div className={styles.link} key={i}>
          <Link href={link.href}>{link.text}</Link>
        </div>)}

      <button type="submit" className={styles.submit}>Submit</button>
    </form>
  );
}