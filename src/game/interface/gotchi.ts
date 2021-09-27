import { getGameHeight, getGameWidth } from 'game/helpers';

export default class Gotchi extends Phaser.GameObjects.Sprite
{
    nrg: number = 50 //energy
    agg: number = 50 //aggressive
    spk: number = 50 //spooky
    brn: number = 50//brian

    gShootPeriod = 400 // period for gotchi bullet
    gBulletSpeed = 400 // bullet speed for gotchi
    IsStarTime: number = 2000
    sped = 0.3125 * getGameWidth(this.scene);

    constructor(scene:Phaser.Scene, x: number, y: number, key: string)
    {
        super(scene, x, y, key);
        this.scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true)
        .setSize(80, 100);
        const widthG = this.displayHeight * getGameHeight(scene) / 1200
        const heightG = this.displayHeight * getGameHeight(scene) / 1200
        this.setDisplaySize(widthG, heightG);
        (this.body as Phaser.Physics.Arcade.Body).setSize(widthG * 0.55, heightG*0.75)
    }
    
    kill()
    {
        this.destroy()
    }

    public setTraits(_nrg: number, _agg: number,
         _spk: number, _brn: number)
    {
        this.setData('nrg', _nrg)
        this.setData('agg', _agg)
        this.setData('spk', _spk)
        this.setData('brn', _brn)
    }

    // use AGG to affect gotchi bullet rate and speed
    public useAGGTrait(_agg: number)
    {
        let modifier: number = 1
        if(_agg <= 1)
        {
            modifier = 0.01
        }
        else if(_agg >= 100)
        {
            modifier = 1
        }
        else
        {
            modifier = _agg/100
        }
        this.gBulletSpeed = 320 + (modifier*80*2) // base: 400
        this.gShootPeriod = 270 + (modifier*80*2) // base: 350
    }

    // use NRG to affect the moving speed of gotchi and
    // immunity time
    public useNRGTrait(_nrg: number)
    {
        let modifier: number
        if (_nrg <= 1)
        {
            modifier = 1
        }
        else if (_nrg >= 100)
        {
            modifier = 100
        }
        else
        {
            modifier = _nrg
        }
        this.sped = (200 + modifier) * getGameWidth(this.scene) / 800;
        this.IsStarTime = 2600 - modifier*10 // base is 2100
    }
}