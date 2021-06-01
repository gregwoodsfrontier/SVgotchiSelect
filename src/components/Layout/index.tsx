import { Header } from 'components/Header';
import styles from './styles.module.css';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <Header />
      {children}
    </div>
  )
}