import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import styles from '../styles/sidebar.module.css';

interface SidebarProps {
  categories: Array<{
    options: Array<{
      title: string;
      tooltip: string;
      emoji: string;
      link?: string;
      selected?: boolean;
    }>;
    title: string;
  }>;
  onToggle?: (value: boolean) => void;
}

export const Sidebar: FC<SidebarProps> = ({ categories, onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.onresize = () => {
      const query = window.matchMedia("(max-width: 500px)").matches;
      setCollapsed(query);
      onToggle && onToggle(query);
    }
  }, []);

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <span className={styles.collapse} onClick={() => {
        setCollapsed(prevState => !prevState);
        onToggle && onToggle(!collapsed);
      }}>
        {collapsed ? "⬅️" : "➡️"}
      </span>
      <div className={styles.categories}>
        {categories.map((category, ci) => 
          <div className={styles.category} key={ci}>
            <h4 className={styles.categoryTitle}>{category.title}</h4>
            {category.options.map((option, oi) => 
              <div 
                className={styles.option} 
                key={oi} 
                data-selected={option.hasOwnProperty('selected') ? option.selected : (ci === 0 && oi === 0)} 
                data-tooltip={`${option.tooltip} ${option.emoji}`} 
                data-emoji={option.emoji} 
                onClick={option?.link ? () => { router.push(option?.link || "/home") } : () => {}}>
                <p>{option.title}</p>
              </div>)}  
          </div>)}
      </div>
    </div>
  );
}