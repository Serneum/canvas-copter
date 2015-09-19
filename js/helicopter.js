function Helicopter(canvas, image) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.image = new Image();
    this.image.src = "resources/" + image;
    this.speed = 5;

    this.x = 100;
    // Start in the center of the y axis
    this.y = (canvas.height / 2) - (this.image.height / 2);
    this.velY = this.speed;
    this.height = this.image.height;
    this.width = this.image.width;
};

Helicopter.prototype = {
    draw: function() {
        this.context.drawImage(this.image, this.x, this.y);
    },
    update: function(isKeyPressed) {
        this.determineVelY(isKeyPressed);
        this.move();
    },
    isOutOfBounds: function() {
        var result = false;
        if (this.y <= 0 || this.y > this.canvas.height - this.image.height) {
            result = true;
        }
        return result;
    },
    reset: function() {
        this.y = (this.canvas.height / 2) - (this.image.height / 2);
    },
    move: function() {
        this.y += this.velY;
    },
    determineVelY: function(isKeyPressed) {
        if (isKeyPressed) {
            this.velY = -this.speed;
        }
        else {
            this.velY = this.speed;
        }
    }
}