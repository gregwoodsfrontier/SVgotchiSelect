import Phaser from 'phaser'
import { AssetType } from "./assets"
import { getGameHeight, getGameWidth } from 'game/helpers';

class Bullet extends Phaser.Physics.Arcade.Image
{
    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.Bullet);
        this.setDisplaySize(
			this.displayWidth * getGameWidth(scene) / 800, 
			this.displayHeight * getGameHeight(scene) / 600
		);
    }
}

class EnemyBullet extends Phaser.Physics.Arcade.Image
{
    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.EnemyBullet);
    }
}

export default class BulletPool extends Phaser.GameObjects.Group implements IBulletPool
{
    private bullets: Phaser.Physics.Arcade.Group

	constructor(scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupConfig = {})
	{
		const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
			classType: Phaser.GameObjects.Image,
			maxSize: 1000
		}

		super(scene, Object.assign(defaults, config))
	}

	initializeWithSize(size: number)
	{
		if (this.getLength() > 0 || size <= 0)
		{
			return
		}

		this.createMultiple({
			key: AssetType.Bullet,
			quantity: size,
			visible: false,
			active: false
		})
	}

	spawn(x = 0, y = 0)
	{
		const spawnExisting = this.countActive(false) > 0

		const bullet = new Bullet(this.scene, x, y)

		if (!bullet)
		{
			return
		}

		if (spawnExisting)
		{
			//bullet.setActive(true)
			//bullet.setVisible(true)
			bullet.enableBody(false, undefined, undefined, true, true)
		}

		return bullet
	}

	despawn(bullet: Bullet)
	{
        bullet.disableBody(true, true)
		//bullet.setActive(false)
		//bullet.setVisible(false)
		//bullet.destroy()
    }
}

Phaser.GameObjects.GameObjectFactory.register('bulletPool', function () {
	// @ts-ignore
	return this.updateList.add(new bulletPool(this.scene));
});
