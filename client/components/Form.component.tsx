import styles from '../styles/form.module.css';
import Link from 'next/link';
import { ChangeEvent, ChangeEventHandler, FC, MouseEventHandler } from "react";

export enum FieldType {
  CHECKBOX = "checkbox",
  INPUT = "text",
  EMAIL = "email",
  PASS = "password",
  SLIDER = "range"
}

interface FormProps {
  heading?: string;
  submitHandler: (inputs: Array<any>, tags?: Array<any>) => void;
  fields: Array<{
    label?: string,
    placeholder?: string,
    max?: number,
    required?: boolean,
    type?: FieldType,
    onChange?: (event: ChangeEvent) => any
    skip?: boolean,
    default?: string
  }>;
  links: Array<{
    text: string,
    href: string
  }>;
  tags?: Array<{
    value: string,
    active: boolean,
    onClick?: (event: MouseEvent) => any,
    onRemove?: (event: MouseEvent) => any
  }>;
}

export const Form: FC<FormProps> = ({ submitHandler, heading, fields, links, tags }) => {
  return ( 
    <form className={styles.form} onSubmit={(event) => {
      event.preventDefault();

      const inputs = Array.from((event.target as HTMLFormElement).querySelectorAll("input")).map((input, i) => fields[i].type === FieldType.CHECKBOX ? input.checked : input.value);
      if (tags) {
        const tags = Array.from((event.target as HTMLFormElement).querySelectorAll(`.${styles.tags} .${styles.tag} span:not(.${styles.removeTag})`)).map((tag: any) => tag.innerHTML);
        submitHandler(inputs, tags);
      } else submitHandler(inputs);
    }}>
      {heading && <h1 className={styles.heading}>{heading}</h1>}
      {fields.map((field, i) => 
        !field?.skip ?
        <div className={styles.field} key={i}>
          <label className={styles.label}>{field.label}</label>
          <input className={styles.input} type={field.type} placeholder={field?.placeholder || ""} maxLength={field?.max || 1024} required={field?.required || false} onChange={field?.onChange ? (field.onChange as any) as ChangeEventHandler : () => {}} defaultValue={field?.default || ""} />
        </div> : null)}
      <div className={styles.tags}>
        {tags && tags?.map((tag, i) => 
          <div className={`${styles.tag} ${tag.active ? styles.activeTag : ""}`} key={i} onClick={tag?.onClick ? (tag.onClick as any) as MouseEventHandler : () => {}}>
            <span>{tag.value}</span>
            {tag.active ? <span className={styles.removeTag} onClick={tag?.onRemove ? (tag.onRemove as any) as MouseEventHandler : () => {console.log('oh')}}>&times;</span> : null}
          </div>)}
      </div>
      {links.map((link, i) =>
        <div className={styles.link} key={i}>
          <Link href={link.href}>{link.text}</Link>
        </div>)}

      <button type="submit" className={styles.submit}>Submit</button>
    </form>
  );
}