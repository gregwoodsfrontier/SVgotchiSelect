import { AssetType, SoundType } from "./assets"
import { getGameHeight, getGameWidth } from 'game/helpers';

export class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene)
    {
        super(scene, -10, -10, AssetType.Bullet);
        this.setDisplaySize(this.displayWidth * getGameWidth(scene) / 800, this.displayHeight * getGameHeight(scene) / 600);
    }

    shoot(x:number, y:number)
    {
        //this.scene.sound.play(SoundType.Shoot)
        this.setPosition(x, y);
        this.setVelocityY(-getGameHeight(this.scene) * 0.667);
    }

    kill()
    {
        this.destroy();
    }

    update()
    {
        if (this.y < -50)
        {
            this.destroy()
        }
    }
}