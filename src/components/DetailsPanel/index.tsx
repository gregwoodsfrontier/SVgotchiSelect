import { AavegotchiObject } from 'types';
import styles from './styles.module.css';

interface Props {
  selectedGotchi?: AavegotchiObject;
  highscore: number;
}

export const DetailsPanel = ({ selectedGotchi, highscore }: Props) => {

  if (!selectedGotchi) return <div></div>;

  return (
    <div className={styles.detailsPanel}>
      <h1>{selectedGotchi.name} ({selectedGotchi.id})</h1>
      <hr />
      <div className={styles.traitRow}>
        <p><span className={styles.emoji}>⚡️</span> Energy</p>
        <p>{selectedGotchi.withSetsNumericTraits[0]}</p>
      </div>
      <div className={styles.traitRow}>
        <p><span className={styles.emoji}>👹</span> Aggression</p>
        <p>{selectedGotchi.withSetsNumericTraits[1]}</p>
      </div>
      <div className={styles.traitRow}>
        <p><span className={styles.emoji}>👻</span> Spookiness</p>
        <p>{selectedGotchi.withSetsNumericTraits[2]}</p>
      </div>
      <div className={styles.traitRow}>
        <p><span className={styles.emoji}>🧠</span> Brain size</p>
        <p>{selectedGotchi.withSetsNumericTraits[3]}</p>
      </div>
      <div className={styles.highscore}>
        <h1>Highscore: {highscore}</h1>
      </div>
    </div>
  )
};