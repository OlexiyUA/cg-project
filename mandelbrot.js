let zoom = 2.5;
let zMin = 0.5;
let zMax = 5;
let sens = 0.001;

let dark = false;

let dimension = 0;
if (window.innerWidth < 800) {
    dimension = Math.round(window.innerWidth * 0.9);
} else {
    dimension = Math.round(window.innerHeight * 0.8);
}

var maxiterations = 100;


const colorsRed = [];
const colorsGreen = [];
const colorsBlue = [];


$( window ).resize(function() {
    if (window.innerWidth < 800) {
        dimension = Math.round(window.innerWidth * 0.9);
    } else {
        dimension = Math.round(window.innerHeight * 0.8);
    }
    resizeCanvas(dimension, dimension);
});

function beginning() {
    $("#hueDiv")[0].style.display = "none";

    colorMode(RGB, 255);
    for (let n = 0; n < maxiterations; n++) {
        var bright = map(n, 0, maxiterations, 0, 1);
        bright = map(sqrt(bright), 0, 1, 0, 255);
        colorsRed[n] = bright;
        colorsGreen[n] = bright;
        colorsBlue[n] = bright;
    }
}

function lightSchemeChange() {
    colorMode(HSB, 1);
    for (let n = 0; n < maxiterations; n++) {
        let hu = sqrt((n + 1) / maxiterations);
        let hue = $("#hueRange")[0].value / 360;
        let col = color(hue, hu, 1);
        colorsRed[n] = red(col);
        colorsGreen[n] = green(col);
        colorsBlue[n] = blue(col);
    }
}

function darkSchemeChange() {
    colorMode(HSB, 1);
    for (let n = 0; n < maxiterations; n++) {
        let hu = sqrt((n + 1) / maxiterations);
        let hue = $("#hueRange")[0].value / 360;
        let col = color(hue, 0.8, hu);
        colorsRed[n] = red(col);
        colorsGreen[n] = green(col);
        colorsBlue[n] = blue(col);
    }
}

$("#monochromeScheme").change(beginning);

$("#rainbowScheme").change(
    function() {
        $("#hueDiv")[0].style.display = "none";
        colorMode(HSB, 1);
        for (let n = 0; n < maxiterations; n++) {
            let hu = sqrt(n / maxiterations);
            let col = color(hu, 1, 1);
            colorsRed[n] = red(col);
            colorsGreen[n] = green(col);
            colorsBlue[n] = blue(col);
        }
    }
);

$("#lightScheme").change(
    function() {
        $("#hueDiv")[0].style.display = "block";
        dark = false;
        lightSchemeChange();
    }
);

$("#darkScheme").change(
    function() {
        $("#hueDiv")[0].style.display = "block";
        dark = true;
        darkSchemeChange();
    }
);

$("#hueRange").change(
    function() {
        if (dark) {
            darkSchemeChange();
        } else {
            lightSchemeChange();
        }
    }
);

function setup() {
    var canvas = createCanvas(dimension, dimension);
    canvas.parent("canvasDiv");
    pixelDensity(1);
    beginning();

}

function draw() {

    loadPixels();
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var a = map(x, 0, width, -zoom, zoom);
            var b = map(y, 0, height, -zoom, zoom);

            var ca = a;
            var cb = b;

            var n = 0;

            while (n < maxiterations) {
                var aa = a * a - b * b;
                var bb = 2 * a * b;
                a = aa + ca;
                b = bb + cb;
                if (a * a + b * b > 4) {
                    break;
                }
                n++;
            }

            if (n == maxiterations) {
                bright = 0;
            }

            var pix = (x + y * width) * 4;
            if (n == maxiterations) {
                pixels[pix + 0] = 0;
                pixels[pix + 1] = 0;
                pixels[pix + 2] = 0;
                pixels[pix + 3] = 255;
            } else {
                pixels[pix + 0] = colorsRed[n];
                pixels[pix + 1] = colorsGreen[n];
                pixels[pix + 2] = colorsBlue[n];
                pixels[pix + 3] = 255;
            }
        }
    }
    updatePixels();

}


function mouseWheel(event) {
    zoom += sens * event.delta;
    zoom = constrain(zoom, zMin, zMax);
    return false;
}
