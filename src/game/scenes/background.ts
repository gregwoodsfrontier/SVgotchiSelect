import Phaser from 'phaser'
//import WebFontFile from '../scenes/webFontFile'
//import { AssetType, SoundType } from "../interface/assets";
import * as KEYS from 'assets';
import * as SCENEKEYS from './scenekeys';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: SCENEKEYS.BACKGROUND,
  };

export default class BackGround extends Phaser.Scene
{
    tileSprite!: Phaser.GameObjects.TileSprite

    constructor()
    {
        super(sceneConfig)
    }

    preload()
    {
        this.load.image(KEYS.GALAXY, 'images/galaxyBG.png');
        
    }

    create()
    {
        this.tileSprite = this.add.tileSprite(400, 300, 800, 600, KEYS.GALAXY);
        // auto-game-over line
        this.add.rectangle(400, 480, 800, 5, 0xff33ff, 0.25)
    }

    update()
    {
        this.tileSprite.tilePositionY -= 2
    }

}