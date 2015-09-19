"use strict";
class Obstacle {
    constructor(canvas, x, y, width, height, velX, color) {
        this.context = canvas.getContext('2d');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velX = velX;
        this.passedPlayer = false;
    }

    update() {
        this.x -= this.velX;
    }
    
    draw() {
        drawRect(this.context, this.x, this.y, this.width, this.height, this.color);
    }
    
    isColliding(player) {
        var result = false
        if (player.x + player.width >= this.x && player.x <= (this.x + this.width) &&
                player.y + player.height >= this.y && player.y <= this.y + this.height) {
            result = true;
        }
        return result
    }
}