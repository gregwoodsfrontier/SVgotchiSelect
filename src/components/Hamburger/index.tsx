import { useState } from "react";
import { Click } from "assets/sounds";
import styles from './styles.module.css';

interface Props {
  onClick: () => void,
}

export const Hamburger = (props: Props) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    Click.play();
    setOpen(!open);
    props.onClick();
  }

  return (
    <div
      onClick={() => handleClick()}
      className={`${styles.hamburgerWrapper} ${open ? styles.open : ''}`}
    >
      <span className={styles.stroke}></span>
      <span className={styles.stroke}></span>
      <span className={styles.stroke}></span>
      <span className={styles.stroke}></span>
    </div>
  )
}
