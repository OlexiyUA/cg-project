var canvasOrig = $("#canvasOrig")[0];
var canvasColor = $("#canvasColor")[0];
let image = null;
let cords = null;
let savedData = null;

$("#blueRange").change(
    function() {
        changeBlueValue();
    }
);

$("#blueRange").mousemove(
    function() {
        changeBlueValue();
    }
);

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

$("#canvasOrig").mousedown(
    function(event) {
        cords = getMousePos(canvasOrig, events);
    }
);

$("#canvasOrig").mouseup(
    function(event) {
        let endcords = getMousePos(canvasOrig, events);
        savedData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;

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

    image = new Image();

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
	} else {
        image.src = "img/model_example.jpeg";
    }
}

async function changeBlueValue() {
    if (image == null)
        return;

	let blueValue = $("#blueRange")[0].value;

	let RGBcolor = canvasOrig.getContext('2d').getImageData(0, 0, canvasOrig.width, canvasOrig.height);

	for (let i = 0; i < RGBcolor.data.length; i += 4) {
		RGBcolor.data[i + 2] *= (blueValue / 100);
	}
	canvasColor.getContext('2d').putImageData(RGBcolor, 0, 0);
}

function hsv2rgb(hue, saturation, value) {
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
        return [0, 0, 0, 1];
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



loadImageFromFile();
