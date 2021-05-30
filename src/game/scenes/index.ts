<<<<<<< HEAD
import { BootScene } from './boot-scene';
//import { GameScene } from './game-scene';
//import { SceneKeys } from '../consts/SceneKeys'
import TitleScene  from '../scenes/titleScene'
import { GameScene } from '../scenes/game';
import BackGround from '../scenes/background';
//import Preload from '../scenes/preload';

const scenes = [BootScene, BackGround, TitleScene, GameScene];

=======
import { BootScene } from './boot-scene';
import { GameScene } from './game-scene';

const scenes = [BootScene, GameScene];

>>>>>>> 3ca44af62bf37991318ca8070c49541097633a71
export default scenes;