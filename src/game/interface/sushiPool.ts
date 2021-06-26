import Phaser from "phaser"
//import { AssetType } from "./assets"
import { getGameHeight, getGameWidth } from 'game/helpers'

class Sushi extends Phaser.Physics.Arcade.Sprite
{
    hp = 1
    score = 100
    constructor(scene: Phaser.Scene, x: number, y: number, key: string,
        hp: number,
        score: number)
    {
        super(scene, x, y, key);
        this.hp = hp
        this.score = score
        this.setDisplaySize(this.displayWidth * getGameWidth(scene) / 800, this.displayHeight * getGameHeight(scene) / 600);
    }
    
}

export default class SushiPool extends Phaser.GameObjects.Group implements ISushiPool
{
    private sushiGroup: Phaser.Physics.Arcade.Group

	constructor(scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupConfig = {})
	{
		const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
			classType: Phaser.GameObjects.Image,
			maxSize: 1000
		}

		super(scene, Object.assign(defaults, config))
	}

	initializeWithSize(size: number, _key: string)
	{
		if (this.getLength() > 0 || size <= 0)
		{
			return
		}

		this.createMultiple({
			key: _key,
			quantity: size,
			visible: false,
			active: false
		})
	}

	spawn(x = 0, y = 0, key: string, hp: number, score: number)
	{
		const spawnExisting = this.countActive(false) > 0

		const sushi = new Sushi(this.scene, x, y, key, hp, score)

		if (!sushi)
		{
			return
		}

		if (spawnExisting)
		{
			//bullet.setActive(true)
			//bullet.setVisible(true)
			sushi.enableBody(false, undefined, undefined, true, true)
		}

		return sushi
	}

	despawn(sushi: Sushi)
	{
        sushi.disableBody(true, true)
		//bullet.setActive(false)
		//bullet.setVisible(false)
		//bullet.destroy()
    }
}

Phaser.GameObjects.GameObjectFactory.register('bulletPool', function () {
	// @ts-ignore
	return this.updateList.add(new bulletPool(this.scene));
});