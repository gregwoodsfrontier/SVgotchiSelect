<<<<<<< HEAD
import { AssetType } from "./assets";

export class Kaboom extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, AssetType.Kaboom);
    }

    kill()
    {
        this.destroy()
    }
=======
import { AssetType } from "./assets";

export class Kaboom extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, AssetType.Kaboom);
    }

    kill()
    {
        this.destroy()
    }
>>>>>>> 3ca44af62bf37991318ca8070c49541097633a71
}