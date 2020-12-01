let zoom = 5;
let angle = 0;
let zMin = 0.01;
let zMax = 5.1;
let sens = 0.001;

const maxiterations = 66;
let dimension = 800;

const colorsRed = [];
const colorsGreen = [];
const colorsBlue = [];

function setup() {
    pixelDensity(1);
    createCanvas(dimension, dimension);
    var div = window.document.getElementById("canvasDiv");
    div.appendChild(canvas);
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
  let ca = map(mouseX, 0, width, -1, 1); //-0.70176;
  let cb = map(mouseY, 0, height, -1, 1); //-0.3842;


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
