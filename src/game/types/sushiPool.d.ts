declare interface ISushiPool extends Phaser.GameObjects.Group
{
	spawn(x?: number, y?: number, key?: string, hp?: number, score?: number)
	despawn(crate: Phaser.Physics.Arcade.Image)
	initializeWithSize(size: number, key: string)
}

declare namespace Phaser.GameObjects
{
	interface GameObjectFactory
	{
		sushiPool(): ISushiPool
	}
}