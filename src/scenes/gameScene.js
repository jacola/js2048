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
            font: 'bold 64px sans-serif',
            fill: '#645f59'
        });
        headerText.setOrigin(0, 0.5);

        // Create score area
        const scoreContainer = this.add.container(250, 50);

        const scoreBackground = this.add.rectangle(0, 0, 150, 75, 0xbaac9f);
        const scoreHeading = this.add.text(0, -15, 'Score', {
            font: '24px sans-serif',
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
        const bestScoreContainer = this.add.container(410, 50);

        const bestScoreBackground = this.add.rectangle(0, 0, 150, 75, 0xbaac9f);
        const bestScoreHeading = this.add.text(0, -15, 'Best Score', {
            font: '24px sans-serif',
            fill: '#e8dacd'
        });
        bestScoreHeading.setOrigin(0.5);

        this.bestScoreText = this.add.text(0, 10, this.bestScore, {
            font: 'bolder 32px sans-serif',
            fill: '#ffffff'
        });
        this.bestScoreText.setOrigin(0.5);

        bestScoreContainer.add([bestScoreBackground, bestScoreHeading, this.bestScoreText]);

        // Add status text
        const statusText = this.add.text(20, 122, 'Join the numbers and get the 2048 tile!', {
            font: 'bold 18px sans-serif',
            fill: '#837c71'
        });
        statusText.setOrigin(0, 0.5);

        // Create new game button
        const newGameButtonContainer = this.add.container(425, 120);

        const newGameButtonBackground = this.add.rectangle(0, 0, 120, 50, 0x8e7968);
        newGameButtonBackground.setInteractive();
        newGameButtonBackground.on('pointerdown', () => {
            this.score = 0;
            this.board = [];
            this.scene.restart();
        });
        newGameButtonBackground.on('pointerover', () => {
            newGameButtonContainer.setScale(1.1);
            this.input.setDefaultCursor('pointer');
        });
        newGameButtonBackground.on('pointerout', () => {
            newGameButtonContainer.setScale(1);
            this.input.setDefaultCursor('default');
        });

        const newGameButtonText = this.add.text(0, 0, 'New Game', {
            font: 'bold 18px sans-serif',
            fill: '#ffffff'
        });
        newGameButtonText.setOrigin(0.5);

        newGameButtonContainer.add([newGameButtonBackground, newGameButtonText]);

        // Initialize board and create board elements
        this.initializeBoard();
        this.boardContainer = this.add.container(this.game.config.width / 2, this.game.config.height / 2 + 40);
        this.createBoardElements();
        this.updateBoard();

        // Add event listeners for arrow keys
        this.input.keyboard.on('keydown-UP', () => this.handleInput('up'));
        this.input.keyboard.on('keydown-DOWN', () => this.handleInput('down'));
        this.input.keyboard.on('keydown-LEFT', () => this.handleInput('left'));
        this.input.keyboard.on('keydown-RIGHT', () => this.handleInput('right'));
    }

    initializeBoard() {
        this.board = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
        this.addRandomTile();
    }

    addRandomTile() {
        const emptyTiles = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (this.board[row][col] === 0) {
                    emptyTiles.push({ row, col });
                }
            }
        }

        if (emptyTiles.length > 0) {
            const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            this.board[row][col] = Math.random() < 0.5 ? 2 : 4;
        }
    }

    createBoardElements() {
        const boardSize = TILE_SIZE * GRID_SIZE + GAP * (GRID_SIZE + 1);
        const boardBackground = this.add.rectangle(0, 0, boardSize, boardSize, 0xbbada0);
        this.boardContainer.add(boardBackground);

        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const tile = this.add.rectangle(
                    col * (TILE_SIZE + GAP) - boardSize / 2 + TILE_SIZE / 2 + GAP,
                    row * (TILE_SIZE + GAP) - boardSize / 2 + TILE_SIZE / 2 + GAP,
                    TILE_SIZE,
                    TILE_SIZE,
                    0xcdc1b3
                );
                this.boardContainer.add(tile);
            }
        }

        const guideText = this.add.text(this.game.config.width / 2, 530, "HOW TO PLAY: Use your arrow keys to move tiles. When two tiles with the same number touch, they merge into one!", {
            font: 'bold 18px sans-serif',
            fill: '#837c71',
            wordWrap: { width: 400 }
        });
        guideText.setOrigin(0.5, 0);
    }

    updateBoard() {
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const value = this.board[row][col];
                if (value !== 0) {
                    const tileName = `tile-${row}-${col}`;
                    let tileContainer = this.boardContainer.getByName(tileName);
                    if (!tileContainer) {
                        this.createTile(this.boardContainer, row, col, value);
                    } else {
                        let tileText = tileContainer.getAt(1);
                        tileText.setText(value);
                        tileContainer.getAt(0).setFillStyle(this.getBackgroundColor(value));
                    }
                } else {
                    const tileName = `tile-${row}-${col}`;
                    let tileContainer = this.boardContainer.getByName(tileName);
                    if (tileContainer) {
                        tileContainer.destroy();
                    }
                }
            }
        }

        this.updateScores();
    }

    createTile(boardContainer, row, col, value) {
        const tileContainer = this.add.container(
            col * (TILE_SIZE + GAP) - (TILE_SIZE * GRID_SIZE + GAP * (GRID_SIZE + 1)) / 2 + TILE_SIZE / 2 + GAP,
            row * (TILE_SIZE + GAP) - (TILE_SIZE * GRID_SIZE + GAP * (GRID_SIZE + 1)) / 2 + TILE_SIZE / 2 + GAP
        );

        const tileBackground = this.add.rectangle(0, 0, TILE_SIZE, TILE_SIZE, this.getBackgroundColor(value));
        const tileText = this.add.text(0, 0, value, {
            font: 'bold 32px sans-serif',
            fill: this.getTextColor(value)
        });
        tileText.setOrigin(0.5);

        tileContainer.setName(`tile-${row}-${col}`);

        tileContainer.add([tileBackground, tileText]);
        boardContainer.add(tileContainer);

        tileContainer.setScale(0.5);
        this.tweens.add({
            targets: tileContainer,
            scale: 1,
            duration: 250,
            ease: 'Cubic.easeOut'
        });

        return tileContainer;
    }

    getBackgroundColor(value) {
        switch (value) {
            case 2: return 0xeee4da;
            case 4: return 0xede0c8;
            case 8: return 0xf2b179;
            case 16: return 0xf59563;
            case 32: return 0xf67c5f;
            case 64: return 0xf65e3b;
            case 128: return 0xedcf72;
            case 256: return 0xedcc61;
            case 512: return 0xedc850;
            case 1024: return 0xedc53f;
            case 2048: return 0xedc22e;
            default: return 0xff0000;
        }
    }

    getTextColor(value) {
        return value <= 4 ? 0x776e65 : 0xf9f6f2;
    }

    updateScores() {
        this.score = this.board.flat().reduce((acc, val) => acc + val, 0);
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
        }
        this.scoreText.setText(this.score);
        this.bestScoreText.setText(this.bestScore);
    }

    handleInput(direction) {
        let moved = false;

        switch (direction) {
            case 'up':
                for (let col = 0; col < GRID_SIZE; col++) {
                    let merged = Array(GRID_SIZE).fill(false);
                    for (let row = 1; row < GRID_SIZE; row++) {
                        if (this.board[row][col] !== 0) {
                            let newRow = row;
                            while (newRow > 0 && this.board[newRow - 1][col] === 0) {
                                newRow--;
                            }
                            if (newRow > 0 && this.board[newRow - 1][col] === this.board[row][col] && !merged[newRow - 1]) {
                                this.board[newRow - 1][col] *= 2;
                                this.board[row][col] = 0;
                                merged[newRow - 1] = true;
                                moved = true;
                            } else if (newRow !== row) {
                                this.board[newRow][col] = this.board[row][col];
                                this.board[row][col] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
            case 'down':
                for (let col = 0; col < GRID_SIZE; col++) {
                    let merged = Array(GRID_SIZE).fill(false);
                    for (let row = GRID_SIZE - 2; row >= 0; row--) {
                        if (this.board[row][col] !== 0) {
                            let newRow = row;
                            while (newRow < GRID_SIZE - 1 && this.board[newRow + 1][col] === 0) {
                                newRow++;
                            }
                            if (newRow < GRID_SIZE - 1 && this.board[newRow + 1][col] === this.board[row][col] && !merged[newRow + 1]) {
                                this.board[newRow + 1][col] *= 2;
                                this.board[row][col] = 0;
                                merged[newRow + 1] = true;
                                moved = true;
                            } else if (newRow !== row) {
                                this.board[newRow][col] = this.board[row][col];
                                this.board[row][col] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
            case 'left':
                for (let row = 0; row < GRID_SIZE; row++) {
                    let merged = Array(GRID_SIZE).fill(false);
                    for (let col = 1; col < GRID_SIZE; col++) {
                        if (this.board[row][col] !== 0) {
                            let newCol = col;
                            while (newCol > 0 && this.board[row][newCol - 1] === 0) {
                                newCol--;
                            }
                            if (newCol > 0 && this.board[row][newCol - 1] === this.board[row][col] && !merged[newCol - 1]) {
                                this.board[row][newCol - 1] *= 2;
                                this.board[row][col] = 0;
                                merged[newCol - 1] = true;
                                moved = true;
                            } else if (newCol !== col) {
                                this.board[row][newCol] = this.board[row][col];
                                this.board[row][col] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
            case 'right':
                for (let row = 0; row < GRID_SIZE; row++) {
                    let merged = Array(GRID_SIZE).fill(false);
                    for (let col = GRID_SIZE - 2; col >= 0; col--) {
                        if (this.board[row][col] !== 0) {
                            let newCol = col;
                            while (newCol < GRID_SIZE - 1 && this.board[row][newCol + 1] === 0) {
                                newCol++;
                            }
                            if (newCol < GRID_SIZE - 1 && this.board[row][newCol + 1] === this.board[row][col] && !merged[newCol + 1]) {
                                this.board[row][newCol + 1] *= 2;
                                this.board[row][col] = 0;
                                merged[newCol + 1] = true;
                                moved = true;
                            } else if (newCol !== col) {
                                this.board[row][newCol] = this.board[row][col];
                                this.board[row][col] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.updateBoard();
        }
    }

    update() {

    }
}
