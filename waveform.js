var audioCtx = new AudioContext();
var analyser = audioCtx.createAnalyser();
var myAudio = document.querySelector('audio');
var source = audioCtx.createMediaElementSource(myAudio);


var dataArray = new Float32Array(analyser.fftSize); // Float32Array needs to be the same length as the fftSize 

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 2048;

var tampon = analyser.frequencyBinCount;

var data = new Float32Array(source);

analyser.getFloatTimeDomainData(data);

console.log(data);

var canvas = document.getElementById('cv');
var ctx = canvas.getContext('2d');

function wave() {
analyser.getFloatTimeDomainData(data);

ctx.fillStyle = 'rgb(200, 200, 200)';
ctx.lineWidth = 2;
ctx.strokeStyle = 'rgb(0, 0, 0)';

ctx.beginPath();

var largeurSeg = 300 * 1.0 / tampon;
var x = 0;
for( var i = 0; i < tampon; i++) {

    var v = data[i] / 128.0;
    var y = v * 150/2;

    if(i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += largeurSeg;
}
}
wave()