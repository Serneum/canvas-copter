"use strict";
class Pipe extends Obstacle {
    constructor(canvas, x, y, width, height, velX, gap, color) {
        super(canvas, x, y, width, height, velX, color);
        
        // Make sure the gap can always be seen
        if (height + gap > canvas.height) {
            height = canvas.height - gap;
        }
        var top = new Platform(canvas, x, y, width, height, velX, color);

        // Make sure the bottom half of the pipe always takes up the rest of the height of the screen
        var bottomY = y + gap + height;
        var bottomHeight = canvas.height - bottomY;
        var bottom = new Platform(canvas, x, bottomY, width, bottomHeight, velX, color);
        this.pipes = [top, bottom];
    }

    getPipes() {
        return this.pipes;
    }

    update() {
        this.pipes.forEach(function(pipe) {
            pipe.update();
        });
        // Update the x value to any of the pipe x values
        this.x = this.pipes[0].x;
    }

    draw() {
        this.pipes.forEach(function(pipe) {
            pipe.draw();
        }); 
    }

    isColliding(player) {
        var result = false;
        for (var i = 0; i < this.pipes.length; i++) {
            var pipe = this.pipes[i];
            result = pipe.isColliding(player);
            if (result) {
                break;
            }
        }
        return result;
    }
}