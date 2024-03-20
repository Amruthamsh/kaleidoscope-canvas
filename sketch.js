/* 
"The hardest choie may as well be to know when to stop!!!"
"The joy is in watching beautiful creations get made...and then unmade." 
quotes that play during the loading screen of the site and when a gif is being downloaded or being shared 
*/

// Symmetry corresponding to the number of reflections. Change the number for different number of reflections
let symmetry = 3;

let angle = 360 / symmetry;
let saveButton, clearButton, mouseButton, keyboardButton, recordButton;
let b_slider, s_slider;

let mode;
let draw_s;

// This array will contain "chunks" of the video captured by the MediaRecorder
let recording = false;
let recorder;
let chunks = [];

const fr = 30;
let canvasW, canvasH;
function setup() {
  canvasH = windowHeight * 0.75;
  canvasW = canvasH;

  h1 = createElement("h1", "Kaleidoscope Canvas");
  h1.position(20, 0);
  createButton("Brush Slider").position(20, 80);
  b_slider = createSlider(1, 32, 4, 0.1);
  b_slider.position(20, 105);

  createButton("Symmetry Slider").position(200, 80);
  s_slider = createSlider(3, 32, 1, 1);
  s_slider.position(200, 105);

  createButton("Select Mode:").position(380, 80);
  mode = createSelect();
  mode.position(380, 105);

  createButton("Brush Color:").position(560, 80);
  brushColorPicker = createColorPicker("black");
  brushColorPicker.position(560, 105);

  mode.option("Harmony Disharmony");
  mode.option("Beside one another");
  mode.option("One man army");
  mode.selected("Harmony Disharmony");
  mode.changed(mySelectEvent);
  draw_s = createVector(2, -2);

  // Creating the clear screen button
  clearButton = createButton("Refresh Canvas");
  clearButton.mousePressed(clearScreen);
  clearButton.position(20, canvasH + 200);

  createButton("Background Color:").position(140, canvasH + 200);

  bgColorPicker = createColorPicker("white");
  bgColorPicker.position(140, canvasH + 225);

  createButton("Resize Canvas Width:").position(280, canvasH + 200);
  w_slider = createSlider(canvasH / 2, windowWidth * 0.9, canvasH);
  w_slider.position(280, canvasH + 225);

  // Creating the save button for the file
  saveButton = createButton("save image");
  saveButton.mousePressed(saveFile);
  saveButton.position(480, canvasH + 200);

  recordButton = createButton("record video");
  recordButton.mousePressed(buttonRecord);
  recordButton.position(580, canvasH + 200);

  canvas = createCanvas(canvasW, canvasH);
  canvas.position(20, 150);

  frameRate(fr);
  // initialize recorder
  record();

  angleMode(DEGREES);
  background(bgColorPicker.color());
}

// Save File Function
function saveFile() {
  save("design.jpg");
}

// Clear Screen function
function clearScreen() {
  resizeCanvas(w_slider.value(), canvasH);
  background(bgColorPicker.color());
}

// Full Screen Function
function screenFull() {
  let fs = fullscreen();
  fullscreen(!fs);
}

function draw() {
  translate(width / 2, height / 2);

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;
    let pmx = pmouseX - width / 2;
    let pmy = pmouseY - height / 2;

    if (mouseIsPressed) {
      for (let i = 0; i < symmetry; i++) {
        symmetry = s_slider.value();
        angle = 360 / symmetry;

        rotate(angle);
        let sw = b_slider.value();
        stroke(brushColorPicker.color());
        strokeWeight(sw);
        line(mx, my, pmx, pmy);
        push();
        //MODES:
        //Harmony Disharmony: scale(2, -2);
        //Alongside me/Beside one another: scale(1, -1);
        //One man army: scale(0, 0);
        scale(draw_s);
        scale(2, -2);
        line(mx, my, pmx, pmy);
        pop();
      }
    }
  }
}

function mySelectEvent() {
  let item = mode.value();
  switch (item) {
    case "Harmony Disharmony":
      draw_s.set(2, -2);
      break;

    case "Beside one another":
      draw_s.set(1, -1);
      break;

    case "One man army":
      draw_s.set(0, 0);
      break;
  }

  //text('It is a ' + item + '!', 50, 50);
}

function record() {
  chunks.length = 0;

  let stream = document.querySelector("canvas").captureStream(fr);

  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (e) => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };

  recorder.onstop = exportVideo;
}

function exportVideo(e) {
  var blob = new Blob(chunks, { type: "video/webm" });

  // Download the video
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "newVid.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}

function keyPressed() {
  // toggle recording true or false
  recording = !recording;
  console.log(recording);

  // 82 is keyCode for r
  // if recording now true, start recording
  if (keyCode === 82 && recording) {
    console.log("recording started!");
    recordButton.html("stop recording");
    recorder.start();
  }

  // if we are recording, stop recording
  if (keyCode === 82 && !recording) {
    console.log("recording stopped!");
    recordButton.html("record video");
    recorder.stop();
    record();
  }
}

function buttonRecord() {
  // toggle recording true or false
  recording = !recording;
  console.log(recording);

  // if recording now true, start recording
  if (recording) {
    console.log("recording started!");
    recordButton.html("stop recording");
    recorder.start();
  }

  // if we are recording, stop recording
  if (!recording) {
    console.log("recording stopped!");
    recordButton.html("record video");
    recorder.stop();
    record();
  }
}
