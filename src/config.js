import Phaser from 'phaser';
import LoadingScene from './scenes/loadingScene';
import GameScene from './scenes/gameScene';

export default {
    type: Phaser.AUTO,
    width: 500,
    height: 600,
    parent: 'game',
    scene:[
        LoadingScene,
        GameScene
    ],
    backgroundColor: '#faf8f0'
}
