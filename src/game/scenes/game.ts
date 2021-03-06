import { AssetType, SoundType } from "../interface/assets";
import { Bullet } from "../interface/bullet";
import { AssetManager } from "../interface/manager/assetManager";
import { SushiManager } from "../interface/manager/sushiManager";
import {
    AnimationFactory,
    AnimationType,
} from "../interface/factory/animationFactory";
import { Kaboom } from "../interface/kaboom";
import { ScoreManager } from "../interface/manager/scoreManager";
import { GameState } from "../interface/gameState";
import { SceneKeys } from "../consts/SceneKeys";
import { AavegotchiGameObject } from 'types';
import { BACK, CLICK } from 'assets';
import { getGameWidth, getGameHeight } from "game/helpers";
import Gotchi from "game/interface/gotchi";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: SceneKeys.GameScene,
  };

export class GameScene extends Phaser.Scene {
    escapeTheFud!: Phaser.Sound.BaseSound
    state!: GameState;
    gotchi!: Gotchi;
    animationFactory!: AnimationFactory
    scoreManager!: ScoreManager
    sushiManager!: SushiManager
    bulletTime = 0
    firingTimer = 0
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    fireKey!: Phaser.Input.Keyboard.Key
    restartKey!: Phaser.Input.Keyboard.Key
    debugKey!: Phaser.Input.Keyboard.Key
    isDebugActive = false

    assetManager!: AssetManager
    p: Phaser.Input.Pointer;

    public back?: Phaser.Sound.BaseSound;
    backbutton: Phaser.GameObjects.Image;
    quitGame: boolean;

    su3marker = 31

    // gotchi bullet is affected by aggressiveness
    gShootPeriod = 400 // period for gotchi bullet
    gBulletSpeed = 400 // bullet speed for gotchi

    spawnArmy = [] as Phaser.Physics.Arcade.Sprite[]
    spawnEvent!: Phaser.Time.TimerEvent

    // enemy bullet period
    fireDelay = 1500
    fireDelayModifer = 0.75
    lowFireDelay = this.fireDelay*this.fireDelayModifer

    // immune state of gotchi
    IsStar: boolean = false
    // immunity time is affected by energy NRG
    IsStarTime: number = 2000
    gotchiSpeed: number;

    // the following is affected by BRN trait
    suBullSpeed: number = 250
    suBullAngle2: number = 0.2
    suBullAngle3: number = 0.4

    //toggle autoshoot
    IsShooting: boolean = true

    //debug use
    IsShown: boolean = false
    info!: Phaser.GameObjects.Text

    // Callback data
    selectedGotchi?: AavegotchiGameObject;

    // restarting state
    restarting: boolean = false

    // poison state
    isPoison = false

    constructor() {
        super(sceneConfig);
        
    }

    init = (data: { selectedGotchi: AavegotchiGameObject }): void => {
        this.selectedGotchi = data.selectedGotchi;
    };

    create() {
        this.scene.run(SceneKeys.BackGround)
        this.scene.sendToBack(SceneKeys.BackGround)
        this.state = GameState.Playing

        this.back = this.sound.add(CLICK, { loop: false, volume:  Number(window.localStorage.getItem("seVolume") ?? "5") / 10 });
        this.backbutton = this.createBackButton();
        this.backbutton.setVisible(false);
        this.quitGame = false;

        this.animationFactory = new AnimationFactory(this)
        this.scoreManager = new ScoreManager(this)
        this.sushiManager = new SushiManager(this)
        this.assetManager = new AssetManager(this)
        
        this.escapeTheFud = this.sound.add(SoundType.EscapeTheFud, {
            loop: true,
            seek: 118,
            volume: Number(window.localStorage.getItem("musicVolume") || "5") / 10,
        })
        this.escapeTheFud.play()

        this.createGotchiPlayer();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.fireKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.restartKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        )
        this.debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)

        
        // create spawnSushi event
        this.spawnEvent = new Phaser.Time.TimerEvent(
            {
                delay: this.sushiManager.spawnTimer,
                loop: true,
                callback: () =>
                {
                    if (this.state === GameState.Playing)
                    {
                        this.spawnArmy = this.spawnSushi();
                        this.spawnArmy.forEach(child => {
                            this.sushiManager.makeTween(child)
                        })
                    }
                },
                callbackScope: this,
            }
        )

        this.time.addEvent(this.spawnEvent)

        // for debugging
        this.info = this.add.text(0, 0, '', { color: '#00ff00' } )
        this.p = this.input.activePointer;

        this.debugCall()
        this.info.setVisible(false)
    }

    update() 
    {
        this.debugCall()

        if(Phaser.Input.Keyboard.JustDown(this.debugKey))
        {
            if(!this.isDebugActive)
            {
                this.info.setVisible(true)
                this.isDebugActive = true
            }
            else
            {
                this.info.setVisible(false)
                this.isDebugActive = false
            }
            
        }


        this.input.on('keydown-K', this.debugCall)

        if (this.state !== GameState.Playing)
        {
            this.escapeTheFud.pause()
        }
        else
        {
            this.escapeTheFud.resume()
        }
        // call debug here
        //this.debugCall2();        

        //when score > 10k
        this.checkToIncreaseFireRate();

        this._shipKeyboardHandler(this.gotchi);

        if (this.time.now > this.firingTimer) {
            this._enemyFires();
        }

        if (this.IsShooting === true)
        {
            this._fireBullet();
        }

        this.setOverlapForAll();

        // only activate collider when gotchi is not immune
        if(!this.IsStar)
        {
            this.physics.collide(
                this.assetManager.enemyBullets,
                this.gotchi,
                this._enemyBulletHitGotchi,
                undefined,
                this
            );
        }
        
        // check if the sushi cross a certain line
        this.sushiCross();

        if (this.state !== GameState.Playing)
        {
            this.physics.pause();
            if ((this.restartKey.isDown || this.p.isDown) && !this.restarting)
            {
                this.restarting = true
                setTimeout(() => {
                    this.restart()
                }, 1000);
                //this.restart()
            }
            
        }       
    }

    private createGotchiPlayer()
    {
        this.gotchi = new Gotchi(this, getGameWidth(this) / 2, getGameHeight(this) * 0.875, this.selectedGotchi?.spritesheetKey as string)
        this.gotchi.setTraits(this.selectedGotchi?.withSetsNumericTraits[0] as number,
            this.selectedGotchi?.withSetsNumericTraits[1] as number,
            this.selectedGotchi?.withSetsNumericTraits[2] as number,
            this.selectedGotchi?.withSetsNumericTraits[3] as number)
        
        this.gotchi.useAGGTrait(this.gotchi.getData('agg') as number)
        this.gotchi.useNRGTrait(this.gotchi.getData('nrg') as number)
        this.useSPKTrait(this.gotchi.getData('spk') as number)
        this.useBRNTrait(this.gotchi.getData('brn') as number)
        
        this.gotchi.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers(this.selectedGotchi?.spritesheetKey || "", { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1,
        });

        this.add.existing(this.gotchi)
        
        this.gotchi.play('idle')
        this.gotchi.setInteractive();
    }

    private createBackButton = () => 
    {
        const backButton = this.add
          .image(getGameWidth(this), 0, BACK)
          .setInteractive({ useHandCursor: true })
          .setOrigin(1, 0)
          .setDisplaySize(getGameWidth(this) / 10, getGameWidth(this) / 10)
          .on('pointerdown', () => {
            this.quitGame = true;
            this.back?.play();
            window.history.back();
          });
        return backButton;
    }

    private debugCall2()
    {
        this.info.setPosition(0, 350)
        this.info.setText([
            //@ts-ignore
            'NRG trait           : '+ this.gotchi.nrg,
            'gotchi speed        : '+this.gotchi.sped,
            'isStar time         : '+this.gotchi.IsStarTime,
            //@ts-ignore
            'AGG trait           : '+ this.gotchi.agg,
            'gotchi bullet speed : '+ this.gotchi.gBulletSpeed,
            'gotchi bullet period: '+ this.gotchi.gShootPeriod,
            //@ts-ignore
            'BRN trait           : '+ this.gotchi.brn,
            'sushi  bullet speed : '+ this.suBullSpeed,
            'sushi2 bullet angle : '+ this.suBullAngle2,
            'sushi3 bullet angle : '+ this.suBullAngle3,
            //@ts-ignore
            'SPK trait: '+ this.gotchi.spk,
            'su fire delay: '+this.fireDelay,
            'sushiLv3 marker: '+this.su3marker
        ])
    }
    
    private useSPKTrait(_spk: number)
    {
        let modifier: number = 0.5
        if(_spk <= 1)
        {
            modifier = 0
        }
        else if(_spk >= 100)
        {
            modifier = 1
        }
        else
        {
            modifier = _spk/100
        }
        this.su3marker = 31 + 20* modifier     // base 41
        this.fireDelay = 1350 + 300 * modifier // base 1500
    }
    
    // use AGG to affect sushi bullet speed and angle
    private useBRNTrait(_brn: number)
    {
        let modifier: number = 1
        if(_brn <= 1)
        {
            modifier = 0
        }
        else if(_brn >= 100)
        {
            modifier = 0.2
        }
        else
        {
            modifier = (_brn/100) * 0.2
        }
        this.suBullSpeed = 0.32 * (0.9 + modifier) // spdScale
        //this.suBullSpeed = 250 * (0.9 + modifier) // base 250
        this.suBullAngle2 = 0.25 + modifier // base 0.35
        this.suBullAngle3 = 0.45 + modifier // base 0.55
    }    

    private checkToIncreaseFireRate()
    {
        if (this.scoreManager.score >= 10000 && !this.isPoison)
        {
            this.fireDelay = this.lowFireDelay
            this.scoreManager.scoreText.setTint(0xffffb3)
            
        }
    }

    // debug purpose
    private debugCall()
    {
        this.info?.setPosition(0, 410)
        this.info?.setText([
            'player Bullet used: '+this.assetManager.bullets.getTotalUsed(),
            'player Bullet free: '+this.assetManager.bullets.getTotalFree(),
            'enemy  Bullet used: '+this.assetManager.enemyBullets.getTotalUsed(),
            'enemy  Bullet free: '+this.assetManager.enemyBullets.getTotalFree(),
            'explosion     used: '+ this.assetManager.explosions.getTotalUsed(),
            'explosion     free: '+ this.assetManager.explosions.getTotalFree(),
            'lv1sushi      used: '+this.sushiManager.lv1sushi.getTotalUsed(),
            'lv1sushi      free: '+this.sushiManager.lv1sushi.getTotalFree(),
            'lv2sushi      used: '+this.sushiManager.lv2sushi.getTotalUsed(),
            'lv2sushi      free: '+this.sushiManager.lv2sushi.getTotalFree(),
            'lv3sushi      used: '+this.sushiManager.lv3sushi.getTotalUsed(),
            'lv3sushi      free: '+this.sushiManager.lv3sushi.getTotalFree(),
        ])
    }

    // When sushi crossed a certain line, insta game over
    private sushiCross()
    {
        let yline = getGameHeight(this) * 0.75;
        this.sushiManager.lv1sushi.getChildren().forEach(c => {
            const child = c as Phaser.Physics.Arcade.Sprite
            if (child.y > yline)
            {
                this.scorePoisoning(50)
                child.destroy()
                //this.callGameOver();
            }
        })
        this.sushiManager.lv2sushi.getChildren().forEach(c => {
            const child = c as Phaser.Physics.Arcade.Sprite
            if (child.y > yline)
            {
                this.scorePoisoning(100)
                child.destroy()
                //this.callGameOver();
            }
        })
        this.sushiManager.lv3sushi.getChildren().forEach(c => {
            const child = c as Phaser.Physics.Arcade.Sprite
            if (child.y > yline)
            {
                this.scorePoisoning(150)
                child.destroy()
                //this.callGameOver();
            }
        })
    }

    private scorePoisoning(score: number)
    {
        console.log('score is poisoned')
        this.isPoison = true
        this.scoreManager.decreaseScore(score)
        // set isPoison to false in this function
        this.scoreManager.setScorePoisonText()
        this.time.delayedCall(2000, () => {
            this.isPoison = false
        })
    }

    private setOverlapForAll()
    {
        this.physics.overlap(
            this.assetManager.bullets,
            this.sushiManager.lv1sushi,
            this._bulletHitSushis,
            undefined,
            this
        )

        this.physics.overlap(
            this.assetManager.bullets,
            this.sushiManager.lv2sushi,
            this._bulletHitSushis,
            undefined,
            this
        )

        this.physics.overlap(
            this.assetManager.bullets,
            this.sushiManager.lv3sushi,
            this._bulletHitSushis,
            undefined,
            this
        )

    }

    private spawnSushi()
    {
        let x: number[] = []
        let lv3marker = 21
        let lv2marker = 61
        let ans: number
        for (let i=0; i<5; i++)
        {
            let chance = Phaser.Math.RND.integerInRange(1,101);
            if (chance < lv3marker) {
                ans = 3 //spawn level 3
            }
            else if (chance >= lv3marker && chance < lv2marker)
            {
                ans = 2 // spawn level 2
            }
            else
            {
                ans = 1
            }
            x.push(ans)
        }
        var _c = this.sushiManager.spawnSushi(x)
        this.sushiManager.spawnTimer = this.time.now + this.sushiManager.spawnDelay
        return _c
    }

    private _shipKeyboardHandler(_gotchi) {
        _gotchi.body.setVelocity(0, 0)
        if (this.cursors.left.isDown || (this.p.isDown && this.p.x <= getGameWidth(this) / 2)) {
            _gotchi.body.setVelocityX(-1*this.gotchi.sped);
        } else if (this.cursors.right.isDown || (this.p.isDown && this.p.x > getGameWidth(this) / 2)) {
            _gotchi.body.setVelocityX(this.gotchi.sped);
        }
        if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
            this.IsShooting = !this.IsShooting;
        }

        this.gotchi.on('pointerup', () => {
            this.IsShooting = !this.IsShooting;
        })

    }

    private callGameOver()
    {
        this.state = GameState.GameOver;
        
        this.IsShooting = false;
        this.IsStar = false;
        
        // this func clear the bullets
        this.assetManager.clearBullets();
        this.gotchi.setActive(false)
        //this.gotchi.body.enable = false;
        this.gotchi.visible = false;
        //this.gotchi.disableBody(true, true);
        this.tweens.pauseAll();
        this.physics.pause();
        this.sushiManager.disableAllSushis();

        this.backbutton.setVisible(true);
        this.scoreManager.setHighScoreTextLose();
        
    }

    private explosionEffects(_x:number, _y:number)
    {
        let explosion: Kaboom = this.assetManager.explosions.get();
        explosion.setDisplaySize(explosion.displayWidth * getGameWidth(this) / 800, explosion.displayHeight * getGameHeight(this) / 600)
        explosion.setPosition(_x, _y)
        explosion.play(AnimationType.Kaboom)
        this.sound.play(SoundType.InvaderKilled, { volume:  Number(window.localStorage.getItem("seVolume") ?? "5") / 10 })
        this.time.delayedCall(2000,() => {
            explosion.kill()
        })
        
    }

    private _bulletHitSushis(bullet, sushi)
    {   
        this.explosionEffects(sushi.x, sushi.y)    
        bullet.destroy()
        sushi.lives -= 1
        sushi.setTint(0xff33ff, 0xffff00, 0x0000ff, 0xff0000) 
        if(sushi.lives === 0 || sushi.lives < 0)
        {
            sushi.destroy()
            this.scoreManager.increaseScore(sushi.score)
        }
        if(!this.sushiManager.noAliveSushis)
        {
            this.callGameOver();
        }
    }


    private _enemyBulletHitGotchi(_gotchi, _enemyBullet) 
    {
        let explosion: Kaboom = this.assetManager.explosions.get();
        _enemyBullet.kill();
        let live: Phaser.GameObjects.Sprite = this.scoreManager.glives.getFirstAlive();

        if (live && !this.IsStar) {
            live.setActive(false).setVisible(false);
            this.IsStar = true
            this.gotchi.setAlpha(0.5)
            this.time.delayedCall(this.gotchi.IsStarTime,() =>
                {
                    this.IsStar = false
                    this.gotchi.setAlpha(1)
                }
            )
        }

        explosion.setDisplaySize(explosion.displayWidth * getGameWidth(this) / 800, explosion.displayHeight * getGameHeight(this) / 600)
        explosion.setPosition(this.gotchi.x, this.gotchi.y);
        explosion.play(AnimationType.Kaboom);
        this.sound.play(SoundType.Kaboom, { volume:  Number(window.localStorage.getItem("seVolume") ?? "5") / 10 })
        this.time.delayedCall(2000,() => {
            explosion.kill()
        })
        
        if (this.scoreManager.noMoreLives) {
            this.callGameOver();
        }
        
    }

    private _enemyFires() 
    {

        if (!this.gotchi.active) {
            return;
        }

        let eB = [
            this.assetManager.enemyBullets.get(),
            this.assetManager.enemyBullets.get(),
            this.assetManager.enemyBullets.get()
        ]
        
        let livingSushi = this.sushiManager.getRandomAliveEnemy()
        
        if (eB[0] && livingSushi)
        {
            //@ts-ignore
            if (livingSushi.sprite === AssetType.SushiLv1)
            {
                //@ts-ignore
                livingSushi.shoot(eB[0], this.gotchi, this.suBullSpeed)
                
                
            }//@ts-ignore
            else if (livingSushi.sprite === AssetType.SushiLv2)
            {
                //@ts-ignore
                livingSushi.shoot(eB[0], eB[1], this.gotchi, this.suBullAngle2, this.suBullSpeed)
                                
            }//@ts-ignore
            else if (livingSushi.sprite === AssetType.SushiLv3)
            {
                //@ts-ignore
                livingSushi.shoot(eB[0], eB[1],  eB[2], this.gotchi, this.suBullAngle3, this.suBullSpeed)

            }

            this.firingTimer = this.time.now + this.fireDelay;
        }
    }

    private _fireBullet() {
        if (!this.gotchi.active) {
            return;
        }

        if (this.time.now > this.bulletTime) {
            let bullet: Bullet = this.assetManager.bullets.get();
            if (bullet) {
                bullet.shoot(this.gotchi.x, this.gotchi.y - 18);
                this.sound.play(SoundType.Shoot, { volume: Number(window.localStorage.getItem("seVolume") ?? "5") / 10 })
                this.bulletTime = this.time.now + 400;
            }
        }
    }

    restart() {
        if (this.quitGame)
        {
            return;
        } 

        this.state = GameState.Playing;
        this.backbutton.setVisible(false);
        this.gotchi.setActive(true);
        //this.gotchi.body.enable = true;
        this.gotchi.visible = true;
        //this.gotchi.enableBody(true, this.gotchi.x, this.gotchi.y, true, true);
        this.scoreManager.resetData();
        this.scoreManager.hideText();
        this.sushiManager.reset();
        this.assetManager.reset();
        this.spawnArmy = []
        this.tweens.resumeAll();
        this.physics.resume();
        this.time.clearPendingEvents();
        this.time.addEvent(this.spawnEvent);
        this.gotchi.setAlpha(1)
        this.IsShooting = true
        this.restarting = false
    }
}