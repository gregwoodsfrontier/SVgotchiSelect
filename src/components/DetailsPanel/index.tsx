import { AavegotchiObject } from 'types';
import styles from './styles.module.css';

interface Props {
  selectedGotchi?: AavegotchiObject;
}

export const DetailsPanel = ({ selectedGotchi }: Props) => {

  const calculatePercentage = (number: number) => {
    if (number > 100) {
      return '100%';
    }
    if (number < 0) {
      return '0';
    }
    return `${number}%`
  }

  const renderModifier = (name: string, percentage: string) => {
    return (
      <div className={styles.modifierRow}>
        <p>{name}</p>
        <div className={styles.modifierMeter}>
          <span
            className={styles.progress}
            style={{width: percentage}}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.detailsPanel}>
      <h1>{selectedGotchi ? `${selectedGotchi?.name} (${selectedGotchi?.id})` : 'Fetching Aavegotchi...'}</h1>
      <hr />
      <div className={styles.traitRow}>
        <p><span className={styles.emoji}>⚡️</span> Energy</p>
        <p>{selectedGotchi?.withSetsNumericTraits[0]}</p>
      </div>
      {renderModifier("Move speed", calculatePercentage(selectedGotchi?.withSetsNumericTraits[0]))}
      {renderModifier("Immunity timer", calculatePercentage(100 - selectedGotchi?.withSetsNumericTraits[0]))}
      <div className={styles.traitRow}>
        <p><span className={styles.emoji}>👹</span> Aggression</p>
        <p>{selectedGotchi?.withSetsNumericTraits[1]}</p>
      </div>
      {renderModifier("Fire rate", calculatePercentage(selectedGotchi?.withSetsNumericTraits[1]))}
      {renderModifier("Bullet speed", calculatePercentage(100 - selectedGotchi?.withSetsNumericTraits[1]))}
      <div className={styles.traitRow}>
        <p><span className={styles.emoji}>👻</span> Spookiness</p>
        <p>{selectedGotchi?.withSetsNumericTraits[2]}</p>
      </div>
      {renderModifier("Enemy fire rate", calculatePercentage(selectedGotchi?.withSetsNumericTraits[2]))}
      {renderModifier("Elite spawn rate", calculatePercentage(100 - selectedGotchi?.withSetsNumericTraits[2]))}
      <div className={styles.traitRow}>
        <p><span className={styles.emoji}>🧠</span> Brain size</p>
        <p>{selectedGotchi?.withSetsNumericTraits[3]}</p>
      </div>
      {renderModifier("Enemy bullet speed", calculatePercentage(selectedGotchi?.withSetsNumericTraits[3]))}
      {renderModifier("Enemy accuracy", calculatePercentage(100 - selectedGotchi?.withSetsNumericTraits[3]))}
    </div>
  )
};