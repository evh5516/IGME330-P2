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
    moodType        : 'calm',
    showGradient    : true,
    showCircles     : true,
    showSnowflake   : false,
    showBar         : false,
    showWaveform    : true,
    showNoise       : false,
    redValue        : 100,
    greenValue      : 20,
    blueValue       : 200
};
/* // TRACK LIST 
const songID = {
    imaginaryLabrinth   : 'escape - Imaginary Labyrinth - 01 Imaginary Labyrinth.mp3',
    masks               : 'escape - Imaginary Labyrinth - 02 Masks.mp3',
    morpheus            : 'escape - Imaginary Labyrinth - 03 Morpheus.mp3',
    ikelos              : 'escape - Imaginary Labyrinth - 04 Ikelos.mp3',
    gaea                : 'escape - Imaginary Labyrinth - 05 Gaea.mp3',
    lethe               : 'escape - Imaginary Labyrinth - 06 Lethe.mp3',
    archeron            : 'escape - Imaginary Labyrinth - 07 Acheron.mp3',
    ouranos             : 'escape - Imaginary Labyrinth - 08 Ouranos.mp3',
    movingForward       : 'escape - Moving Forward.mp3'
}*/

const songTitle = {
    imaginaryLabrinth   : 'Escape - Imaginary Labrinth',
    masks               : 'Escape - Masks',
    morpheus            : 'Escape - Morpheus',
    ikelos              : 'Escape - Ikelos',
    gaea                : 'Escape - Gaea',
    lethe               : 'Escape - Lethe',
    archeron            : 'Escape - Archeron',
    ouranos             : 'Escape - Ouranos',
    movingForward       : 'Escape - Moving Forward'
}


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
    let trackCB = document.querySelector('#trackCB');
    let trackName = document.querySelector('#trackName');
    let trackHolder = utils.songTracker(calmTracks[0], songTitle);
    trackName.innerHTML = trackHolder;
    
    
    
    // D - hookup track <select>
    let moodSelect = document.querySelector('#moodSelect');
    
    // add .onchange event to <select>
    moodSelect.onchange = e => {
        drawParams.moodType = e.target.value;
        if (e.target.value == 'calm'){
            calmTracks = utils.shuffle(calmTracks);
            for (let i = 0; i < calmTracks.length; i++){
                audioControls.src = 'media/calm/' + calmTracks[i];
                trackHolder = utils.songTracker(calmTracks[i], songTitle);
                if (trackCB.checked){
                    trackName.innerHTML = trackHolder;
                }
            }
        }
        if (e.target.value == 'vibe'){
            vibeTracks = utils.shuffle(vibeTracks);
            for (let i = 0; i < calmTracks.length; i++){
                audioControls.src = 'media/vibe/' + vibeTracks[i];
                trackHolder = utils.songTracker(vibeTracks[i], songTitle);
                if (trackCB.checked){
                    trackName.innerHTML = trackHolder;
                }
            }
        }
        if (e.target.value == 'sad'){
            sadTracks = utils.shuffle(sadTracks);
            for (let i = 0; i < calmTracks.length; i++){
                audioControls.src = 'media/sad/' + sadTracks[i];
                trackHolder = utils.songTracker(sadTracks[i], songTitle);
                if (trackCB.checked){
                    trackName.innerHTML = trackHolder;
                }
            }
        }
    };
    
    let circleRB = document.querySelector('#showCircle');
    // add .onchange event to <select>
    circleRB.onchange = e => {
        if (circleRB.checked){
            drawParams.showCircles = true;
            drawParams.showSnowflake = false;
            drawParams.showBar = false;
        }
        else{
            drawParams.showCircles = false;
        }
    };
    
    let snowflakeRB = document.querySelector('#showSnowflake');
    // add .onchange event to <select>
    snowflakeRB.onchange = e => {
        if (snowflakeRB.checked){
            drawParams.showSnowflake = true;
            drawParams.showCircles = false;
            drawParams.showBar = false;
        }
        else{
            drawParams.showSnowflake = false;
        }
    };
    
    let barRB = document.querySelector('#showBar');
    // add .onchange event to <select>
    barRB.onchange = e => {
        if (barRB.checked){
            drawParams.showBar = true;
            drawParams.showSnowflake = false;
            drawParams.showCircles = false;
        }
        else{
            drawParams.showSnowflake = false;
        }
    };
    
    let waveformCB = document.querySelector('#waveformCB');
    // add .onchange event to <select>
    waveformCB.onchange = e => {
        if (waveformCB.checked){
            drawParams.showWaveform = true;
        }
        else{
            drawParams.showWaveform = false;
        }
    };
    
    if (trackCB.checked){
        trackName.innerHTML = trackHolder;
    }
    
    // add .onchange event to <select>
    trackCB.onchange = e => {
        if (trackCB.checked){
            trackName.innerHTML = trackHolder;
        }
        else{
            trackName.innerHTML = "";
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
    
    let redSlider = document.querySelector('#redSlider');
    
    redSlider.onchange = e => {
        drawParams.redValue = e.value;
    };
    
    let greenSlider = document.querySelector('#greenSlider');
    
    greenSlider.oninput = e => {
        drawParams.greenValue = e.value;
    };
    
    let blueSlider = document.querySelector('#blueSlider');
    
    blueSlider.oninput = e => {
        drawParams.blueValue = e.value;
    };
    
} // end setupUI

function loop(){
	requestAnimationFrame(loop);
	canvas.draw(drawParams);
}

export {init};