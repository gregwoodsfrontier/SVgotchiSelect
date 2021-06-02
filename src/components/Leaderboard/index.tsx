import { useState } from 'react';
import { HighScore } from 'types';
import styles from './styles.module.css';

interface Props {
  highscores?: Array<HighScore>;
  ownedGotchis?: Array<string>;
}

export const Leaderboard = ({ highscores, ownedGotchis }: Props) => {
  const [ currentPage, setCurrentPage ] = useState(0);

  const pageTotal = 50;
  
  const getExp = (score: number, position: number) => {
    if (position <= 50) {
      return 15;
    }
    if (position <= 500) {
      return 10;
    }
    if (score > 5000) {
      return 5;
    }
    return 0;
  }

  return (
    <div className={styles.leaderboard}>
      <div className={`${styles.row} ${styles.headerRow}`}>
        <div className={styles.cell}>Aavegotchi</div>
        <div className={styles.cell}>Score</div>
        <div className={styles.cell}>Rewards</div>
      </div>
      {highscores?.slice(currentPage * pageTotal, currentPage * pageTotal + pageTotal).map((item, i) => {
        const position = i + 1 + currentPage * pageTotal;
        return (
          <div className={`${styles.row} ${ownedGotchis?.includes(item.tokenId) ? styles.owned : ''}`} key={item.tokenId}>
            <div className={styles.cell}>{position}. {item.name} [{item.tokenId}]</div>
            <div className={styles.cell}>{item.score}</div>
            <div className={styles.cell}>{getExp(item.score, position)} EXP</div>
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