// Create a new Phaser game instance
const game = new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'game-container',
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
});

// Preload game assets
function preload() {
  this.load.image('cloud', 'assets/cloud.png');
  this.load.image('coin', 'assets/coin.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('obstacle', 'assets/obstacle.png');
}

// Create game objects
function create() {
  // Create the player
  player = this.add.sprite(100, 100, 'player');
  player.body = this.physics.add.body(player);
  player.body.setCollideWorldBounds(true);
  player.body.setGravityY(500);

  // Create the clouds
  clouds = this.add.group();
  for (let i = 0; i < 10; i++) {
    const cloud = clouds.create(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), 'cloud');
    cloud.body = this.physics.add.body(cloud);
    cloud.body.setImmovable(true);
  }

  // Create the coins
  coins = this.add.group();
  for (let i = 0; i < 20; i++) {
    const coin = coins.create(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), 'coin');
    coin.body = this.physics.add.body(coin);
    coin.body.setImmovable(true);
  }

  // Create the obstacles
  obstacles = this.add.group();
  for (let i = 0; i < 5; i++) {
    const obstacle = obstacles.create(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), 'obstacle');
    obstacle.body = this.physics.add.body(obstacle);
    obstacle.body.setImmovable(true);
  }

  // Create the score text
  scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: 24, fill: '#000' });

  // Create the jump sound
  jumpSound = this.sound.add('jump');
}

// Update game logic
function update(time, delta) {
  // Update player movement
  if (this.input.keyboard.isDown(Phaser.Input.Keyboard.LEFT)) {
    player.body.setVelocityX(-200);
  } else if (this.input.keyboard.isDown(Phaser.Input.Keyboard.RIGHT)) {
    player.body.setVelocityX(200);
  } else {
    player.body.setVelocityX(0);
  }

  // Update player jumping
  if (this.input.keyboard.isDown(Phaser.Input.Keyboard.SPACE) && player.body.onFloor()) {
    player.body.setVelocityY(-500);
    jumpSound.play();
  }

  // Update coin collection
  Phaser.ActionsOverlap(player, coins, collectCoin);

  // Update obstacle collision
  Phaser.ActionsOverlap(player, obstacles, gameOver);

  // Update score
  scoreText.text = `Score: ${score}`;
}

// Collect coin function
function collectCoin(player, coin) {
  coin.destroy();
  score++;
}

// Game over function
function gameOver(player, obstacle) {
  player.destroy();
  alert('Game Over!');
  location.reload();
}

// Score variable
let score = 0;
