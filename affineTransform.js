var grid_size = 20;
var x_axis_distance_grid_lines = 15;
var y_axis_distance_grid_lines = 15;
var x_axis_starting_point = { number: 1, suffix: '' };
var y_axis_starting_point = { number: 1, suffix: '' };

var canvas = document.getElementById("canvasAffineTransform");
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");

var canvas_width = canvas.width;
var canvas_height = canvas.height;

var num_lines_x = Math.floor(canvas_height/grid_size);
var num_lines_y = Math.floor(canvas_width/grid_size);

function redrawCoordinates(){
    // Store the current transformation matrix

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform

        // Draw grid lines along X-axis
    for(var i=0; i<=num_lines_x; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        
        // If line represents X-axis draw in different color
        if(i == x_axis_distance_grid_lines) 
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";
        
        if(i == num_lines_x) {
            ctx.moveTo(0, grid_size*i);
            ctx.lineTo(canvas_width, grid_size*i);
        }
        else {
            ctx.moveTo(0, grid_size*i+0.5);
            ctx.lineTo(canvas_width, grid_size*i+0.5);
        }
        ctx.stroke();
    }

    // Draw grid lines along Y-axis
    for(i=0; i<=num_lines_y; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        
        // If line represents X-axis draw in different color
        if(i == y_axis_distance_grid_lines) 
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";
        
        if(i == num_lines_y) {
            ctx.moveTo(grid_size*i, 0);
            ctx.lineTo(grid_size*i, canvas_height);
        }
        else {
            ctx.moveTo(grid_size*i+0.5, 0);
            ctx.lineTo(grid_size*i+0.5, canvas_height);
        }
        ctx.stroke();
    }

    // Translate to the new origin. Now Y-axis of the canvas is opposite to the Y-axis of the graph. So the y-coordinate of each element will be negative of the actual
    ctx.translate(y_axis_distance_grid_lines*grid_size, x_axis_distance_grid_lines*grid_size);

    // Ticks marks along the positive X-axis
    for(i=1; i<(num_lines_y - y_axis_distance_grid_lines); i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(grid_size*i+0.5, -3);
        ctx.lineTo(grid_size*i+0.5, 3);
        ctx.stroke();

        // Text value at that point
        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(x_axis_starting_point.number*i + x_axis_starting_point.suffix, grid_size*i-2, 15);
    }

    // Ticks marks along the negative X-axis
    for(i=1; i<y_axis_distance_grid_lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-grid_size*i+0.5, -3);
        ctx.lineTo(-grid_size*i+0.5, 3);
        ctx.stroke();

        // Text value at that point
        ctx.font = '9px Arial';
        ctx.textAlign = 'end';
        ctx.fillText(-x_axis_starting_point.number*i + x_axis_starting_point.suffix, -grid_size*i+3, 15);
    }

    // Ticks marks along the positive Y-axis
    // Positive Y-axis of graph is negative Y-axis of the canvas
    for(i=1; i<(num_lines_x - x_axis_distance_grid_lines); i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-3, grid_size*i+0.5);
        ctx.lineTo(3, grid_size*i+0.5);
        ctx.stroke();

        // Text value at that point
        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(-y_axis_starting_point.number*i + y_axis_starting_point.suffix, 8, grid_size*i+3);
    }

    // Ticks marks along the negative Y-axis
    // Negative Y-axis of graph is positive Y-axis of the canvas
    for(i=1; i<x_axis_distance_grid_lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-3, -grid_size*i+0.5);
        ctx.lineTo(3, -grid_size*i+0.5);
        ctx.stroke();

        // Text value at that point
        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(y_axis_starting_point.number*i + y_axis_starting_point.suffix, 8, -grid_size*i+3);
    }
}

redrawCoordinates();

var rectangleArray = [[],[],[],[]];

function getSquareFromDiagonal(){
    let squareDiagonalX1 = parseFloat($('#SquareDiagonalX1').val());
    let squareDiagonalY1 = parseFloat($('#SquareDiagonalY1').val());
    let squareDiagonalX2 = parseFloat($('#SquareDiagonalX2').val());
    let squareDiagonalY2 = parseFloat($('#SquareDiagonalY2').val());
    rectangleArray[0][0] = squareDiagonalX1;
    rectangleArray[0][1] = squareDiagonalY1;
    rectangleArray[1][0] = squareDiagonalX1;
    rectangleArray[1][1] = squareDiagonalY2;
    rectangleArray[2][0] = squareDiagonalX2;
    rectangleArray[2][1] = squareDiagonalY2;
    rectangleArray[3][0] = squareDiagonalX2;
    rectangleArray[3][1] = squareDiagonalY1;
    return rectangleArray;
}

function drawRectangleArray(color){
    ctx.beginPath();
    ctx.moveTo(rectangleArray[0][0]*grid_size,-rectangleArray[0][1]*grid_size);
    for (let i = 1; i < rectangleArray.length; i++) {
        ctx.lineTo(rectangleArray[i][0]*grid_size,-rectangleArray[i][1]*grid_size);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
}

function applyTranslation(){
    let translationX = parseFloat($('#TranslationX').val());
    let translationY = parseFloat($('#TranslationY').val());
    for (let i = 0; i < rectangleArray.length; i++) {
        rectangleArray[i][0]+=translationX;
        rectangleArray[i][1]+=translationY;
    }
    return rectangleArray;
}

function applyTranslationOnArray(rectangleArray, translationX,translationY){
    for (let i = 0; i < rectangleArray.length; i++) {
        rectangleArray[i][0]+=translationX;
        rectangleArray[i][1]+=translationY;
    }
    return rectangleArray;
}

function applyScale(){
    let scaleX = parseFloat($('#ScaleX').val());
    let scaleY = parseFloat($('#ScaleY').val());
    let scaleMatrix = [
                        [scaleX,0],
                        [0,scaleY]
                    ];
    let translationX = rectangleArray[0][0];
    let translationY = rectangleArray[0][1];
    applyTranslationOnArray(rectangleArray,-translationX,-translationY)
    rectangleArray = multiplyMatrix(rectangleArray,scaleMatrix);
    applyTranslationOnArray(rectangleArray,translationX,translationY)
    return rectangleArray;
}

function applyAngle(){
    let angle = parseFloat($('#Angle').val());
    let angleRadians = angle * Math.PI /180;
    var angleMatrix = [
        [Math.cos(angleRadians), -Math.sin(angleRadians)],
        [Math.sin(angleRadians), Math.cos(angleRadians)]
    ]
    rectangleArray = multiplyMatrix(rectangleArray,angleMatrix);
    return rectangleArray;
}

function multiplyMatrix(matrix1, matrix2){
    let resultMatrix = [[0,0],[0,0],[0,0],[0,0]];
    for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < matrix2[0].length; j++) {
            for (let k = 0; k < matrix1[i].length; k++) 
            {
                resultMatrix[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }
    return resultMatrix;
} 

$('.numberDiagonal').keyup(() => {
        redrawCoordinates();
        getSquareFromDiagonal();
        applyTranslation();
        applyScale();
        applyAngle();
        drawRectangleArray('#327f4a');
    }
)

$('.numberTranslation').keyup(() => {
    redrawCoordinates();
    getSquareFromDiagonal();
    applyTranslation();
    applyScale();
    applyAngle();
    drawRectangleArray('#244479');
}
)

$('.numberScale').keyup(() => {
    redrawCoordinates();
    getSquareFromDiagonal();
    applyTranslation();
    applyScale();
    applyAngle();
    drawRectangleArray('#5d237a');
}
)

$('.numberAngle').keyup(() => {
    redrawCoordinates();
    getSquareFromDiagonal();
    applyTranslation();
    applyScale();
    applyAngle();
    drawRectangleArray('#dc6a10');
}
)

function redrawRectangle(){
    redrawCoordinates();
    getSquareFromDiagonal();
    applyTranslation();
    applyScale();
    applyAngle();
    drawRectangleArray('#dc6a10');
}

redrawRectangle();
