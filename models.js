var canvasOrig = $("#canvasOrig")[0];
var canvasColor = $("#canvasColor")[0];
var canvasHSV = $("#canvasHSV")[0];
var canvasCMYK = $("#canvasCMYK")[0];
let image = null;

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


function loadImageFromFile() {
	let fileInput = $("#fileInput")[0];

	if (fileInput.files.length == 1) {
		let file = fileInput.files[0];
		let fileReader = new FileReader();
		image = new Image();
		fileReader.onload = function() {
			image.src = this.result;
		}
		fileReader.readAsDataURL(file);
		image.onload = function() {
			let context = canvasOrig.getContext('2d');
			canvasOrig.height = canvasOrig.clientHeight;
			canvasOrig.width = canvasOrig.clientWidth;
			context.clearRect(0, 0, canvasOrig.width, canvasOrig.height);
			context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasOrig.width, canvasOrig.height);

            changeBlueValue();
		}
	}
}

async function changeBlueValue() {
    if (image == null)
        return;

	let blueValue = $("#blueRange")[0].value;

	let RGBcolor = canvasOrig.getContext('2d').getImageData(0, 0, canvasOrig.width, canvasOrig.height);

	for (let i = 0; i < RGBcolor.data.length; i += 4) {
		RGBcolor.data[i + 2] *= (blueValue/100).toFixed(2);
	}
	canvasColor.getContext('2d').putImageData(RGBcolor, 0, 0);
}
