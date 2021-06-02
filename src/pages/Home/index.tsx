import { useCallback, useEffect } from 'react';
import { Layout, GotchiSelector, DetailsPanel } from 'components';
import { Link } from "react-router-dom";
import globalStyles from 'theme/globalStyles.module.css';
import { send } from 'assets/sounds';
import styles from './styles.module.css';
import { getAavegotchisForUser } from 'web3/actions';
import { useFirebase } from 'firebase-client';
import { useWeb3 } from 'web3';
import { bounceAnimation, convertInlineSVGToBlobURL, removeBG } from 'helpers/aavegotchi';
import { Contract } from 'ethers';
import gotchiLoading from 'assets/gifs/loading.gif';
import { playSound } from 'helpers/hooks/useSound';

const Home = () => {
  const { state: { usersGotchis, contract, address, selectedGotchi }, updateState } = useWeb3();
  const { highscores } = useFirebase();

  useEffect(() => {
    const _fetchGotchis = async (contract: Contract, address: string) => {
      const res = await getAavegotchisForUser(contract, address);
      if (res.status === 200) {
        updateState({ usersGotchis: res.data });
      } else {
        console.log(res.error);
      }
    }

    if (!usersGotchis && contract && address) {
      _fetchGotchis(contract, address);
    }
  }, [usersGotchis, contract, address, updateState]);

  const handleCustomiseSvg = (svg: string) => {
    const noBg = removeBG(svg);
    const animated = bounceAnimation(noBg);
    return convertInlineSVGToBlobURL(animated);
  }

  /**
   * Updates global state with selected gotchi
   */
  const handleSelect = useCallback((gotchi) => {
    updateState({ selectedGotchi: gotchi })
  }, [updateState])

  return (
    <Layout>
      <div className={globalStyles.container}>
        <div className={styles.homeContainer}>
          <div className={styles.selectorContainer}>
            <GotchiSelector
              initialGotchi={selectedGotchi}
              gotchis={usersGotchis}
              selectGotchi={handleSelect}
            />
          </div>
          <div className={styles.gotchiContainer}>
            {selectedGotchi ? (
              <img
                src={handleCustomiseSvg(selectedGotchi.svg)}
                alt={`Selected ${selectedGotchi.name}`}
              />
            ) : (
              <img
                src={gotchiLoading}
                alt={`Loading Aavegotchi`}
              />
            )}
            <h1 className={styles.highscore}>Highscore: {highscores?.find(score => score.tokenId === selectedGotchi?.id)?.score || 0}</h1>
            <Link to="/play" className={globalStyles.primaryButton} onClick={() => playSound(send)}>
              Start
            </Link>
          </div>
          <div className={styles.detailsPanelContainer}>
            <DetailsPanel
              selectedGotchi={selectedGotchi}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home;