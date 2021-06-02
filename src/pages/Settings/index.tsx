import { Layout } from 'components/Layout';
import { useState } from 'react';
import styles from './styles.module.css';
import { playSound } from 'helpers/hooks/useSound';
import { click } from 'assets/sounds';

const Settings = () => {
  const [ volume, setVolume ] = useState('');

  const handleVolumeChange = () => {
    window.localStorage.setItem("volume", volume);
    playSound(click);
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.inputContainer}>
          <label htmlFor="volume">Volume</label>
          <input
            type="range"
            id="volume"
            name="volume"
            min="0"
            max="10"
            step="1"
            onChange={(e) => setVolume(e.target.value)}
            onClick={handleVolumeChange}
          />
        </div>
      </div>
    </Layout>
  )
}

export default Settings;