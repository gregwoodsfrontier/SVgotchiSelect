declare interface IBulletPool extends Phaser.GameObjects.Group
{
	spawn(x?: number, y?: number, key?: string)
	despawn(crate: Phaser.Physics.Arcade.Image)
	initializeWithSize?(size: number, key?: string)
}

declare namespace Phaser.GameObjects
{
	interface GameObjectFactory
	{
		bulletPool(): IBulletPool
	}
}