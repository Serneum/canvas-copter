var backgroundLayer;
var gameLayer;
var scoreLayer;
var messageLayer;

var gameContext;
var scoreContext;
var messageContext;

var helicopter;
var score = 0;
var obstacles = [];
var colors = ['rgb(47, 228, 253)', // light blue
              'rgb(255, 113, 0)', // orange
              'rgb(252, 67, 255)', // purple
              'rgb(253, 72, 47)', // sunset
              'rgb(255, 236, 0)', // yellow
              'rgb(184, 255, 0)']; // yellow-green
var isKeyPressed = false;
var showingMessage = false;

window.onload = function() {
    backgroundLayer = document.getElementById('background');
    drawBackground();

    scoreLayer = document.getElementById('score');
    scoreContext = scoreLayer.getContext('2d');
    drawScore();

    gameLayer = document.getElementById('game');
    gameContext = gameLayer.getContext('2d');

    messageLayer = document.getElementById('message');
    messageContext = messageLayer.getContext('2d');

    // The message layer is the top-most layer, so we have to add events to it instead of the game layer
    messageLayer.addEventListener('mousedown', handleKeyDown);
    messageLayer.addEventListener('mouseup', handleKeyUp);
    messageLayer.addEventListener('touchstart', handleKeyDown);
    messageLayer.addEventListener('touchend', handleKeyUp);

    helicopter = new Helicopter(gameLayer, "Helicopter.png");
    helicopter.image.onload = function() {
        helicopter.height = helicopter.image.height;
        helicopter.width = helicopter.image.width;

        drawWelcome();

        (function render() {
            requestAnimationFrame(render);
            if (!showingMessage) {
                update();
                drawGame();
            }
        })();
    }
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame     ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function(callback) {
              window.setTimeout(callback, 1000 / 60);
          };
})();

function handleKeyDown(event) {
    isKeyPressed = true;
    if (showingMessage) {
        reset();
        showingMessage = false;
    }
}
function handleKeyUp(event) {
    isKeyPressed = false;
}

function update() {
    helicopter.update(isKeyPressed);
    obstacles.forEach(function(obstacle) {
        // Check if colliding with obstacle
        if (obstacle.isColliding(helicopter)) {
            gameOver();
        }

        // Check if we've successfully passed this obstacle. Only count score once
        if (!obstacle.passedPlayer && obstacle.x + obstacle.width <= helicopter.x) {
            obstacle.passedPlayer = true;
            score++;
            drawScore();
        }

        // Remove obstacles that are now off the screen
        if (obstacle.x + obstacle.width <= 0) {
            var index = obstacles.indexOf(obstacle);
            if (index > -1) {
                obstacles.splice(index, 1);
            }
        }
    });
    
    // Check for hitting ceiling/floor after checking objects
    if (helicopter.isOutOfBounds()) {
        gameOver();
    }

    // Update obstacle speed and position.
    // We do this after checking for scores to guarantee that all speeds will be the same
    obstacles.forEach(function(obstacle) {
        var difficultySettings = getDifficultySettings();
        obstacle.velX = difficultySettings.speed;
        obstacle.update();
    });

    // Decide whether to generate a new obstacle
    generateObstacle();
}

function drawBackground() {
    var backgroundContext = backgroundLayer.getContext('2d');
    drawRect(backgroundContext, 0, 0, backgroundLayer.width, backgroundLayer.height, 'black');
}

function drawScore() {
    scoreContext.clearRect(0, 0, scoreLayer.width, scoreLayer.height);
    drawText(scoreContext, 10, 20, "18px Arial", "Score: " + score, 'rgb(255, 255, 255)', false);
}

function drawGame() {
    gameContext.clearRect(0, 0, gameLayer.width, gameLayer.height);
    helicopter.draw();
    obstacles.forEach(function(obstacle) {
        obstacle.draw();
    });
}

function drawWelcome() {
    clearMessageLayer();
    drawRect(messageContext, 0, 0, messageLayer.width, messageLayer.height, 'rgb(0, 0, 0)');
    drawText(messageContext, messageLayer.width / 2, messageLayer.height / 2, "70px Ariel", "Welcome to Helicopter", 'rgb(47, 228, 253)', true);
    drawText(messageContext, messageLayer.width / 2, messageLayer.height / 2 + 50, "30px Ariel", "Click to fly", 'rgb(47, 228, 253)', true);
    showingMessage = true;
}

function gameOver() {
    clearMessageLayer();
    drawText(messageContext, messageLayer.width / 2, messageLayer.height / 2, "150px Ariel", "Kaboom!", 'rgb(253, 72, 47)', true);
    drawText(messageContext, messageLayer.width / 2, messageLayer.height / 2 + 50, "20px Ariel", "Click to continue...", 'rgb(253, 72, 47)', true);
    showingMessage = true;
}

function clearMessageLayer() {
    messageContext.clearRect(0, 0, messageLayer.width, messageLayer.height);
    showingMessage = false;
}

function reset() {
    helicopter.reset();
    obstacles = [];
    score = 0;
    clearMessageLayer();
    drawScore();
}

// Determine when and what type of obstacle to generate
function generateObstacle() {
    var createObstacle = obstacles.length === 0;
    if (!createObstacle) {
        var lastObstacle = obstacles[obstacles.length - 1];
        if (lastObstacle.x + lastObstacle.width <= gameLayer.width - 400) {
            createObstacle = Math.round(Math.random() * 1) === 1;
        }
    }
    if (createObstacle) {
        var obstacle;
        var color = colors[Math.round(Math.random() * (colors.length - 1))];
        var diffSettings = this.getDifficultySettings();
        var obsType = Math.round(Math.random() * 2);
        if (obsType === 0) {
            var platformHeight = 50;
            var platformY = Math.round(Math.random() * ((gameLayer.width / 2) - 150)) + 150;
            obstacle = new Platform(gameLayer, gameLayer.width, (gameLayer.height - platformHeight) / 2,
                                platformY, platformHeight, diffSettings.speed, color);
        }
        else if (obsType === 1) {
            obstacle = new Pipe(gameLayer, gameLayer.width, 0, 75, Math.random() * gameLayer.height, diffSettings.speed,
                                Math.round(helicopter.height * diffSettings.gapMod), color);
        }
        else {
            obstacle = new DoublePipe(gameLayer, gameLayer.width, 0, 75, Math.random() * gameLayer.height, diffSettings.speed,
                                Math.round(helicopter.height * diffSettings.gapMod), color);
        }
        obstacles.push(obstacle);
    }
}

function getDifficultySettings() {
    settings = {
        "speed": 3,
        "gapMod": 3.2
    };
    if (3 <= this.score && this.score < 5) {
        settings.speed = 4
        settings.gapMod = 3.1
    }
    else if (5 <= this.score && this.score < 8) {
        settings.speed = 5
        settings.gapMod = 3.0
    }
    else if (8 <= this.score && this.score < 14) {
        settings.speed = 6
        settings.gapMod = 2.9
    }
    else if (this.score >= 14) {
        settings.speed = 7
        settings.gapMod = 2.8
    }
    return settings
}