const COLORS = {
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

const MODELS = ["classic", "yellow", "red", "black", "white", "blue", "green", "transparent"];

const PALETTES = [
    [[34, 73, 57],[54, 119, 74],[77, 163, 80],[132, 205, 110]], // DMG,
    [[0,0,0],[131,49,0],[254,173,99],[255,255,255]],   //UP  -  GBC1
    [[0,0,0],[148,58,58],[253,133,13],[255,255,255]],   //UP + A  -  GBC2
    [[91,49,9],[132,106,39],[206,156,133],[255,231,197]],   //UP + B  -  GBC3
    [[0,0,0],[147,148,254],[254,148,148],[255,255,165]],    //DOWN  -  GBC4
    [[0,0,0],[255,0,0],[255,255,0],[255,255,255]],  //DOWN + A  -  GBC5
    [[0,0,0],[125,73,0],[255,255,0],[255,255,255]], //DOWN + B  -  GBC6
    [[0,0,0],[0,0,254],[101,164,165],[255,255,255]],    //LEFT  -  GBC7
    [[0,0,0],[83,82,140],[139,140,222],[255,255,255]],  //LEFT + A  -  GBC8
    [[0,0,0],[82,82,82],[165,165,165],[255,255,255]],   //LEFT + B  -  GBC9
    [[0,0,0],[255,66,0],[81,255,0],[255,255,255]],    //RIGHT  -  GBC10
    [[0,0,0],[1,99,198],[81,255,0],[255,255,255]],  //RIGHT + A  -  GBC11
    [[255,255,255],[255,222,0],[0,132,134],[0,0,0]],    //RIGHT + B  -  GBC12
    [[40, 40, 40],[104, 104, 104], [168, 168, 168],[252, 252, 252]] // Gray
]

const PALETTE_NAMES = ["DMG", "GBC 1", "GBC 2", "GBC 3", "GBC 4", "GBC 5", "GBC 6", "GBC 7", "GBC 8", "GBC 9", "GBC 10", "GBC 11", "GBC 12", "Gray"];

const VARIATIONS = [
	[0,1,2,3],
	[3,2,1,0],
	[0,2,1,3],
	[3,1,2,0],
	[0,2,3,1],
	[3,0,1,2]
]

export { COLORS, MODELS, PALETTES, PALETTE_NAMES, VARIATIONS };