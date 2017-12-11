var context = new AudioContext();
var audioBuffer;
var sourceNode;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var gradient = ctx.createLinearGradient(0,0,0,300);
gradient.addColorStop(0,"black");
gradient.addColorStop("0.1","magenta");
gradient.addColorStop("0.2","blue");
gradient.addColorStop("0.3","green");
gradient.addColorStop("0.4","yellow");
gradient.addColorStop(.5,"red");


setupAudioNodes();
loadSound("./son.mp3");

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
    sourceNode = context.createBufferSource();
    sourceNode.connect(analyser);
    analyser.connect(javascriptNode);
    sourceNode.connect(context.destination);
}

function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
        playSound(buffer);
    }, onError);
}
request.send();
}

function playSound(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0);
}

function onError(e) {
    console.log(e);
}

ctx.clearRect(0, 0, 300, 150);

function stop () {
    console.log('stop');
    sourceNode.stop();
};
function start(sourceNode) {
    console.log('star');
    var source = context.createBufferSource();
    source.buffer = sourceNode;
    source.connect(context.destination);
    source.start();
}
javascriptNode.onaudioprocess = function() {
    var tampon = analyser.frequencyBinCount;
    var array = new Uint8Array(tampon);
    analyser.getByteFrequencyData(array);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 150);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, 300, 150);
    var largeurBarre = (150 / tampon) * 5;
    var hauteurBarreB;
    var x = 0;

    function frequence() {

        for(var i = 0; i < array.length; i++) {
            
            hauteurBarreB = array[i]/1.5;
            ctx.fillStyle = gradient;
            ctx.fillRect(x,150-hauteurBarreB/2,largeurBarre,hauteurBarreB);
    
            x += largeurBarre + 1;
          }
        };
    frequence();
    };
