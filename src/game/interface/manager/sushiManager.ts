import { Lv1Sushi, Lv2Sushi, Lv3Sushi} from "../sushi";
import { AnimationType } from "../factory/animationFactory";
import { AnimationFactory } from "../factory/animationFactory"
import { AssetType } from "../assets";
import { getGameWidth, getGameHeight } from "game/helpers";

export class SushiManager {
    scene: Phaser.Scene;
    wave1 = [
        [2,2,2,2,2],
        [1,1,1,1,1],
        [1,1,1,1,1]
    ]
    testwave1 = [
        [2,2,2,2,2],
        [2,2,2,2,2]
    ]
    animate = new AnimationFactory(this._scene)
    //sushiarmy: Phaser.Physics.Arcade.Sprite[];
    lv1sushi: Phaser.Physics.Arcade.Group;
    lv2sushi: Phaser.Physics.Arcade.Group;
    lv3sushi: Phaser.Physics.Arcade.Group;
    //sushiGroup: Phaser.Physics.Arcade.Group[];
    sushiGroupString:string[] = [
        AssetType.SushiLv1,
        AssetType.SushiLv2,
        AssetType.SushiLv3
    ]
    sushiGroupAnime:string[] = [
        AnimationType.Sushi1Fly,
        AnimationType.Sushi2Fly,
        AnimationType.Sushi3Fly
    ]

    private ORIGIN_X: number;
    private ORIGIN_Y: number;
    private dx: number;
    private dy: number;
    descend: number;
    tweenPeriod: number = 1500
    spawnTimer = this.tweenPeriod * 2
    spawnDelay = this.tweenPeriod * 2

    get noAliveSushis(): boolean {
        let noOfSushi = this.lv1sushi.getChildren().length + 
        this.lv2sushi.getChildren().length + 
        this.lv3sushi.getChildren().length

        return noOfSushi > 0 ? true: false;
    }

    constructor(private _scene: Phaser.Scene) {
        // lv1sushi add group
        this.scene = _scene;
        this.ORIGIN_X = getGameWidth(this.scene) / 8;
        this.ORIGIN_Y = getGameHeight(this.scene) / 6;
        this.dx = getGameWidth(this.scene) / 8;
        this.dy = getGameHeight(this.scene) / 10;
        this.descend = getGameHeight(this.scene) * 0.092;

        this.lv1sushi = this._scene.physics.add.group(
            {
                maxSize: 999,
                classType: Lv1Sushi,
                runChildUpdate: true
            }
        );
        
        // lv2sushi add group
        this.lv2sushi = this._scene.physics.add.group(
            {
                maxSize: 999,
                classType: Lv2Sushi,
                runChildUpdate: true
            }
        );
        
        // lv3sushi add group
        this.lv3sushi = this._scene.physics.add.group(
            {
                maxSize: 999,
                classType: Lv3Sushi,
                runChildUpdate: true
            }
        );
        //this.sushiarmy = this.sortSushiArmy(this.wave1)
        this.sortSushiArmy(this.wave1)
        this._animate()
    }
    

    // get one single random enemy
    getRandomAliveEnemy()
    {   
        const fireZoneY = getGameHeight(this.scene) * 0.5

        let livingSushi = [] as Phaser.Physics.Arcade.Sprite[]
        let sushiSet = [this.lv1sushi.getChildren(),
             this.lv2sushi.getChildren(),
             this.lv3sushi.getChildren()]
        for (let i=0; i<sushiSet.length; i++)
        {
            for (let j=0; j<sushiSet[i].length; j++)
            {
                // set a condition that only sushis on top screen can fire
                if (sushiSet[i][j].body.position.y > fireZoneY)
                {
                    continue
                }
                
                livingSushi.push(sushiSet[i][j] as Phaser.Physics.Arcade.Sprite)
            }
        }

        let random = Phaser.Math.RND.integerInRange(0, livingSushi.length - 1);
        return livingSushi[random]
    }

    reset() {
        this.sortSushiArmy(this.wave1)
        this._animate();
    }

    private spawnSushiPosX(_numSushi: number)
    {
        let xPos = [] as number[]
        // _numSushi is number of Sushi going to spawn
        for (let i = 0; i < _numSushi; i++)
        {
            xPos.push(this.ORIGIN_X + i * this.dx)
            //xPos.push(this.ORIGIN_X + i * this.dx)
        }
        return xPos
    }

    // generate that sushi army
    private sortSushiArmy(_type: number[][])
    {
        let pushedSushi: Phaser.Physics.Arcade.Sprite;
        let _sushiarmy = [];
        for (let y = 0; y < _type.length; y++)
        {
            for (let x = 0; x < _type[y].length; x++)
            {
                switch (_type[y][x])
                {
                    case 1:                  
                        pushedSushi = this.lv1sushi.create(
                            this.ORIGIN_X + x * this.dx,
                            this.ORIGIN_Y + y * this.dy, 
                            AssetType.SushiLv1, 0)
                        _sushiarmy.push(pushedSushi)
                        pushedSushi.play(AnimationType.Sushi1Fly)
                        break;

                    case 2:
                        pushedSushi = this.lv2sushi.create(
                            this.ORIGIN_X + x * this.dx,
                            this.ORIGIN_Y + y * this.dy, 
                            AssetType.SushiLv2, 0)
                        _sushiarmy.push(pushedSushi)
                        pushedSushi.play(AnimationType.Sushi2Fly)
                        break;

                    case 3:
                        pushedSushi = this.lv3sushi.create(
                            this.ORIGIN_X + x * this.dx,
                            this.ORIGIN_Y + y * this.dy, 
                            AssetType.SushiLv3, 0)
                        _sushiarmy.push(pushedSushi)
                        pushedSushi.play(AnimationType.Sushi3Fly)
                        break;
                    
                    default:
                        console.error('No such sushi')
                        break;
                }
            }
        }
        return _sushiarmy
    }

    // calling that infinity spawn of the sushi
    spawnSushi(_type: number[])
    {
        let pushedSushi: Phaser.Physics.Arcade.Sprite;
        let _sushiarmy = [];
        for (let x = 0; x < _type.length; x++)
        {
            let temp = this.spawnSushiPosX(_type.length)
            let posx = temp[x]
            switch (_type[x])
            {
                case 1:                 
                    pushedSushi = this.lv1sushi.create(posx, this.ORIGIN_Y, AssetType.SushiLv1)
                    _sushiarmy.push(pushedSushi)
                    pushedSushi.play(AnimationType.Sushi1Fly)
                    break;

                case 2:
                    pushedSushi = this.lv2sushi.create(posx, this.ORIGIN_Y, AssetType.SushiLv2)
                    _sushiarmy.push(pushedSushi)
                    pushedSushi.play(AnimationType.Sushi2Fly)
                    break;

                case 3:
                    pushedSushi = this.lv3sushi.create(posx, this.ORIGIN_Y, AssetType.SushiLv3)
                    _sushiarmy.push(pushedSushi)
                    pushedSushi.play(AnimationType.Sushi3Fly)
                    break;
                
                default:
                    console.error('No such sushi')
                    break;
            }
        }
        return _sushiarmy
    }

    makeTween(child)
    {
        this._scene.tweens.add(
            {
                targets: child,
                ease: "Linear",
                duration: this.tweenPeriod,
                x: `+=${getGameWidth(this.scene) / 4}`,
                paused: false,
                delay: 0,
                yoyo: true,
                repeat: -1,
                onYoyo: () => {
                    
                    child.y += this.descend
                }
            }
        )
        
    }   

    _animate() {
        this.lv1sushi.getChildren().forEach(element => {
            this.makeTween(element)
        });
        this.lv2sushi.getChildren().forEach(element => {
            this.makeTween(element)
        });
        this.lv3sushi.getChildren().forEach(element => {
            this.makeTween(element)
        });
        
    }

    disableAllSushis()
    {
        this.lv1sushi.clear(true, true);
        this.lv2sushi.clear(true, true);
        this.lv3sushi.clear(true, true);
    }

}