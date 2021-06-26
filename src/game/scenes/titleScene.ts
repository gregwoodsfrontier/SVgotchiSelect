import Phaser from 'phaser'
import { SceneKeys } from '../consts/SceneKeys';
import blinkText from '../interface/blinkText'
//import WebFontFile from './webFontFile'
import { AavegotchiGameObject } from 'types';
import { getGameWidth, getGameHeight } from '../helpers'

const retro = {
    fontFamily: '"Press Start 2P"', 
    fontSize: '30px'
}

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: SceneKeys.TitleScene,
};

export default class TitleScene extends Phaser.Scene
{
    selectedGotchi?: AavegotchiGameObject;

    constructor() {
        super(sceneConfig);
    }

    init = (data: { selectedGotchi: AavegotchiGameObject }): void => {
        this.selectedGotchi = data.selectedGotchi;
    };
    
    create()
    {
        this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, 'galaxy').setDisplaySize(getGameWidth(this), getGameHeight(this));

        const logo = this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 4, 'logo');
        logo.setDisplaySize(logo.displayWidth * getGameWidth(this) * 0.4 / 800, logo.displayHeight * getGameHeight(this) * 0.4 / 600);

        const sushiVader = this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, 'sushiVader');
        sushiVader.setDisplaySize(sushiVader.displayWidth * getGameWidth(this) / 800, sushiVader.displayHeight * getGameHeight(this) / 600);

        const versionText = this.add.text(getGameWidth(this) / 2, getGameHeight(this) * 0.625, 'V3.1', retro).setOrigin(0.5, 0);
        versionText.setDisplaySize(versionText.displayWidth * getGameWidth(this) / 800, versionText.displayHeight * getGameHeight(this) / 600);


        const startText = this.add.text(getGameWidth(this) / 2, getGameHeight(this) * 0.75, 'Click to start', retro).setOrigin(0.5, 0);
        startText.setDisplaySize(startText.displayWidth * getGameWidth(this) / 800, startText.displayHeight * getGameHeight(this) / 600);

        const blinkDelay = 500;
        // blinking text
        this.time.addEvent(
            {
                delay: 500,
                loop: true,
                callbackScope:this,
                callback: blinkText,
                args:[this, startText, blinkDelay]
                
            }
        )

        /* this.input.keyboard.once('keydown-D', () =>
        {
            this.cameras.main.fadeOut(1000, 0, 0, 0)
        }) */

        this.input.on('pointerup', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0)
        })
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            (cam, effect) =>
            {
                //this.scene.start(SceneKeys.GameOverScene);
                this.scene.start(SceneKeys.GameScene, { selectedGotchi: this.selectedGotchi });
            })
    }
}
