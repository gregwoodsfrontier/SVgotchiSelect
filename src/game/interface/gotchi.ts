<<<<<<< HEAD
import { AssetType } from './assets'

export default class Gotchi extends Phaser.GameObjects.Sprite
{
    nrg?: number = 50 //energy
    agg?: number = 50 //aggressive
    spk?: number = 50 //spooky
    brn?: number = 50//brian

    constructor(scene:Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.Gotchi);
        this.scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    }

    setTraits(_nrg: number, _agg: number, _spk: number, _brn: number)
    {
        this.nrg = _nrg;
        this.agg = _agg;
        this.spk = _spk;
        this.brn = _brn;
    }
    

    kill()
    {
        this.destroy()
    }
=======
import { AssetType } from './assets'

export default class Gotchi extends Phaser.GameObjects.Sprite
{
    nrg?: number = 50 //energy
    agg?: number = 50 //aggressive
    spk?: number = 50 //spooky
    brn?: number = 50//brian

    constructor(scene:Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.Gotchi);
        this.scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    }

    setTraits(_nrg: number, _agg: number, _spk: number, _brn: number)
    {
        this.nrg = _nrg;
        this.agg = _agg;
        this.spk = _spk;
        this.brn = _brn;
    }
    

    kill()
    {
        this.destroy()
    }
>>>>>>> 3ca44af62bf37991318ca8070c49541097633a71
}