import Phaser from 'phaser'
import StateMachine from '../stateMachine/stateMachine'
//import { sharedInstance as events } from './eventCenter'
import { SMKeys, StateKeys } from './keys'

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

export default class PlayerController
{
	private scene: Phaser.Scene
	private sprite: Phaser.Physics.Matter.Sprite
	private cursors: CursorKeys

	private stateMachine: StateMachine

    private toggleShoot: boolean = false

	constructor(scene: Phaser.Scene,
        sprite: Phaser.Physics.Matter.Sprite, 
        cursors: CursorKeys)
	{
		this.scene = scene
		this.sprite = sprite
		this.cursors = cursors

		this.createAnimations()

		this.stateMachine = new StateMachine(this, SMKeys.player)

		this.stateMachine.addState(StateKeys.idle, {
            onEnter: this.idleOnEnter,
            onUpdate: this.idleOnUpdate
        })
        .addState(StateKeys.move, {
            onEnter: this.moveOnEnter,
            onUpdate: this.moveOnUpdate
        })

        this.stateMachine.setState('idle')

		// write a collision here
	}

	update(dt: number)
	{
		this.stateMachine.update(dt)
	}

	private idleOnEnter()
	{
        // play idle gotchi animation
		
	}

	private idleOnUpdate()
	{
		if (this.cursors.left.isDown || this.cursors.right.isDown)
		{
			this.stateMachine.setState(StateKeys.move)
		}

		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
		if (spaceJustPressed)
		{
            this.toggleShoot = !this.toggleShoot
		}

        if (this.toggleShoot)
        {
            this.stateMachine.setState(StateKeys.shoot)
        }
	}

	private moveOnEnter()
	{
		
	}

	private moveOnUpdate()
	{
		const speed = 5

		if (this.cursors.left.isDown)
		{
			this.sprite.flipX = true
			this.sprite.setVelocityX(-speed)
		}
		else if (this.cursors.right.isDown)
		{
			this.sprite.flipX = false
			this.sprite.setVelocityX(speed)
		}
		else
		{
			this.sprite.setVelocityX(0)
			this.stateMachine.setState('idle')
		}

		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
		if (spaceJustPressed)
		{
			this.stateMachine.setState('jump')
		}
	}

	private deadOnEnter()
	{
		// play the game over scene
		this.scene.time.delayedCall(1500, () => {
			this.scene.scene.start('game-over')
		})
	}

	private createAnimations()
	{
        // create the animations for gotchi
	}
}
