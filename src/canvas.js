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
    ctx.fillStyle = 'grey';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();

	// 3 - draw gradient
    if (params.showGradient){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = params.backgroundAlpha;
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
        
        ctx.save();
        ctx.globalAlpha = 0.4;
        
        //ctx.beginPath();
        //ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
        //ctx.stroke();
        
        analyserNode.getByteFrequencyData(frequencyArray);
        
        for(let i = 0; i < bars; i++){
            let rads = Math.PI * 2 / bars;
            let barHeight = audioData[i]*(1.2);
            let barWidth = 2;
            
            let x = centerX; //+ Math.cos(rads * spacingNumber) * (radius);
            let y = centerY + Math.sin(rads * spacingNumber) * (radius);
            //let xEnd = centerX + Math.cos(rads * i) * (radius + barHeight);
            //let yEnd = centerY + Math.sin(rads * i) * (radius + barHeight);
            
            //let lineColor = "rgb(" + frequency + ", " + frequency +", "+205+")";
            drawBar(x, y, barWidth, barHeight, i*spacingNumber, frequencyArray[i]);
            
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
        
        ctx.save();
        ctx.globalAlpha = 0.4;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
        ctx.stroke();
        
        analyserNode.getByteFrequencyData(frequencyArray);
        
        for(let i = 0; i < bars; i++){
            let rads = Math.PI * 2 / bars;
            let barHeight = audioData[i]*(0.7);
            let barWidth = 2;
            
            let x = centerX + Math.cos(degToRad(i*spacingNumber)) * radius;
            let y = centerY + Math.sin(degToRad(i*spacingNumber)) * radius;
            //let xEnd = centerX + Math.cos(rads * i) * (radius + barHeight);
            //let yEnd = centerY + Math.sin(rads * i) * (radius + barHeight);
            
            //let lineColor = "rgb(" + frequency + ", " + frequency +", "+205+")";
            drawBar(x, y, barWidth, barHeight, i*spacingNumber, frequencyArray[i]);
            
            //console.log(audio.frequencyArray);
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
            //ctx.fillStyle = "rgb(" + frequencyArray[i] + ", " + frequencyArray[i] +", "+205+")";
            //ctx.strokeStyle = "rgb(" + frequencyArray[i] + ", " + frequencyArray[i] +", "+205+")";
            ctx.fillStyle = "rgb(" + params.redValue + ", " + params.greenValue +", "+ params.blueValue +")";
            ctx.strokeStyle = "rgb(" + params.redValue + ", " + params.greenValue +", "+params.blueValue +")";
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
        }
        ctx.restore();
    }
    
    /*
	// 5 - draw circles
    if(params.showCircles){
        let maxRadius = canvasHeight/3;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for(let i = 0; i < audioData.length; i++){
            // red-ish circles
            let percent = audioData[i] / 255;
            
            let circleRadius = percent * maxRadius;
            
            if (params.moodType == 'calm'){
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(51, 82, 186, 0.34 - percent/3.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.25, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                // blue-ish circles
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(150, 135, 190, 0.10 - percent/10.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                // yellow-ish circles
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(199, 110, 149, 0.5 - percent/5.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 0.75, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();
            }
            if (params.moodType == 'vibe'){
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(0, 111, 111, 0.34 - percent/3.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.25, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                // blue-ish circles
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(243, 191, 179, 0.10 - percent/10.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                // yellow-ish circles
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(203, 225, 239, 0.5 - percent/5.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 0.75, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();
            }
            if (params.moodType == 'sad'){
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(255, 111, 111, 0.34 - percent/3.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.25, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                // blue-ish circles
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(0, 0, 255, 0.10 - percent/10.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                // yellow-ish circles
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(200, 200, 0, 0.5 - percent/5.0);
                ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 0.75, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();
            }
        }
        ctx.restore();
    }*/
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
    for (let i = 0; i < length; i+=10){
		// C) randomly change every 20th pixel
	   if (params.showNoise && Math.random() < .05){
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
          
            data[i] = data[i+1] = data[i+2] = 0; // zero out the red and green and blue channels
            data[i+1] = 150; 
            data[i+2] = 220;
           
		} // end if
        
	} // end for
	
	// D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}

function drawBar(x, y, w, h, rads, frequency){
    let lineColor = "rgb(" + frequency/2 + ", " + frequency*2 +", "+ frequency +")";
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
    ctx.rotate(degToRad(rads+90));
    ctx.fillStyle = lineColor;
    ctx.fillRect(-1*(w), -1*(h), w, h);
    ctx.restore();
    
}

function degToRad(deg){
  return deg * Math.PI / 180;
}

export {setupCanvas,draw};