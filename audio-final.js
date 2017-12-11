var contexteAudio = new AudioContext();
var analyseurF = contexteAudio.createAnalyser();
var analyseurB = contexteAudio.createAnalyser();
var myAudio = document.querySelector('audio');

var source = contexteAudio.createMediaElementSource(myAudio);
source.connect(analyseurF);
analyseurF.connect(analyseurB);
analyseurB.connect(contexteAudio.destination);

analyseurF.fftSize = 2048;
analyseurB.fftSize = 256;

var tailleMemoireTamponB = analyseurB.frequencyBinCount;
var tailleMemoireTamponF = analyseurF.frequencyBinCount;


var tableauDonneesB = new Uint8Array(tailleMemoireTamponB);
var tableauDonneesF = new Uint8Array(tailleMemoireTamponF);

analyseurF.getByteTimeDomainData(tableauDonneesF);
console.log(tableauDonneesF);

var canvasF = document.getElementById('canvas');
var contexteCanvasF = canvasF.getContext('2d');
contexteCanvasF.clearRect(0, 0, 300, 150);

function frequence() {
  dessin = requestAnimationFrame(frequence);
  analyseurF.getByteTimeDomainData(tableauDonneesF);
    contexteCanvasF.fillStyle = 'rgb(200, 200, 200)';
    contexteCanvasF.fillRect(0, 0, 300, 150);
    contexteCanvasF.lineWidth = 2;
    contexteCanvasF.strokeStyle = 'rgb(0, 0, 0)';

    contexteCanvasF.beginPath();

    var largeurSegmentF = 300 * 1.0 / tailleMemoireTamponF;
    var x = 0;
    for(var i = 0; i < tailleMemoireTamponF; i++) {
        
             var v = tableauDonneesF[i] / 128.0;
             var y = v * 150/2;
     
             if(i === 0) {
               contexteCanvasF.moveTo(x, y);
             } else {
               contexteCanvasF.lineTo(x, y);
             }
     
             x += largeurSegmentF;
           }
           contexteCanvasF.lineTo(canvasF.width, canvasF.height/2);
           contexteCanvasF.stroke();

          };
          frequence();

          var canvasB = document.getElementById('canvas-barre');
          var contexteCanvasB = canvasB.getContext('2d');
          contexteCanvasB.clearRect(0, 0, 300, 150);
          
          function dessiner() {
              dessin = requestAnimationFrame(dessiner);
          
              analyseurB.getByteFrequencyData(tableauDonneesB);
          
              contexteCanvasB.fillStyle = 'rgb(0, 0, 0)';
              contexteCanvasB.fillRect(0, 0, 300, 150);
              var largeurBarreB = (150 / tailleMemoireTamponB) * 5;
              var hauteurBarreB;
              var x = 0;
              for(var i = 0; i < tailleMemoireTamponB; i++) {
                  hauteurBarreB = tableauDonneesB[i]/2;
                  contexteCanvasB.fillStyle = 'rgb(' + (hauteurBarreB+100) + ','+(hauteurBarreB+ 50) +',50)';
                  contexteCanvasB.fillRect(x,150-hauteurBarreB/2,largeurBarreB,hauteurBarreB);
          
                  x += largeurBarreB + 1;
                }
              };
              dessiner();
