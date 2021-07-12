import Phaser from "phaser";
import { ScoreManager } from "game/interface/manager/scoreManager";

export class UIScene extends Phaser.Scene
{
    scoreManager!: ScoreManager

    constructor()
    {
        super('ui')
    }

    create()
    {
        this.scoreManager = new ScoreManager(this)
    }
}