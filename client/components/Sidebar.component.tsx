import { FC, useEffect, useState } from "react";
import styles from '../styles/sidebar.module.css';

interface SidebarProps {
  categories: Array<{
    options: Array<{
      title: string;
      tooltip: string;
      emoji: string;
    }>;
    title: string;
  }>;
}

export const Sidebar: FC<SidebarProps> = ({ categories }) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    window.onresize = () => {
      setCollapsed(window.matchMedia("(max-width: 500px)").matches);
    }
  }, []);

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <span className={styles.collapse} onClick={() => setCollapsed(prevState => !prevState)}>
        {collapsed ? "⬅️" : "➡️"}
      </span>
      <div className={styles.categories}>
        {categories.map((category, ci) => 
          <div className={styles.category} key={ci}>
            <h4 className={styles.categoryTitle}>{category.title}</h4>
            {category.options.map((option, oi) => 
              <div className={styles.option} key={oi} data-selected={(ci === 0 && oi === 0)} data-tooltip={`${option.tooltip} ${option.emoji}`} data-emoji={option.emoji}>
                <p>{option.title}</p>
              </div>)}  
          </div>)}
      </div>
    </div>
  );
}