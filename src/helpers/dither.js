// Based on https://bisqwit.iki.fi/story/howto/dither/jy/

import { palettes, variations } from "../constants/colors";

const thresholds = [
	[0,48,12,60,3,51,15,63],
	[32,16,44,28,35,19,47,31],
	[8,56,4,52,11,59,7,55],
	[40,24,36,20,43,27,39,23],
	[2,50,14,62,1,49,13,61],
	[34,18,46,30,33,17,45,29],
	[10,58,6,54,9,57,5,53],
	[42,26,38,22,41,25,37,21]
];

const clamp = (value, min, max) => value < min ? min : value > max ? max : value;

const gbDither = (imgData, brightness, contrast, dither) => {
    let data = imgData.data;

    for(let h = 0; h < imgData.height; h++) {
		for(let w = 0; w < imgData.width; w++) {
			let matrix = thresholds[h%8][w%8];
			let i = h * 4 * imgData.width + w * 4;
            
			// https://en.wikipedia.org/wiki/Grayscale
			let c = data[i] * 0.2126  + data[i+1] * 0.7152 + data[i+2] * 0.0722;
			
            c = clamp(c / 255 * (255 - contrast) + brightness, 0, 255);      
            c = clamp(c + ((matrix - 32) * dither), 0, 255);
            c = clamp(Math.round(c / 64), 0, 3) * 64;

			for(let j = 0; j < 3; j ++){            
				data[i + j] = c;
			}
        }
    }

    return imgData;
}

const convertPalette = (imgData, palette, variation = 0) => {    
    const data = imgData.data;
    
    for (let i = 0; i < data.length; i += 4) {
		let c = clamp(Math.floor(data[i] / 64), 0, 3);
		for(let j = 0; j < 3; j ++){
		    data[i + j] = palettes[palette][variations[variation][c]][j];
        }
	}

    return imgData;
}

export { gbDither, convertPalette }