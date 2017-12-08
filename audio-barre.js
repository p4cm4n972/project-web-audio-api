var contexteAudio = new AudioContext();
var analyseur = contexteAudio.createAnalyser();
var myAudio = document.querySelector('audio');

var source = contexteAudio.createMediaElementSource(myAudio);
source.connect(analyseur);
analyseur.connect(contexteAudio.destination);

analyseur.fftSize = 256;
var tailleMemoireTampon = analyseur.frequencyBinCount;
var tableauDonnees = new Uint8Array(tailleMemoireTampon);

var canvas = document.getElementById('canvas-barre');
var contexteCanvas = canvas.getContext('2d');
contexteCanvas.clearRect(0, 0, 600, 300);

function dessiner() {
    dessin = requestAnimationFrame(dessiner);

    analyseur.getByteFrequencyData(tableauDonnees);

    contexteCanvas.fillStyle = 'rgb(0, 0, 0)';
    contexteCanvas.fillRect(0, 0, 600, 300);
    var largeurBarre = (300 / tailleMemoireTampon) * 2.5;
    var hauteurBarre;
    var x = 0;
    for(var i = 0; i < tailleMemoireTampon; i++) {
        hauteurBarre = tableauDonnees[i]/2;

        contexteCanvas.fillStyle = 'rgb(' + (hauteurBarre+100) + ',50,50)';
        contexteCanvas.fillRect(x,300-hauteurBarre/2,largeurBarre,hauteurBarre);

        x += largeurBarre + 1;
      }
    };
    dessiner();