import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super("LoadingScene");
    }

    preload() {

    }

    create() {
            this.scene.start("GameScene");

    }

    update() {

    }
}