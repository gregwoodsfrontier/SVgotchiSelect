<<<<<<< HEAD
import { removeBackground, constructSpritesheet, addIdleUp } from '../helpers/spritesheet';
import WebFontFile from './webFontFile';
import * as KEYS from 'assets';
import { AavegotchiGameObject, AavegotchiObject } from 'types';
import * as SCENEKEYS from './scenekeys'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: SCENEKEYS.BOOT,
};

/**
 * The initial scene that loads all necessary assets to the game.
 */
export class BootScene extends Phaser.Scene {
  gotchi?: AavegotchiGameObject;

  constructor() {
    super(sceneConfig);
  }

  public preload = (): void => {
    // Construct gotchi game object
    const selectedGotchi = this.game.registry.values.selectedGotchi as AavegotchiObject;
    this.gotchi = {
      ...selectedGotchi,
      spritesheetKey: "PLAYER",
    }

    // Load in images
    this.load.image(KEYS.BG, 'assets/images/bg.png');
    this.load.svg(KEYS.FULLSCREEN, 'assets/icons/fullscreen.svg');
    this.load.svg(KEYS.LEFT_CHEVRON, 'assets/icons/chevron_left.svg');
    this.load.svg(KEYS.RIGHT_CHEVRON, 'assets/icons/chevron_right.svg');

    // Load in sounds
    this.loadInSounds();

    // Load spritesheet after audio files loaded
    // Start game on spritesheet load
    this.load.on(
      'filecomplete',
      (key: string) => {
        if (key.includes(KEYS.CLICK)) {
          if (this.gotchi) {
            this.loadInGotchiSpritesheet(this.gotchi);
          }
        }
        if (this.gotchi && key.includes(this.gotchi?.spritesheetKey)) {
          this.scene.start('Game', { selectedGotchi: this.gotchi });
        }
      },
      this,
    );
    
    // my code
    const fonts = new WebFontFile(this.load, 'Press Start 2P')
    this.load.addFile(fonts)

    this.load.image(KEYS.GALAXY, '/images/galaxyBG.png');
    this.load.image(KEYS.LOGO, '/images/banner.png');
    this.load.image(KEYS.SUSHIVADER, '/images/sushi-vader-font-in.png');
    this.load.image(KEYS.PBULLET, "/images/bullet.png");
    this.load.image(KEYS.EBULLET, "/images/enemy-bullet.png");

    //sushi animations
    this.load.spritesheet(KEYS.SUSHI1, "/images/sushiLv1Sht.png", {
        frameWidth: 60,
        frameHeight: 55,
    });
    this.load.spritesheet(KEYS.SUSHI2, "/images/sushiLv2Sht.png", {
        frameWidth: 60,
        frameHeight: 55,
    });
    this.load.spritesheet(KEYS.SUSHI3, "/images/sushiLv3Sht.png", {
        frameWidth: 60,
        frameHeight: 55,
    });
    
    this.load.spritesheet(KEYS.KABOOM, "/images/explode.png", {
        frameWidth: 128,
        frameHeight: 128,
    });
    this.load.image(KEYS.GEM, "/images/gem.png")
    
    
    // my code ends here
  };

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

  private loadInSounds = () => {
    this.sound.volume = 0.25;
    this.load.audio(KEYS.BOOP, ['assets/sounds/boop.mp3']);
    this.load.audio(KEYS.CLICK, ['assets/sounds/click.mp3']);
    this.load.audio(KEYS.SHOOT, "/audio/shoot.wav");
    this.load.audio(KEYS.KABOOM, "/audio/explosion.wav");
    this.load.audio(KEYS.INVADERKILLED, "/audio/invaderkilled.wav");
    this.load.audio(KEYS.ESCAPETHEFUD, "/audio/escapethefud.wav")
  };
}
=======
import { removeBackground, constructSpritesheet, addIdleUp } from '../helpers/spritesheet';

import * as KEYS from 'assets';
import { AavegotchiGameObject, AavegotchiObject } from 'types';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Boot',
};

/**
 * The initial scene that loads all necessary assets to the game.
 */
export class BootScene extends Phaser.Scene {
  gotchi?: AavegotchiGameObject;

  constructor() {
    super(sceneConfig);
  }

  public preload = (): void => {
    // Construct gotchi game object
    const selectedGotchi = this.game.registry.values.selectedGotchi as AavegotchiObject;
    this.gotchi = {
      ...selectedGotchi,
      spritesheetKey: "PLAYER",
    }

    // Load in images
    this.load.image(KEYS.BG, 'assets/images/bg.png');
    this.load.svg(KEYS.FULLSCREEN, 'assets/icons/fullscreen.svg');
    this.load.svg(KEYS.LEFT_CHEVRON, 'assets/icons/chevron_left.svg');
    this.load.svg(KEYS.RIGHT_CHEVRON, 'assets/icons/chevron_right.svg');

    // Load in sounds
    this.loadInSounds();

    // Load spritesheet after audio files loaded
    // Start game on spritesheet load
    this.load.on(
      'filecomplete',
      (key: string) => {
        if (key.includes(KEYS.CLICK)) {
          if (this.gotchi) {
            this.loadInGotchiSpritesheet(this.gotchi);
          }
        }
        if (this.gotchi && key.includes(this.gotchi?.spritesheetKey)) {
          this.scene.start('Game', { selectedGotchi: this.gotchi });
        }
      },
      this,
    );
  };

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

  private loadInSounds = () => {
    this.load.audio(KEYS.BOOP, ['assets/sounds/boop.mp3']);
    this.load.audio(KEYS.CLICK, ['assets/sounds/click.mp3']);
  };
}
>>>>>>> 3ca44af62bf37991318ca8070c49541097633a71
