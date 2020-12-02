let zoom = 2.5;
let zMin = 0.5;
let zMax = 5;
let sens = 0.001;

let dimension = 800;
var maxiterations = 100;


const colorsRed = [];
const colorsGreen = [];
const colorsBlue = [];


function setup() {
  let div = window.document.getElementById("canvasDiv");
  createCanvas(dimension, dimension);
  div.appendChild(canvas);
  pixelDensity(1);
  colorMode(HSB, 1);

  for (let n = 0; n < maxiterations; n++) {

      let hu = sqrt(n / maxiterations);
      let col = color(hu, 255, 150);
      colorsRed[n] = red(col);
      colorsGreen[n] = green(col);
      colorsBlue[n] = blue(col);
  }

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

      var bright = map(n, 0, maxiterations, 0, 1);
      bright = map(sqrt(bright), 0, 1, 0, 255);

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
