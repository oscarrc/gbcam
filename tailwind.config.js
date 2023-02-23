module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      minHeight:{
        "dscreen": "100dvh"
      },
      fontFamily:{
        "title": ["Gil Sans"],
        "button": ["Nes Controller"],
        "brand": ["Pretendo"],
        "text": ["Univers"]
      },
      colors:{
        "dmg": "#BABCC1",
        "yellow": "#F1B32F",
        "red": "#E22E32",
        "black": "#000000",
        "white": "#ffffff",
        "blue": "#154D9A",
        "green": "#00B67D",
        "transparent": "#0f380f",
        "line-1": "#7B2358",
        "line-2": "#3D3E73"
      }
    }
  },
  daisyui:{
      themes: [
        {
          classic:{
            ...require("daisyui/src/colors/themes")["[data-theme=black]"],
            "primary": "#070C0B", // D-Pad
            "secondary": "#777F87", // Start - Select
            "accent": "#7B2358", // A / B
            "neutral": "#BABCC1", // Shell
            "neutral-content": "#414477", // Game Boy Text
            "base-100": "#626A7B" // Screen frame
          },
          yellow:{
            ...require("daisyui/src/colors/themes")["[data-theme=black]"],
            "primary": "#232129",
            "secondary": "#232129",
            "accent": "#232129",
            "neutral": "#F1B32F",
            "neutral-content": "#232129",
            "base-100": "#212121"  
          },
          red:{
            ...require("daisyui/src/colors/themes")["[data-theme=black]"],
            "primary": "#232129",
            "secondary": "#232129",
            "accent": "#232129",
            "neutral": "#E22E32",
            "neutral-content": "#232129",
            "base-100": "#212121"
          },
          black:{
            ...require("daisyui/src/colors/themes")["[data-theme=black]"],
            "primary": "#525457",
            "secondary": "#525457",
            "accent": "#525457",
            "neutral": "#000000",
            "neutral-content": "#782157",
            "base-100": "#626A7B"
          },
          white:{
            ...require("daisyui/src/colors/themes")["[data-theme=black]"],
            "primary": "#000000",
            "secondary": "#161A1A",
            "accent": "#000000",
            "neutral": "#ffffff",
            "neutral-content": "#000000",
            "base-100": "#000000"  
          },
          blue:{
            ...require("daisyui/src/colors/themes")["[data-theme=black]"],
            "primary": "#232129",
            "secondary": "#232129",
            "accent": "#232129",
            "neutral": "#154D9A",
            "neutral-content": "#232129",
            "base-100": "#212121"
          },
          green:{
            ...require("daisyui/src/colors/themes")["[data-theme=black]"],
            "primary": "#232129",
            "secondary": "#232129",
            "accent": "#232129",
            "neutral": "#00B67D",
            "neutral-content": "#232129",
            "base-100": "#212121"
          },
          transparent:{
            ...require("daisyui/src/colors/themes")["[data-theme=black]"],
            "primary": "#232129",
            "secondary": "#232129",
            "accent": "#232129",
            "neutral": "transparent",
            "neutral-content": "#D90D32",
            "base-100": "#212121"
          }
        }
      ]
  },
  plugins: [      
    require("daisyui")
  ]
}