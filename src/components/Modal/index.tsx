import styles from './styles.module.css';
import globalStyles from 'theme/globalStyles.module.css';


interface Props {
  active: boolean;
  children: React.ReactNode;
  handleClose: () => void;
}

export const Modal = ({ active, children, handleClose }: Props) => {
  return (
    <div className={`${styles.background} ${active ? styles.open : ''}`}>
      <div className={styles.shadow}>

      </div>
      <div className={styles.panel}>
        <button
          onClick={() => handleClose()}
          className={`${globalStyles.circleButton} ${globalStyles.secondaryButton} ${styles.closeButton}`}
        >
          X
        </button>
        {children}
      </div>
    </div>
  )
}