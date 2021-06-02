import { AssetType } from "../assets";
import WebFontFile from '../../scenes/webFontFile'
import { getGameWidth, getGameHeight } from "game/helpers";

export class ScoreManager {
  scoreText!: Phaser.GameObjects.Text;
  highscoreText!: Phaser.GameObjects.Text;
  livesText!: Phaser.GameObjects.Text;
  restartText!: Phaser.GameObjects.Text;
  line1Text!: Phaser.GameObjects.Text;
  line2Text!: Phaser.GameObjects.Text;
  line3Text!: Phaser.GameObjects.Text;
  line4Text!: Phaser.GameObjects.Text;
  glives!: Phaser.Physics.Arcade.Group;
  highScore: number = 0;
  score = 0;
  submitScore: (score: number) => void;

  get noMoreLives() {
    return this.glives.countActive(true) === 0;
  }

  constructor(private _scene: Phaser.Scene) {
    this.highScore = _scene.game.registry.values.highscore;
    this._init();
    this.print();
    this.submitScore = _scene.game.registry.values.submitScore;
  }

  private _init() {
    const { width: SIZE_X, height: SIZE_Y } = this._scene.game.canvas;
    const textConfig = {
      fontFamily: '"Press Start 2P"',
      color: "#ffffff"
    };

    const normalTextConfig = {
      ...textConfig,
      fontSize: '30px'
    };

    const bigTextConfig = {
      ...textConfig,
      fontSize: '36px'
    };
    
    this._scene.load.addFile(new WebFontFile(this._scene.load, 'Press Start 2P'))
    this.scoreText = this._scene.add.text(10, SIZE_Y*0.01, `SCORE: 0`, normalTextConfig);
    this.scoreText.setDisplaySize(this.scoreText.displayWidth * getGameWidth(this._scene) / 800, this.scoreText.displayHeight * getGameHeight(this._scene) / 600);

    this.highscoreText = this._scene.add.text(10, SIZE_Y*0.075, `HIGH: ${this.highScore}`, normalTextConfig);
    this.highscoreText.setDisplaySize(this.highscoreText.displayWidth * getGameWidth(this._scene) / 800, this.highscoreText.displayHeight * getGameHeight(this._scene) / 600);

    this._setLivesText(SIZE_X, SIZE_Y, normalTextConfig);

    const l1texty = getGameHeight(this._scene) / 4;
    const l1textdy = getGameHeight(this._scene) * 0.15;

    this.line1Text = this._scene.add
      .text(SIZE_X / 2, l1texty, "", bigTextConfig)
      .setOrigin(0.5);

    this.line2Text = this._scene.add
      .text(SIZE_X / 2, l1texty + l1textdy, "", bigTextConfig)
      .setOrigin(0.5);
    
    this.line3Text = this._scene.add
      .text(SIZE_X / 2, l1texty + l1textdy*2, "", bigTextConfig)
      .setOrigin(0.5);
    
    this.line4Text = this._scene.add
      .text(SIZE_X / 2, l1texty + l1textdy*3, "", bigTextConfig)
      .setOrigin(0.5);  
  }

  private _setLivesText(
    SIZE_X: number,
    SIZE_Y: number,
    textConfig: { fontSize: string; fontFamily: string; color: string }
  ) {
    this.livesText = this._scene.add.text(0.85 * SIZE_X, SIZE_Y*0.01, `LIVES: `, textConfig).setOrigin(1,0);
    this.livesText.setDisplaySize(this.livesText.displayWidth * getGameWidth(this._scene) / 800, this.livesText.displayHeight * getGameHeight(this._scene) / 600);

    this.glives = this._scene.physics.add.group({
      maxSize: 3,
      runChildUpdate: true,
    });
    this.resetData();
  }

  resetData() {
    this.glives.clear(true, true)
    for (let i = 0; i < 3; i++) {
      let _gem: Phaser.GameObjects.Sprite = this.glives.create(
        0.95 * getGameWidth(this._scene) - 0.0875 * getGameWidth(this._scene) * i * 0.6,
        getGameHeight(this._scene) * 0.05,
        AssetType.Gem
      );
      _gem.setOrigin(0.5, 0.5);
      _gem.setAlpha(0.8);
      _gem.setDisplaySize(_gem.displayWidth * getGameWidth(this._scene) * 0.6 / 800, _gem.displayHeight * getGameHeight(this._scene) * 0.6 / 600)
    }
    this.score = 0;
    this.scoreText.setText(`SCORE: 0`)
    this.scoreText.setTint(0xffffff)
  }

  private _setBigText(line1: string, line2: string, line3: string, line4: string) {
    this.line1Text.setText(line1);
    this.line1Text.setDisplaySize(this.line1Text.displayWidth * getGameWidth(this._scene) / 800, this.line1Text.displayHeight * getGameHeight(this._scene) / 600);

    this.line2Text.setText(line2);
    this.line2Text.setDisplaySize(this.line2Text.displayWidth * getGameWidth(this._scene) / 800, this.line2Text.displayHeight * getGameHeight(this._scene) / 600);

    this.line3Text.setText(line3);

    this.line4Text.setText(line4);
  }

  hideText() {
    this._setBigText("", "", "","")
  }

  private setRestartText()
  {
    this.restartText = this.line3Text.setText('D /Click to restart')
    this.line3Text.setDisplaySize(this.line3Text.displayWidth * getGameWidth(this._scene) / 800, this.line3Text.displayHeight * getGameHeight(this._scene) / 600);


    this.line4Text.setText('Credit to @jo0wz\n  for FUD music')
    this.line4Text.setDisplaySize(this.line4Text.displayWidth * getGameWidth(this._scene) / 800, this.line4Text.displayHeight * getGameHeight(this._scene) / 600);

  }

  setHighScoreTextWin()
  {
    this.submitScore(this.score);
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this._scene.registry.set('highscore', this.highScore)
    }

    if (this._scene.registry.get('highscore') != undefined)
    {
      this.highscoreText.setText(`HIGH:  ${this._scene.registry.get('highscore')}`)
      this._setBigText("GAME OVER", 
      `HIGH SCORE: ${this.highScore}`,
      "","")
      this.setRestartText();
      
    }
    else
    {
      this.highscoreText.setText(`HIGH:  ${this.highScore}`)
      this._setBigText("GAME OVER", 
      `HIGH SCORE: ${this.highScore}`,
      "","")
      this.setRestartText();
    }
  }

  setHighScoreTextLose()
  {
    this.submitScore(this.score);
  
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this._scene.registry.set('highscore', this.highScore)
    }

    if (this._scene.registry.get('highscore') !== undefined)
    {
      this.highscoreText.setText(`HIGH:  ${this._scene.registry.get('highscore')}`)
      this._setBigText("GAME OVER", 
      `HIGH SCORE: ${this._scene.registry.get('highscore')}`,
      "","")
      this.setRestartText();
    }
    else
    {
      this.highscoreText.setText(`HIGH:  ${this.highScore}`)
      this._setBigText("GAME OVER", 
      `HIGH SCORE: ${this.highScore}`,
      "","")
      this.setRestartText();
    }
    
  }

  print() {
    this.scoreText.setText(`SCORE: ${this.score}`);
  }

  increaseScore(step: number) {
    this.score += step;
    this.print();
  }

  
}