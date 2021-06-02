import { AssetType } from "./assets"
import { getGameHeight } from 'game/helpers';


export class EnemyBullet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene)
    {
        super(scene, 0, 0, AssetType.EnemyBullet);
        //this.setScale(1.5)
    }

    kill()
    {
        this.destroy();
    }

    update()
    {
        if(this.y > getGameHeight(this.scene) * 1.1)
        {
            this.destroy()
        }
    }
}