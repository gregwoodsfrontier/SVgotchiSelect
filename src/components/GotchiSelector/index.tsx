import { AavegotchiObject } from 'types';
import { ChevronUp, ChevronDown } from 'assets/icons';
import { click } from 'assets/sounds';
import { convertInlineSVGToBlobURL } from 'helpers/aavegotchi';
import { playSound } from 'helpers/hooks/useSound';
import styles from './styles.module.css';
import globalStyles from 'theme/globalStyles.module.css';
import { useEffect, useState, useCallback } from 'react';
import gotchiLoading from 'assets/gifs/loading.gif';
import useWindowWidth from "helpers/hooks/windowSize";

interface Props {
  /**
   * Array of gotchis to select from
   */
  gotchis?: Array<AavegotchiObject>;
  /**
   * Gotchi to initially select
   */
  initialGotchi?: AavegotchiObject;
  /**
   * Maximum gotchis visible in selector per scroll
   */
   maxVisible?: number;
  /**
   * Callback function that triggers on gotchi select
   * @param {AavegotchiObject} gotchi - Aavegotchi selected
   */
  selectGotchi: (gotchi: AavegotchiObject) => void;
}

export const GotchiSelector = ({ gotchis, selectGotchi, initialGotchi, maxVisible = 3 }: Props) => {
  const [selected, setSelected] = useState<number>();
  const [currentIteration, setCurrentIteration] = useState(0);

  /**
   * Maximum amount of times you can scroll down
   */
  const maxIterations = gotchis ? gotchis.length - maxVisible < 0 ? 0 : gotchis.length - maxVisible : 0;
  const width = useWindowWidth();
  const isMobile = width < 768;

  const handleSelect = useCallback((index: number) => {
    if (index === selected) return;
  
    setSelected(index);
    if (gotchis) {
      selectGotchi(gotchis[index]);
    }
  }, [gotchis, selectGotchi, selected]);

  const handleScroll = (i: number) => {
    console.log(i);
    const nextIteration = currentIteration + i;
    if (nextIteration > maxIterations || nextIteration < 0) return;

    playSound(click);
    setCurrentIteration(nextIteration);
  }

  useEffect(() => {
    if (gotchis) {
      const index = initialGotchi ? gotchis.findIndex(gotchi => gotchi.id === initialGotchi.id) || 0 : 0;
      handleSelect(index);
      const selectorIteration = index + 1 - maxVisible < 0 ? 0 : index + 1 - maxVisible;
      setCurrentIteration(selectorIteration)
    }
  }, [gotchis, initialGotchi, handleSelect, maxVisible]);

  return (
    <div className={styles.selectorContainer}>
      <ChevronUp
        width={24}
        className={`${styles.chevron} ${styles.up} ${currentIteration === 0 ? styles.disabled : styles.enabled}`}
        onClick={() => handleScroll(-1)}
      />
      <div className={styles.selectorWrapper} style={isMobile ? {width: `${maxVisible * 7.2 + 1.6}rem`} : {height: `${maxVisible * 8.8}rem`}}>
        <div className={styles.selector} style={isMobile ? {transform: `translateX(-${currentIteration * 8}rem)`} : {transform: `translateY(-${currentIteration * (9.6)}rem)`}}>
          {
            gotchis === undefined
              ? new Array(3).fill('').map((_, i) => {
                  return (
                    <div className={styles.loadingContainer} key={i}>
                      <img src={gotchiLoading} alt={`Loading gotchi ${i}`} />
                    </div>
                  )
                })
              : gotchis?.map((gotchi, i) => {
              const isSelected = selected === i;
              return(
                <div
                  className={`${styles.gotchiContainer} ${isSelected ? `${styles.selected} ${globalStyles.glow}` : ''}`}
                  key={i}
                  onClick={() => {
                    playSound(click);
                    handleSelect(i);
                  }}
                >
                  <img src={convertInlineSVGToBlobURL(gotchi.svg)} alt={gotchi.name} />
                </div>
              )
            })
          }
        </div>
      </div>
      <ChevronDown
        width={24}
        className={`${styles.chevron} ${styles.down} ${currentIteration === maxIterations ? styles.disabled : styles.enabled}`}
        onClick={() => handleScroll(1)}
      />
    </div>
  )
}