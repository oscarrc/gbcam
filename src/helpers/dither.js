const matrix = [
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
    // DMG
    [
        [34, 73, 57], 
        [54, 119, 74], 
        [77, 163, 80], 
        [132, 205, 110]
    ],
    // GBC
    [ 
		[4,2,4],
		[156,146,244],
		[236,138,140],
		[252,250,172]
	],    
    // Grayscale
    [
		[40, 40, 40],
		[104, 104, 104],
		[168, 168, 168],
		[252, 252, 252]
	]
]

const levels = (current, brightness, contrast, gamma) => {
    let value = current / 255.0;
	value = (value - 0.5) * contrast + 0.5;
	value = value + brightness;
	return Math.pow(Math.min(Math.max(value, 0), 1), gamma) * 255;
}

const gbDither = (canvas, brightness, contrast, gamma, dither) => {
    const imgData = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
    let pixels = imgData;
    let data = pixels.data;
    
    for(let y = 0; y < pixels.height; y++) {
		for(let x = 0; x < pixels.width; x++) {
            let n = (x + y*pixels.width);
			let i = n * 4;

			let bayer = matrix[(y)%8][(x)%8];

			let r = data[i];
			let g = data[i+1];
			let b = data[i+2];

			// grayscale
			let c = r*0.3 + g*0.59 + b*0.11;

			// apply levels
			// c = Math.min(Math.max(levels(c, brightness, contrast, gamma), 0), 255);
            
			// apply bayer
            c = Math.min(Math.max(c + ((bayer - 32) * dither), 0), 255);

			// quantize to four places which will determine palette color
            c = Math.min(Math.max(Math.round(c / 64), 0),3) * 64

			data[i] = c;
			data[i+1] = c;
			data[i+2] = c;
        }
    }

    return pixels;
}

const convertPalette = (canvas, palette) => {    
    const imgData = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
    let pixels = imgData;
    let data = pixels.data;

    for (let i = 0; i < data.length; i += 4) {
		let c = Math.min(Math.max(Math.floor(data[i] / 64), 0), 3);
		
		let r,g,b;
		[r, g, b] = palettes[palette][c];

		data[i] = r;
		data[i+1] = g;
		data[i+2] = b;
	}

    return pixels;
}

export { gbDither, convertPalette }