import Phaser from 'phaser'
import {AssetType} from '../interface/assets'
import {ScoreManager} from '../interface/manager/scoreManager'
import blinkText from '../interface/blinkText'
import { SceneKeys } from '../consts/SceneKeys'
import { getGameWidth, getGameHeight } from "game/helpers";
import { BACK } from 'assets';

export default class GameOverScene extends Phaser.Scene
{
    scoreManager!: ScoreManager
    highscoreText!: Phaser.GameObjects.Text
    replayText!: Phaser.GameObjects.Text
    //hs = this.registry.get('highscore')
    restartGKey!: Phaser.Input.Keyboard.Key

    public back?: Phaser.Sound.BaseSound;
    backbutton: Phaser.GameObjects.Image;
    quitGame: boolean;

    create()
    {
        this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, AssetType.Galaxy);
        this.scoreManager = new ScoreManager(this);
        this.scoreManager.highscoreText.setVisible(false);
        this.scoreManager.scoreText.setVisible(false);
        this.scoreManager.livesText.setVisible(false);
        this.scoreManager.glives.setVisible(false);

        this.add.text(getGameWidth(this) / 2, getGameHeight(this) / 6, "GAME SET", {
            fontFamily: '"Press Start 2P"',
            fontSize: `30px`,
            color: "#ffffff"    
        }).setOrigin(0.5)

        this.replayText = this.add.text(getGameWidth(this) / 2, getGameHeight(this) * 0.3, "HIT D TO REPLAY", {
            fontFamily: '"Press Start 2P"',
            fontSize: `30px`,
            color: "#ffffff"    
        }).setOrigin(0.5)

        this.time.addEvent(
            {
                delay: 500,
                loop: true,
                callbackScope:this,
                callback: blinkText,
                args:[this, this.replayText, 500]
                
            }
        )

        this.highscoreText = this.add.text(getGameWidth(this) / 8, getGameHeight(this) * 0.42, `HIGH SCORE: 0`, {
            fontFamily: '"Press Start 2P"',
            fontSize: `30px`,
            color: "#ffffff"    
        })

        if (this.scoreManager.highScore !== undefined)
        {
            this.highscoreText.setText(`HIGH SCORE: ${this.scoreManager.highScore}`)
        }

        this.restartGKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        )
    }

    update()
    {
        if (Phaser.Input.Keyboard.JustDown(this.restartGKey))
        {
            this.scene.stop(SceneKeys.GameOverScene)
            let gs = this.scene.get(SceneKeys.GameScene)
            gs.scene.restart();
        }

    }

    private createBackButton = () => 
    {
        const backButton = this.add
          .image(getGameWidth(this), 0, BACK)
          .setInteractive({ useHandCursor: true })
          .setOrigin(1, 0)
          .setDisplaySize(getGameWidth(this) / 10, getGameWidth(this) / 10)
          .on('pointerdown', () => {
            this.quitGame = true;
            this.back?.play();
            window.history.back();
          });
        return backButton;
    }
}