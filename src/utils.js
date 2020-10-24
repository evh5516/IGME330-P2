// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax

const makeColor = (red, green, blue, alpha = 1) => {
  return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getRandomColor = () => {
	const floor = 35; // so that colors are not too bright or too dark 
  const getByte = () => getRandom(floor,255-floor);
  return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
  let lg = ctx.createLinearGradient(startX,startY,endX,endY);
  for(let stop of colorStops){
    lg.addColorStop(stop.percent,stop.color);
  }
  return lg;
};


const goFullscreen = (element) => {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullscreen) {
		element.mozRequestFullscreen();
	} else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	}
	// .. and do nothing if the method is not supported
};

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const songTracker= (song, titles={}) =>{
    if (song == 'escape - Imaginary Labyrinth - 01 Imaginary Labyrinth.mp3'){
        return titles.imaginaryLabrinth;
    }
    if (song == 'escape - Imaginary Labyrinth - 02 Masks.mp3'){
        return titles.masks;
    }
    if (song == 'escape - Imaginary Labyrinth - 03 Morpheus.mp3'){
        return titles.morpheus;
    }
    if (song == 'escape - Imaginary Labyrinth - 04 Ikelos.mp3'){
        return titles.ikelos;
    }
    if (song == 'scape - Imaginary Labyrinth - 05 Gaea.mp3'){
        return titles.gaea;
    }
    if (song == 'escape - Imaginary Labyrinth - 06 Lethe.mp3'){
        return titles.lethe;
    }
    if (song == 'escape - Imaginary Labyrinth - 07 Acheron.mp3'){
        return titles.archeron;
    }
    if (song == 'escape - Imaginary Labyrinth - 08 Ouranos.mp3'){
        return titles.ouranos;
    }
    if (song == 'escape - Moving Forward.mp3'){
        return titles.movingForward;
    }
}

export {makeColor, getRandomColor, getLinearGradient, goFullscreen, shuffle, songTracker};