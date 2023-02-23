module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {}
  },
  daisyui:{
      themes: [
        {
          classic:{
            "primary": "#070C0B", // D-Pad
            "secondary": "#777F87", // Start - Select
            "accent": "#7B2358", // A / B
            "neutral": "#BABCC1", // Shell
            "neutral-content": "#414477", // Game Boy Text
            "base-100": "#414477", // Line 1     
            "base-200": "#7B2358", // Line 2
            "base-300": "#626A7B" // Screen frame
          },
          yellow:{
            "primary": "#232129",
            "secondary": "#232129",
            "accent": "#232129",
            "neutral": "#F1B32F",
            "neutral-content": "#232129",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": "#212121"  
          },
          red:{
            "primary": "#232129",
            "secondary": "#232129",
            "accent": "#232129",
            "neutral": "#E22E32",
            "neutral-content": "#232129",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": "#212121"
          },
          black:{
            "primary": "#525457",
            "secondary": "#525457",
            "accent": "#525457",
            "neutral": "#000000",
            "neutral-content": "#782157",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": "#626A7B"
          },
          white:{
            "primary": "#000000",
            "secondary": "#161A1A",
            "accent": "#000000",
            "neutral": "#ffffff",
            "neutral-content": "#000000",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": "#000000"  
          },
          blue:{
            "primary": "#232129",
            "secondary": "#232129",
            "accent": "#232129",
            "neutral": "#154D9A",
            "neutral-content": "#232129",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": "#212121"
          },
          green:{
            "primary": "#232129",
            "secondary": "#232129",
            "accent": "#232129",
            "neutral": "#00B67D",
            "neutral-content": "#232129",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": "#212121"
          },
          transparent:{
            "primary": "#232129",
            "secondary": "#232129",
            "accent": "#232129",
            "neutral": "transparent",
            "neutral-content": "#D90D32",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": "#212121"
          }
        }
      ]
  },
  plugins: [      
    require("daisyui")
  ]
}