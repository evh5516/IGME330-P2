/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import * as audio from './audio.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;


function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:.35,color:"purple"},{percent:.70,color:"magenta"},{percent:1,color:"red"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
}

function draw(params={}){
  // 1 - populate the audioData array with the frequency data from the analyserNode
    
    if(params.showWaveform){
        // notice these arrays are passed "by reference" 
        analyserNode.getByteTimeDomainData(audioData); // waveform data
    }
    else{
        // OR
        analyserNode.getByteFrequencyData(audioData); // frequency data
    }
	
	// 2 - draw background
    ctx.save();
    ctx.fillStyle = '#1e1e1e';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();

	// 3 - draw gradient
    if (params.showGradient){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
    
    // SNOWFLAKE
    if (params.showSnowflake){
        let radius = 150;
        let bars = 200;
        let spacingNumber = 360/200;
        let centerX = canvasWidth/2;
        let centerY = canvasHeight/2;
        let frequencyArray = new Uint8Array(analyserNode.frequencyBinCount);
        let audioArray = [];
        
        ctx.save();
        ctx.globalAlpha = 0.4;
        
        //ctx.beginPath();
        //ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
        //ctx.stroke();
        
        analyserNode.getByteFrequencyData(frequencyArray);
        
        for(let i = 0; i < bars; i++){
            let rads = Math.PI * 2 / bars;
            let barWidth = 2;
            
            if (params.showLog){ // Grabbed from https://stackoverflow.com/questions/35799286/get-logarithmic-bytefrequencydata-from-audio
                let logIndex = utils.toLog(i+1, 1, bars+1); // range of 1 -> bars
                // interpolate value
                let low = Math.floor(logIndex);
                let high = Math.ceil(logIndex);
                let lv = audioData[low];
                let hv = audioData[high];
                let w = (logIndex-low)/(high-low);
                let v = lv + (hv-lv)*w; // interpolated value of the original array

                audioArray[i] = v;
            }
            else{
                audioArray[i] = audioData[i];
            }
            let barHeight = audioData[i]*(1.2);
            let x = centerX; //+ Math.cos(rads * spacingNumber) * (radius);
            let y = centerY + Math.sin(rads * spacingNumber) * (radius);
            //let xEnd = centerX + Math.cos(rads * i) * (radius + barHeight);
            //let yEnd = centerY + Math.sin(rads * i) * (radius + barHeight);
            
            //let lineColor = "rgb(" + frequency + ", " + frequency +", "+205+")";
            drawBar(x, y, barWidth, barHeight, i*spacingNumber, params.redValue, params.greenValue, params.blueValue);
            
            //console.log(audio.frequencyArray);
        }
        ctx.restore();
    }
    // CIRCLE
    if (params.showCircles){
        let radius = 100;
        let bars = 200;
        let spacingNumber = 360/bars;
        let centerX = canvasWidth/2;
        let centerY = canvasHeight/2;
        let frequencyArray = new Uint8Array(analyserNode.frequencyBinCount);
        let audioArray = [];
        
        ctx.save();
        ctx.globalAlpha = 0.4;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
        ctx.stroke();
        
        analyserNode.getByteFrequencyData(frequencyArray);
        
        for(let i = 0; i < bars; i++){
            let rads = Math.PI * 2 / bars;
            let barWidth = 2;
            
            if (params.showLog){ // Grabbed from https://stackoverflow.com/questions/35799286/get-logarithmic-bytefrequencydata-from-audio
                let logIndex = utils.toLog(i+1, 1, bars+1); // range of 1 -> bars
                // interpolate value
                let low = Math.floor(logIndex);
                let high = Math.ceil(logIndex);
                let lv = audioData[low];
                let hv = audioData[high];
                let w = (logIndex-low)/(high-low);
                let v = lv + (hv-lv)*w; // interpolated value of the original array

                audioArray[i] = v;
            }
            else{
                audioArray[i] = audioData[i];
            }
            let barHeight = audioData[i]*(0.7);
            let x = centerX + Math.cos(utils.degToRad(i*spacingNumber)) * radius;
            let y = centerY + Math.sin(utils.degToRad(i*spacingNumber)) * radius;
            
            drawBar(x, y, barWidth, barHeight, i*spacingNumber, params.redValue, params.greenValue, params.blueValue);
        }
        ctx.restore();
    }
    
    if (params.showBar){
        let bars = 200;
        let barSpacing = 4;
        let margin = 0;
        let screenWidthForBars = canvasWidth - (bars * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / bars;
        let barHeight = 200;
        let topSpacing = (canvasHeight/2) - (barHeight);
        let frequencyArray = new Uint8Array(analyserNode.frequencyBinCount);
        let audioArray = [];
        
        analyserNode.getByteFrequencyData(frequencyArray);
        
        if (params.showWaveform){
            topSpacing = (canvasHeight/2) - (barHeight);
        }
        else{
            topSpacing = (canvasHeight)- (barHeight*2);
        }
        
        ctx.save();
        
        // loop through the data and draw!
        for(let i = 0; i < bars; i++){
            
            if (params.showLog){ // Grabbed from https://stackoverflow.com/questions/35799286/get-logarithmic-bytefrequencydata-from-audio
                let logIndex = utils.toLog(i+1, 1, bars+1); // range of 1 -> bars
                // interpolate value
                let low = Math.floor(logIndex);
                let high = Math.ceil(logIndex);
                let lv = audioData[low];
                let hv = audioData[high];
                let w = (logIndex-low)/(high-low);
                let v = lv + (hv-lv)*w; // interpolated value of the original array

                audioArray[i] = v;
            }
            else{
                audioArray[i] = audioData[i];
            }
            ctx.fillStyle = "rgb(" + params.redValue + ", " + params.greenValue +", "+ params.blueValue +")";
            ctx.strokeStyle = "rgb(" + params.redValue + ", " + params.greenValue +", "+params.blueValue +")";
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioArray[i], barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioArray[i], barWidth, barHeight);
        }
        ctx.restore();
    }
    
    
    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width; // not using here
    let frequencyArray = new Uint8Array(analyserNode.frequencyBinCount);
        
    analyserNode.getByteFrequencyData(frequencyArray);
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
	
	// D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}

function drawBar(x, y, w, h, rads, red, green, blue){
    let lineColor = "rgb(" + red + ", " + green +", "+ blue +")";
    /*
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.moveTo(x2,y2);
    ctx.stroke();
    ctx.restore();*/
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(utils.degToRad(rads+90));
    ctx.fillStyle = lineColor;
    ctx.fillRect(-1*(w), -1*(h), w, h);
    ctx.restore();
    
}



export {setupCanvas,draw};