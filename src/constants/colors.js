const colors = {
    "classic": "#BABCC1",
    "yellow": "#F1B32F",
    "red": "#E22E32",
    "black": "#000000",
    "white": "#ffffff",
    "blue": "#154D9A",
    "green": "#00B67D",
    "transparent": "#1D5A33",
    "display": "#224939",
    "line-1": "#7B2358",
    "line-2": "#3D3E73"
}

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

const variations = [
	[0,1,2,3],
	[3,2,1,0],
	[0,2,1,3],
	[3,1,2,0],
	[0,2,3,1],
	[3,0,1,2]
]

export { colors, palettes, variations };