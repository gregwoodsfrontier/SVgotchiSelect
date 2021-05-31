import { removeBackground, constructSpritesheet, addIdleUp } from '../helpers/spritesheet';
import WebFontFile from './webFontFile';
import * as KEYS from 'assets';
import { AavegotchiGameObject, AavegotchiObject } from 'types';
import {SceneKeys} from '../consts/SceneKeys'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: SceneKeys.Boot,
};

interface Asset {
  key: string,
  src: string,
  type: 'IMAGE' | 'SVG' | 'SPRITESHEET' | 'AUDIO',
  data?: {
    frameWidth?: number,
    frameHeight?: number,
  }
}

interface SpritesheetAsset extends Asset {
  type: 'SPRITESHEET',
  data: {
    frameWidth: number,
    frameHeight: number,
  }
}

const assets: Array<Asset | SpritesheetAsset> = [
  {
    key: KEYS.BG,
    src: 'assets/images/bg.png',
    type: 'IMAGE'
  },
  {
    key: KEYS.FULLSCREEN,
    src: 'assets/icons/fullscreen.svg',
    type: 'SVG',
  },
  {
    key: KEYS.LEFT_CHEVRON,
    src: 'assets/icons/chevron_left.svg',
    type: 'SVG',
  },
  {
    key: KEYS.RIGHT_CHEVRON,
    src: 'assets/icons/chevron_right.svg',
    type: 'SVG',
  },
  {
    key: KEYS.GALAXY,
    src: 'assets/images/galaxyBG.png',
    type: 'IMAGE',
  },
  {
    key: KEYS.LOGO,
    src: 'assets/images/banner.png',
    type: 'IMAGE',
  },
  {
    key: KEYS.SUSHIVADER,
    src: 'assets/images/sushi-vader-font-in.png',
    type: 'IMAGE',
  },
  {
    key: KEYS.PBULLET,
    src: 'assets/images/bullet.png',
    type: 'IMAGE',
  },
  {
    key: KEYS.EBULLET,
    src: 'assets/images/enemy-bullet.png',
    type: 'IMAGE',
  },
  {
    key: KEYS.SUSHI1,
    src: 'assets/images/sushiLv1Sht.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 60,
      frameHeight: 55,
    }
  },
  {
    key: KEYS.SUSHI2,
    src: 'assets/images/sushiLv2Sht.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 60,
      frameHeight: 55,
    }
  },
  {
    key: KEYS.SUSHI3,
    src: 'assets/images/sushiLv3Sht.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 60,
      frameHeight: 55,
    }
  },
  {
    key: KEYS.EXPLODE,
    src: 'assets/images/explode.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 128,
      frameHeight: 128,
    }
  },
  {
    key: KEYS.GEM,
    src: 'assets/images/gem.png',
    type: 'IMAGE',
  },
  {
    key: KEYS.BOOP,
    src: 'assets/sounds/boop.mp3',
    type: 'AUDIO',
  },
  {
    key: KEYS.CLICK,
    src: 'assets/sounds/click.mp3',
    type: 'AUDIO',
  },
  {
    key: KEYS.SHOOT,
    src: 'assets/sounds/shoot.wav',
    type: 'AUDIO',
  },
  {
    key: KEYS.KABOOM,
    src: 'assets/sounds/explosion.wav',
    type: 'AUDIO',
  },
  {
    key: KEYS.INVADERKILLED,
    src: 'assets/sounds/invaderkilled.wav',
    type: 'AUDIO',
  },
  {
    key: KEYS.ESCAPETHEFUD,
    src: 'assets/sounds/escapethefud.wav',
    type: 'AUDIO',
  },
]

/**
 * The initial scene that loads all necessary assets to the game.
 */
export class BootScene extends Phaser.Scene {
  gotchi?: AavegotchiGameObject;
  loadIndex: number;

  constructor() {
    super(sceneConfig);
    this.loadIndex = 0;
  }

  public preload = (): void => {
    // Construct gotchi game object
    const selectedGotchi = this.game.registry.values.selectedGotchi as AavegotchiObject;
    this.gotchi = {
      ...selectedGotchi,
      spritesheetKey: "PLAYER",
    }

    // Load spritesheet after audio files loaded
    // Start game on spritesheet load
    this.load.on(
      'filecomplete',
      (key: string) => {
        if (key === 'PLAYER') {
          this.scene.start(SceneKeys.TitleScene)
        }
        if (this.loadIndex === assets.length && this.gotchi) {
          this.loadInGotchiSpritesheet(this.gotchi)
        } else {
          this.loadNextFile(this.loadIndex);
        }
      },
      this,
    );
    
    //
    const fonts = new WebFontFile(this.load, 'Press Start 2P')
    this.load.addFile(fonts)
  };

  private loadNextFile = (index: number) => {
    const file = assets[index];
    this.loadIndex ++;

    switch (file.type) {
      case ('IMAGE'):
        this.load.image(file.key, file.src);
        break;
      case ('SVG'):
        this.load.svg(file.key, file.src);
        break;
      case ('AUDIO'):
        this.load.audio(file.key, [file.src]);
        break;
      case ('SPRITESHEET'):
        this.load.spritesheet(file.key, file.src, (file as SpritesheetAsset).data);
        break;
      default:
        break;
    }
  } 

  private loadInGotchiSpritesheet = async (gotchiObject: AavegotchiGameObject) => {
    const gotchi = {...gotchiObject};
    const svgNoBg = removeBackground(gotchi.svg);
    const spritesheet = await constructSpritesheet(svgNoBg, addIdleUp(svgNoBg));
    this.load.spritesheet(gotchi.spritesheetKey, spritesheet, {
      frameWidth: 300 / 2,
      frameHeight: 150 / 1,
    });
    this.load.start();
  };
}
