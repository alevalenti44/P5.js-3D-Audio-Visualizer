var song;
var fft;

//var w is width of frequency bands
var w;

var boxSz;
var gridSz;
var oscillate = false;
var zoom = false;

var maxBoxSz;
var minBoxSz;
var zTranslate;

function preload() {
  song = loadSound('music/orangeevening.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  button = createButton('Play/Pause');
  button.mousePressed(pauseMusic);

  amplitude = new p5.Amplitude();
  //0.9 smoothing and 64 frequency bands
  fft = new p5.FFT(0.9, 64);
  //song.play();
  //0.9 smoothing and 64 frequency bands
  fft = new p5.FFT(0.9, 64);
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
  console.log(level);
  console.log(spectrum);


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
    }else if (spectrum[0] == 160) {
      gridSz = 160 / 2;
    }else if (spectrum[0] == 0) {
      gridSz = 180 / 1;
    }
      maxBoxSz = spectrum[0];
      minBoxSz = spectrum[0];
  }



  zTranslate = -boxSz;

  //width of bands is equal to width of window divided by number of bands.
  w = width / 64;
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
          box(gridSz);
          pop();
            normalMaterial();
        }
      }
    }
  }
  pop();
}

/*
var song;
var fft;

//var w is width of frequency bands
var w;

function preload(){
    song = loadSound("music/sadjuke.mp3");
}

function setup() {
    createCanvas(600,600);
    colorMode(HSB);
    colorMode(DEGREES);
    `();

    //0.9 smoothing and 64 frequency bands
    fft = new p5.FFT(0.9,64);

    //width of bands is equal to width of window divided by number of bands.
    w = width/64;
}

function draw(){
    background(0);
    var spectrum = fft.analyze();
    for(var i =0; i<spectrum.length; i++){
        var amp = spectrum[i];
        var y = map(amp,0,255,height,0);
        fill(i,255,255);
        //w-2 makes space between the rectangle bars
        rect(i*w,y,w-2,height-y);
    }
    //stroke(255);
    noStroke();
    //console.log(spectrum);
}
*/
