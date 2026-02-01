import styles from "./styles/MobileLayout.module.css";

export default function MobileLayout({children}) {
  return <div className={styles.mobile}>{children}</div>;
}
