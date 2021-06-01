import { useState } from 'react';
import { HighScore } from 'types';
import styles from './styles.module.css';

interface Props {
  highscores?: Array<HighScore>
}

export const Leaderboard = ({ highscores }: Props) => {
  const [ currentPage, setCurrentPage ] = useState(0);

  const pageTotal = 50;

  return (
    <div className={styles.leaderboard}>
      <div className={`${styles.row} ${styles.headerRow}`}>
        <div className={styles.cell}>Aavegotchi</div>
        <div className={styles.cell}>Score</div>
      </div>
      {highscores?.slice(currentPage * pageTotal, currentPage * pageTotal + pageTotal).map((item, i) => {
        return (
          <div className={styles.row} key={item.tokenId}>
            <div className={styles.cell}>{i + 1 + currentPage * pageTotal}. {item.name} [{item.tokenId}]</div>
            <div className={styles.cell}>{item.score}</div>
          </div>
        )
      })}
      {highscores && highscores?.length > pageTotal &&
        <div className={styles.pageSelector}>
          {
            Array(Math.ceil(highscores.length / pageTotal)).fill(null).map((_, i) => {
              return (
                <div
                  className={`${styles.selector} ${i === currentPage ? `${styles.selected}` : ''}`}
                  onClick={() => setCurrentPage(i)}
                >
                  {i + 1}
                </div>
              )
            })
          }
        </div>
      }
    </div>
  )
}