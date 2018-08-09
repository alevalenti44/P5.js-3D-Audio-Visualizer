let song;
let fft;
let boxSz;
let gridSz;
let dropzone;
let pauseButton;
let playButton;
let maxBoxSz;
let minBoxSz;
let zTranslate;

/*
function preload() {
  song = loadSound('music/orangeevening.mp3');
}
*/

function setup() {
  //File drop area + play and pause buttons
  dropzone = select('#dropzone');
  pauseButton = select('#pauseButton');
  playButton = select('#playButton');
  dropzone.dragOver(highlight);
  function highlight() {
    dropzone.style('background-color', '#ccc');
  }

  dropzone.dragLeave(unHighlight);

  dropzone.drop(gotFile, unHighlight);

  //Creates the canvas
  const cnv = createCanvas(windowWidth, windowHeight, WEBGL);

  cnv.style('display', 'block');
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

  //starts up audio analyzer
  amplitude = new p5.Amplitude();
  //0.9 smoothing and 64 frequency bands
  fft = new p5.FFT(0.9, 64);
}

//This function executes when the mp3 has been dropped in the dropzone
function gotFile(file) {
  //Checks if file is mp3, if not gives error
  console.log(file.type);
  if(file.type != "audio"){
    alert("File needs to be audio");
  }else{
      song = loadSound(file.data);
      dropzone.style('visibility', 'hidden');
      pauseButton.style('display', 'inline');
      playButton.style('display', 'inline');
      playButton.mousePressed(playMusic);
      pauseButton.mousePressed(pauseMusic);
      playButton.mouseOut(colorWhite);
      pauseButton.mouseOut(colorWhite);
  }
}

function playMusic() {
  song.play();
  playButton.style('color', '#ccc');
}

function colorWhite() {
  playButton.style('color', '#fff');
  pauseButton.style('color', '#fff');
}

function pauseMusic() {
  song.stop();
  pauseButton.style('color', '#ccc');
}

function unHighlight() {
  dropzone.style('background-color', '#fff');
}

//Draws the voxelized polygon
function draw() {
  //Size of voxel sphere
  boxSz = 320;
  //Amount of voxels
  let spectrum = fft.analyze();
  //Gets level of amplitude
  let level = amplitude.getLevel();

  //console.log(level);
  //console.log(spectrum);

  //Changes amount of voxels depending on the frequency #
  ambientLight(spectrum[0]);

  for (let i = 0; i < spectrum.length; i++) {
    if (spectrum[0] == 255) {
      gridSz = 255 / 8;
    } else if (spectrum[0] == 253) {
      gridSz = 253 / 7;
    } else if (spectrum[0] == 251) {
      gridSz = 251 / 6;
    } else if (spectrum[0] == 249) {
      gridSz = 249 / 5;
    } else if (spectrum[0] == 216) {
      gridSz = 216 / 4;
    } else if (spectrum[0] == 180) {
      gridSz = 180 / 3;
    } else if (spectrum[0] == 160) {
      gridSz = 160 / 2;
    } else if (spectrum[0] == 0) {
      gridSz = 180 / 1;
    }
    maxBoxSz = spectrum[0];
    minBoxSz = spectrum[0];
  }

  zTranslate = -boxSz;
  background(0);
  translate(0, 0, zTranslate);
  push();

  //Speed of rotation
  //Increase decimals to make shape spin faster
  rotateY(frameCount  * 0.015);
  rotateZ(spectrum[0] * 0.0012);
  rotateX(frameCount  * 0.015);

  let radius = boxSz - boxSz / 10;


  //Sets up voxels
  for (let x = -boxSz + gridSz; x <= boxSz - gridSz; x += gridSz) {
    for (let y = -boxSz + gridSz; y <= boxSz - gridSz; y += gridSz) {
      for (let z = -boxSz + gridSz; z <= boxSz - gridSz; z += gridSz) {
        let d = dist(0, 0, 0, x, y, z);
        if (d > radius - gridSz && d < radius) {
          push();
          translate(x, y, z);
          normalMaterial();
          box(gridSz);
          pop();
        }
      }
    }
  }
  pop();
}
