var song;
var fft;

//var w is width of frequency bands
var w;

var boxSz;
var gridSz;
var zoom = false;
var dropzone;
var maxBoxSz;
var minBoxSz;
var zTranslate;

/*
function preload() {
  song = loadSound('music/orangeevening.mp3');
}
*/

function setup() {
  dropzone = select('#dropzone');

  dropzone.dragOver(highlight);
  function highlight(){
    dropzone.style('background-color','#ccc');
  }

  dropzone.dragLeave(unHighlight);



  dropzone.drop(gotFile,unHighlight);



  var cnv = createCanvas(windowWidth, windowHeight, WEBGL);

    cnv.style('display', 'block');
    function windowResized() {
        resizeCanvas(windowWidth, windowHeight);
    }



  amplitude = new p5.Amplitude();
  //0.9 smoothing and 64 frequency bands
  fft = new p5.FFT(0.9, 64);
  //song.play();
  //0.9 smoothing and 64 frequency bands
  fft = new p5.FFT(0.9, 64);
}

function gotFile(file){
    song = loadSound(file.data);
    button = createButton('Play/Pause');
    button.mousePressed(pauseMusic);
    dropzone.style('visibility','hidden');


}

function unHighlight(){
    dropzone.style('background-color','#fff');

}

function pauseMusic() {
  if (song.isPlaying()) {
    song.stop();
  } else {
    song.play();
  }
}

function draw() {
  //Size of voxel sphere
  boxSz = 320;
  //Amount of voxels

  var spectrum = fft.analyze();

  var level = amplitude.getLevel();

  //console.log(level);
  //console.log(spectrum);

  ambientLight(spectrum[0]);

  for (var i = 0; i < spectrum.length; i++) {
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
  rotateY(frameCount * 0.01);
  rotateZ(frameCount * 0.0125);
  rotateX(frameCount * 0.02);

  var radius = boxSz - boxSz / 10;

  for (var x = -boxSz + gridSz; x <= boxSz - gridSz; x += gridSz) {
    for (var y = -boxSz + gridSz; y <= boxSz - gridSz; y += gridSz) {
      for (var z = -boxSz + gridSz; z <= boxSz - gridSz; z += gridSz) {
        var d = dist(0, 0, 0, x, y, z);
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
