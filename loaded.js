var context = new AudioContext();
var audioBuffer;
var sourceNode;
var resume = context.currentTime;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var gradient = ctx.createLinearGradient(0,0,0,300);
//

var cv = document.getElementById('canvas-spectre');
var contexte = cv.getContext('2d');


var tempCanvas = document.createElement("canvas"),
tempCtx = tempCanvas.getContext("2d");
tempCanvas.width=300;
tempCanvas.height=150;
//
gradient.addColorStop(0,"black");
gradient.addColorStop("0.1","magenta");
gradient.addColorStop("0.2","blue");
gradient.addColorStop("0.3","green");
gradient.addColorStop("0.4","yellow");
gradient.addColorStop(.5,"red");


setupAudioNodes();
var url = "./freestyleDamso.opus";

function setupAudioNodes () {
    console.log('setup');
    // setup a javascript node
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);

    // setup a analyzer
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 512;

    // create a buffer source node
    
}

function loadSound(resume) {
 console.log('load : ' + resume);
 
    sourceNode = context.createBufferSource();
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

request.onload = function() {
 console.log('ONload : ' + resume);
 
    var audioData = request.response;
    context.decodeAudioData(audioData, function(buffer) {
        playSound(buffer);
    }, onError);
}
request.send();
}

function playSound(buffer) {
 console.log('play : ' + resume);
 
    sourceNode.buffer = buffer;
    sourceNode.connect(analyser);
    analyser.connect(javascriptNode);
    sourceNode.connect(context.destination);
    sourceNode.start(0);
}

function onError(e) {
    console.log(e);
}

ctx.clearRect(0, 0, 300, 150);

function stop () {
    sourceNode.stop();
    resume = context.currentTime;
 console.log('stop: ' + resume);
 return resume;
};
function start(resume) {
 console.log(resume); 
    console.log('star');
   loadSound();
}
javascriptNode.onaudioprocess = function() {
    var tampon = analyser.frequencyBinCount;
    var array1 = new Uint8Array(tampon);
    var array2 = new Uint8Array(tampon);
    analyser.getByteFrequencyData(array1);
    analyser.getByteTimeDomainData(array2);
    ctx.fillStyle = gradient;
    contexte.fillStyle= 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, 300, 150);
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, 300, 150);
    var largeurBarre = (150 / tampon) * 10;
    var hauteurBarreB;
    var x = 0;
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, 300, 150);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    
    ctx.beginPath();
    var segment = 300 * 1.0 / array1.length;
    var w = 0;
    //spectre
    var cv = document.getElementById("canvas-spectre");
    tempCtx.drawImage(cv, 0, 0, 300, 150);

    function frequence() {

        for(var i = 0; i < tampon; i++) {
            
            hauteurBarreB = array1[i]/1.5;
            ctx.fillStyle = gradient;
            ctx.fillRect(x,150-hauteurBarreB/2,largeurBarre,hauteurBarreB);
            x += largeurBarre + 1;
//
            var v = array2[i] / 128.0;
            var z = v * 150 / 2;
            if(i === 0) {
                ctx.moveTo(w, z);
              } else {
                ctx.lineTo(w, z);
              }
              w += segment;
              //
              var value = array1[i];
              contexte.fillStyle = 'rgb('+ (value) + ', 0, 0)';
              contexte.fillRect(300 - 1, 150 - i, 1, 1);
          }
          ctx.lineTo(canvas.width, canvas.height/2);
          ctx.stroke();
          //
          contexte.translate(-1, 0);
          contexte.drawImage(tempCanvas, 0, 0, 300, 150, 0, 0, 300, 150);

          contexte.setTransform(1, 0, 0, 1, 0, 0)
    };
    frequence();

    };
