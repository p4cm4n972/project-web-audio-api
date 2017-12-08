var contexteAudio = new AudioContext();
var analyseur = contexteAudio.createAnalyser();
var myAudio = document.querySelector('audio');

var source = contexteAudio.createMediaElementSource(myAudio);
source.connect(analyseur);
analyseur.connect(contexteAudio.destination);

analyseur.fftSize = 2048;
var tailleMemoireTampon = analyseur.frequencyBinCount;
var tableauDonnees = new Uint8Array(tailleMemoireTampon);
analyseur.getByteTimeDomainData(tableauDonnees);

var canvas = document.getElementById('canvas');
var contexteCanvas = canvas.getContext('2d');
contexteCanvas.clearRect(0, 0, 600, 300);

function dessiner() {
    dessin = requestAnimationFrame(dessiner);
    analyseur.getByteTimeDomainData(tableauDonnees);
    contexteCanvas.fillStyle = 'rgb(200, 200, 200)';
    contexteCanvas.fillRect(0, 0, 600, 300);
    contexteCanvas.lineWidth = 2;
    contexteCanvas.strokeStyle = 'rgb(0, 0, 0)';

    contexteCanvas.beginPath();

    var largeurSegment = 600 * 1.0 / tailleMemoireTampon;
    var x = 0;
    for(var i = 0; i < tailleMemoireTampon; i++) {
        
             var v = tableauDonnees[i] / 128.0;
             var y = v * 300/2;
     
             if(i === 0) {
               contexteCanvas.moveTo(x, y);
             } else {
               contexteCanvas.lineTo(x, y);
             }
     
             x += largeurSegment;
           }
           contexteCanvas.lineTo(canvas.width, canvas.height/2);
           contexteCanvas.stroke();

          };
          dessiner();



