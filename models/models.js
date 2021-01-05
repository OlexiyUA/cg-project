const fullCircle = 360;
const blueHue = 240;
const blueHueNorm = blueHue / fullCircle;

var hueTolerance = 0;
var saturationDiff = 0;
var brightnessDiff = 0;

var canvasOrig = $("#canvasOrig")[0];
var canvasColor = $("#canvasColor")[0];
let image = new Image();
let cords = null;
let endCords = null;
let savedData = null;
let defaultMask = [];
let zeroMask = [];
for (let i = 0; i < canvasOrig.height; ++i) {
    defaultMask[i] = [];
    zeroMask[i] = [];
    for (let j = 0; j < canvasOrig.width; ++j) {
        defaultMask[i][j] = 1;
        zeroMask[i][j] = 0;
    }
}

let anotherMask = null;

$("#hueRange").change(
    function() {
        hueTolerance = $("#hueRange")[0].value / fullCircle;
        if (savedData == null)
            changeBlueValue();
        else
            changeBlueValue(anotherMask);
    }
);

$("#hueRange").mousemove(
    function() {
        hueTolerance = $("#hueRange")[0].value / fullCircle;
        if (savedData == null)
            changeBlueValue();
        else
            changeBlueValue(anotherMask);
    }
);

$("#saturationRange").change(
    function() {
        saturationDiff = $("#saturationRange")[0].value / 100.0;
        if (savedData == null)
            changeBlueValue();
        else
            changeBlueValue(anotherMask);
    }
);

$("#saturationRange").mousemove(
    function() {
        saturationDiff = $("#saturationRange")[0].value / 100.0;
        if (savedData == null)
            changeBlueValue();
        else
            changeBlueValue(anotherMask);
    }
);

$("#brightnessRange").change(
    function() {
        brightnessDiff = $("#brightnessRange")[0].value / 100.0;
        if (savedData == null)
            changeBlueValue();
        else
            changeBlueValue(anotherMask);
    }
);

$("#brightnessRange").mousemove(
    function() {
        brightnessDiff = $("#brightnessRange")[0].value / 100.0;
        if (savedData == null)
            changeBlueValue();
        else
            changeBlueValue(anotherMask);
    }
);

function copy2dArray(arr) {
    let copied = []
    for (let i = 0; i < arr.length; ++i) {
        copied[i] = [];
        for (let j = 0; j < arr[i].length; ++j) {
            copied[i][j] = arr[i][j];
        }
    }
    return copied;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    };
}

function getRgbPixel(canvas, mouseX, mouseY) {
    let imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let basePos = mouseY * canvas.width + mouseX;
    basePos *= 4;
    return {
        r: imageData[basePos],
        g: imageData[basePos + 1],
        b: imageData[basePos + 2]
    };
}

$("#selectionRemoval").click(
    function() {
        if (savedData == null)
            return;

    	let prevData = canvasOrig.getContext('2d').getImageData(0, 0, canvasOrig.width, canvasOrig.height);
        let pos;

        for (let i = 0; i < canvasOrig.height; ++i) {
            for (let j = 0; j < canvasOrig.width; ++j) {
                pos = i * canvasOrig.width + j;
                pos *= 4;
                for (let k = 0; k < 4; ++k) {
                    prevData.data[pos + k] = savedData[pos + k];
                }
            }
        }

    	canvasOrig.getContext('2d').putImageData(prevData, 0, 0);
        changeBlueValue();
        savedData = null;
        anotherMask = copy2dArray(zeroMask);
    }
);

$("#canvasOrig").mousedown(
    function(event) {
        cords = getMousePos(canvasOrig, event);
    }
);

$("#canvasOrig").mouseup(
    function(event) {
        if (cords == null)
            return;

        if (anotherMask == null) {
            anotherMask = copy2dArray(zeroMask);
        }

        if (savedData == null) {
            savedData = canvasOrig.getContext('2d').getImageData(0, 0, canvasOrig.width, canvasOrig.height).data.slice();
        }

        endCords = getMousePos(canvasOrig, event);
        let ctx = canvasOrig.getContext('2d')
        ctx.beginPath();
        ctx.lineWidth = "1px";
        ctx.strokeStyle = "red";
        ctx.rect(cords.x, cords.y, endCords.x - cords.x, endCords.y - cords.y);
        ctx.stroke();

        let xmin = Math.min(cords.x, endCords.x);
        let xmax = Math.max(cords.x, endCords.x);
        let ymin = Math.min(cords.y, endCords.y);
        let ymax = Math.max(cords.y, endCords.y);

        for (let i = ymin; i < ymax; ++i) {
            for (let j = xmin; j < xmax; ++j) {
                anotherMask[i][j] = 1;
            }
        }

        cords = null;
        changeBlueValue(anotherMask);
    }
);


$("#canvasOrig").mousemove(
    function(event) {
        let pos = getMousePos(canvasOrig, event);
        let rgb = getRgbPixel(canvasOrig, pos.x, pos.y);
        let hsv = rgb2hsv(rgb.r, rgb.g, rgb.b);
        let cmyk = rgb2cmyk(rgb.r, rgb.g, rgb.b);
        $("#RGBstr").text(" " + rgb.r + ", " + rgb.g + ", " + rgb.b);
        $("#HSVstr").text(" " + (hsv.h * 360).toFixed(0) + "°, " + hsv.s.toFixed(3) + ", " + hsv.v.toFixed(3));
        $("#CMYKstr").text(" " + cmyk.c.toFixed(3) + ", " + cmyk.m.toFixed(3) + ", " + cmyk.y.toFixed(3) + ", " + cmyk.k.toFixed(3));
    }
);

$("#canvasColor").mousemove(
    function(event) {
        let pos = getMousePos(canvasColor, event);
        let rgb = getRgbPixel(canvasColor, pos.x, pos.y);
        let hsv = rgb2hsv(rgb.r, rgb.g, rgb.b);
        let cmyk = rgb2cmyk(rgb.r, rgb.g, rgb.b);
        $("#RGBstr").text(" " + rgb.r + ", " + rgb.g + ", " + rgb.b);
        $("#HSVstr").text(" " + (hsv.h * 360).toFixed(0) + "°, " + hsv.s.toFixed(3) + ", " + hsv.v.toFixed(3));
        $("#CMYKstr").text(" " + cmyk.c.toFixed(3) + ", " + cmyk.m.toFixed(3) + ", " + cmyk.y.toFixed(3) + ", " + cmyk.k.toFixed(3));
    }
);

$("#canvasOrig").mouseout(
    function(event) {
        $("#RGBstr").text("");
        $("#HSVstr").text("");
        $("#CMYKstr").text("");
    }
);

$("#canvasColor").mouseout(
    function(event) {
        $("#RGBstr").text("");
        $("#HSVstr").text("");
        $("#CMYKstr").text("");
    }
);

function loadImageFromFile() {
	let fileInput = $("#fileInput")[0];

    image.onload = function() {
        let context = canvasOrig.getContext('2d');
        canvasOrig.height = canvasOrig.clientHeight;
        canvasOrig.width = canvasOrig.clientWidth;
        context.clearRect(0, 0, canvasOrig.width, canvasOrig.height);
        if (image.width > image.height) {
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasOrig.width, canvasOrig.height / (image.width / image.height));
        } else {
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasOrig.width / (image.height / image.width), canvasOrig.height);
        }

        changeBlueValue();
    }

    let fileReader = new FileReader();
    fileReader.onload = function() {
        image.src = this.result;
    }

	if (fileInput.files.length == 1) {
		let file = fileInput.files[0];
		fileReader.readAsDataURL(file);
        savedData = null;
        anotherMask = copy2dArray(zeroMask);
	} else if (!image.src) {
        image.src = "../img/model_example.jpeg";
    }
}

async function changeBlueValue(mask = defaultMask) {
    if (image == null)
        return;

    if (mask == null)
        mask = defaultMask;

    let aData;
    if (savedData == null) {
        aData = canvasOrig.getContext('2d').getImageData(0, 0, canvasOrig.width, canvasOrig.height).data;
    } else {
        aData = savedData.slice();
    }

    for (let i = 0; i < canvasOrig.height; ++i) {
        for (let j = 0; j < canvasOrig.width; ++j) {
            pos = i * canvasOrig.width + j;
            pos *= 4;
            if (mask[i][j] === 1) {
                var pixel = {
                    r: aData[pos],
                    g: aData[pos + 1],
                    b: aData[pos + 2]
                };
                var pixelHsv = rgb2hsv(pixel.r, pixel.g, pixel.b);
                if (checkHueTolerance(blueHueNorm, hueTolerance, pixelHsv.h)) {
                    pixelHsv.s += saturationDiff;
                    pixelHsv.v += brightnessDiff;
                    var pixelRgb = hsv2rgb(pixelHsv.h, pixelHsv.s, pixelHsv.v);
                    aData[pos] = pixelRgb.r;
                    aData[pos + 1] = pixelRgb.g;
                    aData[pos + 2] = pixelRgb.b;
                }
            }
        }
    }
	canvasColor.getContext('2d').putImageData(new ImageData(aData, canvasOrig.width), 0, 0);
}

function hsv2rgb(hue, saturation, value) {
    if (hue < 0 || hue > 1) {
        hue = hue - Math.floor(hue);
    }
    if (saturation < 0) {
        saturation = 0;
    }
    if (saturation > 1) {
        saturation = 1;
    }
    if (value < 0) {
        value = 0;
    }
    if (value > 1) {
        value = 1;
    }
    let chroma = value * saturation;
    let hue1 = hue * 6;
    let x = chroma * (1 -  Math.abs((hue1 % 2) - 1));
    let r1, g1, b1;


    if (hue1 >= 0 && hue1 <= 1) {
        ([r1, g1, b1] = [chroma, x, 0]);
    } else if (hue1 <= 2) {
        ([r1, g1, b1] = [x, chroma, 0]);
    } else if (hue1 <= 3) {
        ([r1, g1, b1] = [0, chroma, x]);
    } else if (hue1 <= 4) {
        ([r1, g1, b1] = [0, x, chroma]);
    } else if (hue1 <= 5) {
        ([r1, g1, b1] = [x, 0, chroma]);
    } else if (hue1 <= 6) {
        ([r1, g1, b1] = [chroma, 0, x]);
    }

    let m = value - chroma;
    let [r, g, b] = [r1 + m, g1 + m, b1 + m];

    return {
        r: 255 * r,
        g: 255 * g,
        b: 255 * b
    };
}

function rgb2hsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
    let h,
    s,
    v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:     h = (g - b) / d + (g < b ? 6 : 0);
                        break;

            case g:     h = (b - r) / d + 2;
                        break;

            case b:     h = (r - g) / d + 4;
                        break;

            default:    break;
        }
        h /= 6;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

function rgb2cmyk(r, g, b) {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;

    let k = Math.min(c, m, y);
    if (k == 1) {
        return {
            c: 0,
            m: 0,
            y: 0,
            k: 1
        };
    }

    return {
        c: (c - k) / (1 - k),
        m: (m - k) / (1 - k),
        y: (y - k) / (1 - k),
        k: k
    };
}

function cmyk2rgb(c, m, y, k) {
    c = c * (1 - k) + k;
    m = m * (1 - k) + k;
    y = y * (1 - k) + k;

    let r = 1 - c;
    let g = 1 - m;
    let b = 1 - y;

    r = Math.round(255 * r);
    g = Math.round(255 * g);
    b = Math.round(255 * b);

    return {
        r: r,
        g: g,
        b: b
    };
}

function checkHueTolerance(neededHue, tolerance, currentHue) {
    if (tolerance < 0) {
        return false;
    }
    if (currentHue > 1) {
        currentHue = currentHue % 1;
    }
    if (currentHue < 0) {
        currentHue = currentHue % 1 + 1;
    }
    if (currentHue < neededHue + tolerance && currentHue > neededHue - tolerance) {
        return true;
    }
    if (neededHue + tolerance > 1) {
        if ((neededHue + tolerance) % 1 > currentHue) {
            return true;
        }
    }
    if (neededHue - tolerance < 0) {
        if ((neededHue - tolerance) % 1 + 1 < currentHue) {
            return true;
        }
    }
    return false;
}

function testHueTolerance (neededHue, tolerance) {
    var a = {0: checkHueTolerance(neededHue, tolerance, 0)};
    for (var i = 0.01; i <= 1; i += 0.01) {
        a[i] = checkHueTolerance(neededHue, tolerance, i);
    }
    console.log(a);
}

loadImageFromFile();
