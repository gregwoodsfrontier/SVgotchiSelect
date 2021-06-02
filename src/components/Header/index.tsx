import styles from './styles.module.css';
import { useState } from 'react';
import globalStyles from 'theme/globalStyles.module.css';
import { Click } from 'assets/sounds';
import { NavLink } from "react-router-dom";
import { useWeb3 } from 'web3';
import { smartTrim } from 'helpers/functions';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Hamburger, SideTray } from 'components';

const WalletButton = () => {
  const { state: { address }, connectToNetwork } = useWeb3();

  const handleWalletClick = () => {
    if (!address) {
      Click.play();
      connectToNetwork();
    }
  }

  return (
    <button className={styles.walletContainer} onClick={handleWalletClick}>
      {address
        ?
          (
            <div className={styles.walletAddress}>
              <Jazzicon diameter={24} seed={jsNumberForAddress(address)} />
              <p>
                {smartTrim(address, 8)}
              </p>
            </div>
          )
        : 'Connect'}
    </button>
  )
}

export const Header = () => {
  const [ menuOpen, setMenuOpen ] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={`${globalStyles.container} ${styles.desktopHeaderContent}`}>
        <ul className={styles.navContainer}>
          <NavLink
            onClick={() => Click.play()}
            to="/"
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
            isActive={(_, location) => {
              if(!location) return false;
              const {pathname} = location;
              return pathname === "/";
            }}>
            Game
          </NavLink>
          <NavLink
            onClick={() => Click.play()}
            to="/leaderboard"
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
          >
            Leaderboard
          </NavLink>
          {/* <NavLink
            onClick={() => Click.play()}
            to="/settings"
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
          >
            Settings
          </NavLink> */}
        </ul>
        <WalletButton />
      </nav>
      <div className={styles.mobileHeaderContent}>
        <Hamburger onClick={() => setMenuOpen(prevState => !prevState)} />
        <SideTray open={menuOpen}>
          <nav>
            <NavLink
              onClick={() => Click.play()}
              to="/"
              className={styles.navLink}
              activeClassName={styles.activeNavLink}
              isActive={(_, location) => {
                if(!location) return false;
                const {pathname} = location;
                return pathname === "/";
              }}>
              Game
            </NavLink>
            <NavLink
              onClick={() => Click.play()}
              to="/leaderboard"
              className={styles.navLink}
              activeClassName={styles.activeNavLink}
            >
              Leaderboard
            </NavLink>
            {/* <NavLink
              onClick={() => Click.play()}
              to="/settings"
              className={styles.navLink}
              activeClassName={styles.activeNavLink}
            >
              Settings
            </NavLink> */}
            <WalletButton />
          </nav>
        </SideTray>
      </div>
    </header>
  )
}