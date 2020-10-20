/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
    moodType        : '',
    showGradient    : false,
    showCircles     : true,
    showNoise       : false,
    showInvert      : false,
    showEmboss      : false
};


let calmTracks = ['escape - Imaginary Labyrinth - 02 Masks.mp3', 'escape - Imaginary Labyrinth - 06 Lethe.mp3'];
let vibeTracks = ['escape - Imaginary Labyrinth - 01 Imaginary Labyrinth.mp3', 'escape - Imaginary Labyrinth - 04 Ikelos.mp3', 'escape - Imaginary Labyrinth - 08 Ouranos.mp3'];
let sadTracks = ['escape - Moving Forward.mp3', 'escape - Imaginary Labyrinth - 03 Morpheus.mp3', 'escape - Imaginary Labyrinth - 05 Gaea.mp3', 'escape - Imaginary Labyrinth - 07 Acheron.mp3'];

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/calm/escape - Imaginary Labyrinth - 02 Masks.mp3"
});

function init(){
    audio.setupWebAudio(DEFAULTS.sound1);
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
    
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    
    
    loop();
}

function setupUI(canvasElement){
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");

    // add .onclick event to button
    fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
    };
    
    let audioControls = document.querySelector('audio');
    audioControls.onplay = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);
        
        // check if context is in suspended state (autoplay policy)
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
    };
    
    let trackName = document.querySelector('#trackName');
    //trackName.innerHTML = audioControls.currentSrc;
    
    // D - hookup track <select>
    let moodSelect = document.querySelector('#moodSelect');
    
    // add .onchange event to <select>
    moodSelect.onchange = e => {
        drawParams.moodType = e.target.value;
        if (e.target.value == 'calm'){
            calmTracks = utils.shuffle(calmTracks);
            for (let i = 0; i < calmTracks.length; i++){
                audioControls.src = 'media/calm/' + calmTracks[i];
                //trackName.innerHTML = audioControls.src;
            }
        }
        if (e.target.value == 'vibe'){
            vibeTracks = utils.shuffle(vibeTracks);
            for (let i = 0; i < calmTracks.length; i++){
                audioControls.src = 'media/vibe/' + vibeTracks[i];
                //trackName.innerHTML = audioControls.src;
            }
        }
        if (e.target.value == 'sad'){
            sadTracks = utils.shuffle(sadTracks);
            for (let i = 0; i < calmTracks.length; i++){
                audioControls.src = 'media/sad/' + sadTracks[i];
                //trackName.innerHTML = audioControls.src;
            }
        }
    };
    
    
    
    let noiseCB = document.querySelector('#noiseCB');
    // add .onchange event to <select>
    noiseCB.onchange = e => {
        if (noiseCB.checked){
            drawParams.showNoise = true;
        }
        else{
            drawParams.showNoise = false;
        }
    };
    
    let invertCB = document.querySelector('#invertCB');
    // add .onchange event to <select>
    invertCB.onchange = e => {
        if (invertCB.checked){
            drawParams.showInvert = true;
        }
        else{
            drawParams.showInvert = false;
        }
    };
    
    let embossCB = document.querySelector('#embossCB');
    // add .onchange event to <select>
    embossCB.onchange = e => {
        if (embossCB.checked){
            drawParams.showEmboss = true;
        }
        else{
            drawParams.showEmboss = false;
        }
    };
    
} // end setupUI

function loop(){
	requestAnimationFrame(loop);
	canvas.draw(drawParams);
}

export {init};