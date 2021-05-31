import Phaser from 'phaser';
import { IonPhaser, GameInstance } from '@ion-phaser/react';
import Scenes from './scenes';
import { useWeb3 } from 'web3';
import { Redirect } from 'react-router';

const Main = () => {
  const { state: { selectedGotchi } } = useWeb3();

  const config: GameInstance = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
      backgroundColor: '0x808080',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }
      }
    },
    scale: {
      // mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: Scenes,
    fps: {
      target: 60,
    },
    callbacks: {
      preBoot: (game) => {
        game.registry.merge({
          selectedGotchi
        });
      }, 
    }
  }

  if (!selectedGotchi) {
    return (
      <Redirect to="/" />
    )
  }

  return (
    <IonPhaser initialize={true} game={config} id="phaser-app" />
  )
}

export default Main;
