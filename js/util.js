function drawRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawText(context, x, y, font, text, color, center) {
    context.fillStyle = color;
    context.font = font;
    var textWidth = context.measureText(text).width;
    if (center) {
        x = x - textWidth / 2;
    }
    context.fillText(text, x, y);
}
