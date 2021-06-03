import { useCallback, useEffect, useState } from "react";
import { Layout, GotchiSelector, DetailsPanel, Modal } from "components";
import { Link } from "react-router-dom";
import globalStyles from "theme/globalStyles.module.css";
import { click, send } from "assets/sounds";
import styles from "./styles.module.css";
import { getAavegotchisForUser } from "web3/actions";
import { useFirebase } from "firebase-client";
import { useWeb3 } from "web3";
import {
  bounceAnimation,
  convertInlineSVGToBlobURL,
  removeBG,
} from "helpers/aavegotchi";
import { Contract } from "ethers";
import gotchiLoading from "assets/gifs/loading.gif";
import { playSound } from "helpers/hooks/useSound";
import { Web3Error } from "types";

import orangeSushi from "assets/images/orangeSushi.png";
import purpleSushi from "assets/images/purpleSushi.png";
import yellowSushi from "assets/images/yellowSushi.png";

const Home = () => {
  const {
    state: { usersGotchis, contract, address, selectedGotchi },
    updateState,
  } = useWeb3();
  const { highscores } = useFirebase();
  const [error, setError] = useState<Web3Error>();
  const [showRulesModal, setShowRulesModal] = useState(false);

  useEffect(() => {
    const _fetchGotchis = async (contract: Contract, address: string) => {
      const res = await getAavegotchisForUser(contract, address);
      if (res.status === 200) {
        setError(undefined);
        updateState({ usersGotchis: res.data });
      } else {
        setError(res);
      }
    };

    if (!usersGotchis && contract && address) {
      _fetchGotchis(contract, address);
    }
  }, [usersGotchis, contract, address, updateState]);

  const handleCustomiseSvg = (svg: string) => {
    const noBg = removeBG(svg);
    const animated = bounceAnimation(noBg);
    return convertInlineSVGToBlobURL(animated);
  };

  /**
   * Updates global state with selected gotchi
   */
  const handleSelect = useCallback(
    (gotchi) => {
      updateState({ selectedGotchi: gotchi });
    },
    [updateState]
  );

  if (error) {
    return (
      <Layout>
        <div className={globalStyles.container}>
          <div className={styles.errorContainer}>
            <h1>Error code: {error.status}</h1>
            <p>{error.error.message}</p>
            {error.status === 403 && (
              <div>
                <p className={styles.secondaryErrorMessage}>
                  Don’t have an Aavegotchi? Visit the Baazaar to get one.
                </p>
                <a
                  href="https://aavegotchi.com/baazaar/portals-closed?sort=latest"
                  target="__blank"
                  className={globalStyles.primaryButton}
                >
                  Visit Bazaar
                </a>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Modal
        active={showRulesModal}
        handleClose={() => setShowRulesModal(false)}
      >
        <div className={styles.modalContent}>
          <h1>Sushi Vader</h1>
          <p>
            The Reaalms Sushi’s have turned against their masters. It’s up to
            you blast away the Sushi Swarm and restore peace to the Reaalm.
          </p>
          <h2>Rules</h2>
          <p>
            Your gotchi has 3 lives. The game is over once all 3 lives have
            depleted or the Sushis pass the safety line.
          </p>
          <p>
            Once your score surpasses 10,000, the sushi armies fire rate
            increases.
          </p>
          <h2>Enemies</h2>
          <div className={styles.enemyRow}>
            <img src={orangeSushi} alt="Orange sushi" />
            <div>
              <h3>Orange Sushi</h3>
              <p>1 Life</p>
              <p>Fires 1 shot</p>
            </div>
          </div>
          <div className={styles.enemyRow}>
            <img src={purpleSushi} alt="Purple sushi" />
            <div>
              <h3>Purple Sushi</h3>
              <p>2 Lives</p>
              <p>Fires a 2 shot spread (Spread decreased by Accuracy)</p>
            </div>
          </div>
          <div className={styles.enemyRow}>
            <img src={yellowSushi} alt="Yellow sushi" />
            <div>
              <h3>Yellow Sushi (Elite)</h3>
              <p>3 Lives</p>
              <p>Fires a 3 shot spread (Spread decreased by Accuracy)</p>
            </div>
          </div>
        </div>
      </Modal>
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
              <img src={gotchiLoading} alt={`Loading Aavegotchi`} />
            )}
            <h1 className={styles.highscore}>
              Highscore:{" "}
              {highscores?.find((score) => score.tokenId === selectedGotchi?.id)
                ?.score || 0}
            </h1>
            <div className={styles.buttonContainer}>
              <Link
                to="/play"
                className={`${globalStyles.primaryButton} ${
                  !selectedGotchi ? globalStyles.disabledLink : ""
                }`}
                onClick={() => playSound(send)}
              >
                Start
              </Link>
              <button
                onClick={() => {
                  playSound(click);
                  setShowRulesModal(true);
                }}
                className={`${globalStyles.primaryButton} ${globalStyles.circleButton}`}
              >
                ?
              </button>
            </div>
          </div>
          <div className={styles.detailsPanelContainer}>
            <DetailsPanel selectedGotchi={selectedGotchi} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
