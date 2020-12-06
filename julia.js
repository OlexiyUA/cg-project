let zoom = 5;
let angle = 0;
let zMin = 0.01;
let zMax = 5.1;
let sens = 0.001;

const maxiterations = 66;

let dimension = 0;
if (window.innerWidth < 800) {
    dimension = Math.round(window.innerWidth * 0.9);
} else {
    dimension = Math.round(window.innerHeight * 0.8);
}


let dark = false;

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
    colorMode(HSB, 1);
    for (let n = 0; n < maxiterations; n++) {
        let hu = sqrt(n / maxiterations);
        let col = color(hu, 1, 1);
        colorsRed[n] = red(col);
        colorsGreen[n] = green(col);
        colorsBlue[n] = blue(col);
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

$("#monochromeScheme").change(
    function() {
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
);

$("#rainbowScheme").change(beginning);

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

$("#hueRange").mousemove(
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
  let ca = map(mouseX, 0, width, -1, 1);
  let cb = map(mouseY, 0, height, -1, 1);
  $("#CXMOUSE").text(ca.toFixed(6));
  $("#CYMOUSE").text(cb.toFixed(6));

  background(255);

  let w = zoom;
  let h = (w * height) / width;


  let xmin = -w / 2;
  let ymin = -h / 2;

  loadPixels();


  let xmax = xmin + w;

  let ymax = ymin + h;


  let dx = (xmax - xmin) / width;
  let dy = (ymax - ymin) / height;


  let y = ymin;
  for (let j = 0; j < height; j++) {

    let x = xmin;
    for (let i = 0; i < width; i++) {

      let a = x;
      let b = y;
      let n = 0;
      while (n < maxiterations) {
        let aa = a * a;
        let bb = b * b;

        if (aa + bb > 4.0) {
          break;
        }
        let twoab = 2.0 * a * b;
        a = aa - bb + ca;
        b = twoab + cb;
        n++;
      }


      let pix = (i + j * width) * 4;
      if (n == maxiterations) {
        pixels[pix + 0] = 0;
        pixels[pix + 1] = 0;
        pixels[pix + 2] = 0;
      } else {
        pixels[pix + 0] = colorsRed[n];
        pixels[pix + 1] = colorsGreen[n];
        pixels[pix + 2] = colorsBlue[n];
      }
      x += dx;
    }
    y += dy;
  }
  updatePixels();
}

function mouseWheel(event) {
    zoom += sens * event.delta;
    zoom = constrain(zoom, zMin, zMax);
    return false;
}
