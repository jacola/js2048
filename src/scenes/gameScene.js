import Phaser from "phaser";

const GRID_SIZE = 4;
const TILE_SIZE = 75;
const GAP = 10;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.board = [];
        this.score = 0;
        this.bestScore = 0;
    }

    preload() {

    }

    create() {
        // Add header text '2048'
        const headerText = this.add.text(20, 50, '2048', {
            font: 'bold 72px sans-serif',
            fill: '#645f59'
        });
        headerText.setOrigin(0, 0.5);

        // Create score area
        const scoreContainer = this.add.container(255, 50);

        const scoreBackground = this.add.rectangle(0, 0, 150, 75, 0xbaac9f);
        const scoreHeading = this.add.text(0, -20, 'Score', {
            font: 'bold 24px sans-serif',
            fill: '#e8dacd'
        });
        scoreHeading.setOrigin(0.5);

        this.scoreText = this.add.text(0, 10, this.score, {
            font: 'bolder 32px sans-serif',
            fill: '#ffffff'
        });
        this.scoreText.setOrigin(0.5);

        scoreContainer.add([scoreBackground, scoreHeading, this.scoreText]);

        // Create best score area
        const bestScoreContainer = this.add.container(415, 50);

        const bestScoreBackground = this.add.rectangle(0, 0, 150, 75, 0xbaac9f);
        const bestScoreHeading = this.add.text(0, -20, 'Best Score', {
            font: 'bold 24px sans-serif',
            fill: '#e8dacd'
        });
        bestScoreHeading.setOrigin(0.5);

        this.bestScoreText = this.add.text(0, 10, this.bestScore, {
            font: 'bolder 32px sans-serif',
            fill: '#ffffff'
        });
        this.bestScoreText.setOrigin(0.5);

        bestScoreContainer.add([bestScoreBackground, bestScoreHeading, this.bestScoreText]);
    }

    update() {

    }
}
