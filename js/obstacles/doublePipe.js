"use strict";
class DoublePipe extends Pipe {
    constructor(canvas, x, y, width, height, velX, gap, color) {
        super(canvas, x, y, width, height, velX, color);

        var midHeight = Math.random() * 150;

        // Make sure the gap can always be seen
        if ((height + (gap * 2) + midHeight) > canvas.height) {
            height = canvas.height - (gap * 2) - midHeight;
        }
        var top = new Platform(canvas, x, y, width, height, velX, color);

        var midY = y + gap + height;
        var mid = new Platform(canvas, x, midY, width, midHeight, velX, color);

        // Make sure the bottom of the pipe always takes up the rest of the height of the screen
        var bottomY = midY + gap + midHeight;
        var bottomHeight = canvas.height - bottomY;
        var bottom = new Platform(canvas, x, bottomY, width, bottomHeight, velX, color);
        this.pipes = [top, mid, bottom];
    }
}