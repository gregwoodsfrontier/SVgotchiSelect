import Phaser from 'phaser'
//import WebFontFile from '../scenes/webFontFile'
//import { AssetType, SoundType } from "../interface/assets";
import * as KEYS from 'assets';
import { SceneKeys } from './keys';
import { getGameWidth, getGameHeight } from '../helpers'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: SceneKeys.BACKGROUND,
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
        this.tileSprite = this.add.tileSprite(getGameWidth(this) / 2, getGameHeight(this)  / 2, getGameWidth(this), getGameHeight(this), KEYS.GALAXY);
        // auto-game-over line
        this.add.rectangle(getGameWidth(this) / 2, getGameHeight(this) * 0.8, getGameWidth(this), 5, 0xff33ff, 0.25)
    }

    update()
    {
        this.tileSprite.tilePositionY -= 2
    }

}