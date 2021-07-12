import Phaser from 'phaser'
import StateMachine from '../stateMachine/stateMachine'
import { sharedInstance as events } from './eventCenter'
import { AnimKeys, SMKeys, StateKeys } from './keys'
import { AssetType, SoundType } from "../interface/assets"
import {
    AnimationFactory,
    AnimationType,
} from "../interface/factory/animationFactory"

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

export default class SushiController
{
    private _scene: Phaser.Scene
    private sprite: Phaser.Physics.Arcade.Sprite
    private cursors: CursorKeys
	private stateMachine: StateMachine

    constructor(scene: Phaser.Scene,
        sprite: Phaser.Physics.Arcade.Sprite, 
        cursors: CursorKeys)
    {
        this._scene = scene
        this.sprite = sprite
        this.cursors = cursors
        this.stateMachine = new StateMachine(this, SMKeys.enemy)

        this.createAnimations()
        
    }

    private createAnimations()
    {
        // input for sushiLv1 animation
        this.sprite.anims.create(
            {
                key: AnimKeys.Sushi1Fly,
                frames: this.sprite.anims.generateFrameNumbers(
                    AssetType.SushiLv1,
                    {
                        start: 0,
                        end: 3
                    }),
                    frameRate: 2,
                    repeat: -1,
                    

            }
        )

        // input for sushiLv2 animation
        this._scene.anims.create(
            {
                key: AnimationType.Sushi2Fly,
                frames: this._scene.anims.generateFrameNumbers(
                    AssetType.SushiLv2,
                    {
                        start: 0,
                        end: 3
                    }),
                    frameRate: 2,
                    repeat: -1

            }
        )

        // input for sushiLv3 animation
        this._scene.anims.create(
            {
                key: AnimationType.Sushi3Fly,
                frames: this._scene.anims.generateFrameNumbers(
                    AssetType.SushiLv3,
                    {
                        start: 0,
                        end: 3
                    }),
                    frameRate: 2,
                    repeat: -1

            }
        )

        this._scene.anims.create(
            {
                key: AnimationType.Kaboom,
                frames: this._scene.anims.generateFrameNumbers(AssetType.Explode, {
                    start: 0,
                    end: 15
                }),
                frameRate: 24,
                repeat: 0,
                hideOnComplete: true
            }
        );
    }
}