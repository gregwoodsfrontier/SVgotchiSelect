<<<<<<< HEAD
import { AssetType, SoundType } from "./assets"

export class Bullet extends Phaser.Physics.Arcade.Sprite
{
    
    constructor(scene: Phaser.Scene)
    {
        super(scene, -10, -10, AssetType.Bullet);
    }

    shoot(x:number, y:number, _speed: number)
    {
        //this.scene.sound.play(SoundType.Shoot)
        this.setPosition(x, y);
        this.setVelocityY(-1*_speed);
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
=======
import { AssetType, SoundType } from "./assets"

export class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene)
    {
        super(scene, -10, -10, AssetType.Bullet);
    }

    shoot(x:number, y:number)
    {
        //this.scene.sound.play(SoundType.Shoot)
        this.setPosition(x, y);
        this.setVelocityY(-400);
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
>>>>>>> 3ca44af62bf37991318ca8070c49541097633a71
}