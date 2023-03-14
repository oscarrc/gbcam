// Based on https://bisqwit.iki.fi/story/howto/dither/jy/

const threshold = [
	[0,48,12,60,3,51,15,63],
	[32,16,44,28,35,19,47,31],
	[8,56,4,52,11,59,7,55],
	[40,24,36,20,43,27,39,23],
	[2,50,14,62,1,49,13,61],
	[34,18,46,30,33,17,45,29],
	[10,58,6,54,9,57,5,53],
	[42,26,38,22,41,25,37,21]
];

const palettes = [
    [ // DMG
        [34, 73, 57], 
        [54, 119, 74], 
        [77, 163, 80], 
        [132, 205, 110]
    ],
    [ // GBC
		[4,2,4],
		[156,146,244],
		[236,138,140],
		[252,250,172]
	],    
    [ // Grayscale
        [40, 40, 40],
		[104, 104, 104],
		[168, 168, 168],
		[252, 252, 252]
	]
]

const gbDither = (pixels, brightness, contrast, dither) => {
    let data = pixels.data;

    for(let h = 0; h < pixels.height; h++) {
		for(let w = 0; w < pixels.width; w++) {
			let matrix = threshold[(h)%8][(w)%8];
			let i = h * 4 * pixels.width + w * 4;
            
			// https://en.wikipedia.org/wiki/Grayscale
			let c = data[i] * 0.2126  + data[i+1] * 0.7152 + data[i+2] * 0.0722;
            
            c = Math.min(Math.max(c / 255 * (255 - contrast) + brightness, 0), 255);         
            c = Math.min(Math.max(c + ((matrix - 32) * dither), 0), 255);
            c = Math.min(Math.max(Math.round(c / 64), 0),3) * 64;
            
			data[i] = c;
			data[i+1] = c;
			data[i+2] = c;
        }
    }

    return pixels;
}

const convertPalette = (pixels, palette) => {    
    const data = pixels.data;
    
    for (let i = 0; i < data.length; i += 4) {
		let c = Math.min(Math.max(Math.floor(data[i] / 64), 0), 3);
		for(let j = 0; j < 3; j ++){            
		    data[i + j] = palettes[palette][c][j];
        }
	}

    return pixels;
}

export { gbDither, convertPalette }