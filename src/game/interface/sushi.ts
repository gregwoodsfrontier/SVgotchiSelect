import { getGameHeight, getGameWidth } from 'game/helpers'
import { AssetType, SoundType } from './assets'
import { EnemyBullet } from './enemyBullet'
import { AssetManager } from './manager/assetManager'

interface sushiTypeType
{
    maxlife: number
    lives: number,
    sprite: string,
    score: number
}

export class Lv1Sushi extends Phaser.Physics.Arcade.Sprite implements sushiTypeType 
{
    assetManger: AssetManager = new AssetManager(this.scene)
    maxlife = 1
    lives = 1
    sprite = AssetType.SushiLv1;
    score = 100

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.SushiLv1);
        this.setDisplaySize(this.displayWidth * getGameWidth(scene) / 800, this.displayHeight * getGameHeight(scene) / 600);
    }

    shoot(ebullet: EnemyBullet, target: Phaser.Physics.Arcade.Sprite, spdScale: number)
    {
        ebullet.setPosition(this.x, this.y)
        ebullet.setDisplaySize(ebullet.displayWidth * getGameWidth(this.scene) / 400, ebullet.displayHeight * getGameHeight(this.scene) / 300);
        this.scene.physics.moveToObject(ebullet, target, getGameWidth(this.scene) * spdScale)
    }

}

export class Lv2Sushi extends Phaser.Physics.Arcade.Sprite implements sushiTypeType 
{
    maxlife = 2;
    lives = 2;
    sprite = AssetType.SushiLv2;
    score = 200

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.SushiLv2);
        this.setDisplaySize(this.displayWidth * getGameWidth(scene) / 800, this.displayHeight * getGameHeight(scene) / 600);
    }

    shoot(eb0: EnemyBullet,
        eb1: EnemyBullet,
        target: Phaser.Physics.Arcade.Sprite,
        theta: number,
        spdScale: number)
    {
        let b0 = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).setLength(getGameWidth(this.scene) * spdScale)
        let b1 = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).setLength(getGameWidth(this.scene) * spdScale)
        b0.setAngle(b0.angle() + theta)
        b1.setAngle(b1.angle() - theta)

        eb0.setPosition(this.x, this.y);
        eb1.setPosition(this.x, this.y);

        eb0.setDisplaySize(eb0.displayWidth * getGameWidth(this.scene) * 3 / 800, eb0.displayHeight * getGameHeight(this.scene) * 3 / 600);
        eb1.setDisplaySize(eb1.displayWidth * getGameWidth(this.scene) * 3 / 800, eb1.displayHeight * getGameHeight(this.scene) * 3 / 600);

        // eb0.setCircle(getGameWidth(this.scene) / 200, 0 ,0);
        // eb1.setCircle(getGameWidth(this.scene) / 200, 0, 0);
        eb0.setVelocity(b0.x, b0.y)
        eb1.setVelocity(b1.x, b1.y)
    }

}

export class Lv3Sushi extends Phaser.Physics.Arcade.Sprite implements sushiTypeType 
{
    maxlife = 3
    lives = 3;
    sprite = AssetType.SushiLv3;
    score = 300

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.SushiLv3);
        this.setDisplaySize(this.displayWidth * getGameWidth(scene) / 800, this.displayHeight * getGameHeight(scene) / 600);
    }

    shoot(eb0: EnemyBullet,
        eb1: EnemyBullet,
        eb2: EnemyBullet,
        target: Phaser.Physics.Arcade.Sprite,
        theta: number,
        spdScale: number)
    {
        let b0 = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).setLength(getGameWidth(this.scene) * spdScale)
        let b1 = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).setLength(getGameWidth(this.scene) * spdScale)
        let b2 = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).setLength(getGameWidth(this.scene) * spdScale)
        b0.setAngle(b0.angle() + theta)
        b1.setAngle(b1.angle() - theta)

        eb0.setPosition(this.x, this.y);
        eb1.setPosition(this.x, this.y);
        eb2.setPosition(this.x, this.y);

        eb0.setDisplaySize(eb0.displayWidth * getGameWidth(this.scene) * 3 / 800, eb0.displayHeight * getGameHeight(this.scene) * 3 / 600);
        eb1.setDisplaySize(eb1.displayWidth * getGameWidth(this.scene) * 3 / 800, eb1.displayHeight * getGameHeight(this.scene) * 3 / 600);
        eb2.setDisplaySize(eb2.displayWidth * getGameWidth(this.scene) * 3 / 800, eb2.displayHeight * getGameHeight(this.scene) * 3 / 600);

        // eb0.setCircle(eb0.displayHeight / 2, eb0.displayHeight / 2, eb0.displayHeight / 2);
        // eb1.setCircle(this.scale * getGameWidth(this.scene) / 200, 0, 0);
        // eb2.setCircle(this.scale * getGameWidth(this.scene) / 200, 0, 0);

        eb0.setVelocity(b0.x, b0.y)
        eb1.setVelocity(b1.x, b1.y)
        eb2.setVelocity(b2.x, b2.y)
    }
}

