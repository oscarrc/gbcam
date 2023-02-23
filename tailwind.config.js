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
            "primary": "#161A1A", // D-Pad
            "secondary": "#636B7B", // Start - Select
            "accent": "#782157", // A / B
            "neutral": "#BDBEC3", // Shell
            "neutral-content": "#782157", // Game Boy Text
            "base-100": "#3D3E73", // Line 1     
            "base-200": "#782157", // Line 2
            "base-300": "" // Screen frame
          },
          yellow:{
            "primary": "#161A1A",
            "secondary": "#161A1A",
            "accent": "#161A1A",
            "neutral": "#E4AC00",
            "neutral-content": "#5E6C01",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": "#212121"  
          },
          red:{
            "primary": "#161A1A",
            "secondary": "#161A1A",
            "accent": "#161A1A",
            "neutral": "#E22E32",
            "neutral-content": "#5E6C01",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": ""  
          },
          black:{
            "primary": "#161A1A",
            "secondary": "#161A1A",
            "accent": "#161A1A",
            "neutral": "#000000",
            "neutral-content": "#782157",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": ""  
          },
          white:{
            "primary": "#161A1A",
            "secondary": "#161A1A",
            "accent": "#161A1A",
            "neutral": "#ffffff",
            "neutral-content": "#5E6C01",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": ""  
          },
          blue:{
            "primary": "#161A1A",
            "secondary": "#161A1A",
            "accent": "#161A1A",
            "neutral": "#154D9A",
            "neutral-content": "#5E6C01",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": ""  
          },
          green:{
            "primary": "#161A1A",
            "secondary": "#161A1A",
            "accent": "#161A1A",
            "neutral": "#00B67D",
            "neutral-content": "#5E6C01",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": ""  
          },
          transparent:{
            "primary": "#161A1A",
            "secondary": "#161A1A",
            "accent": "#161A1A",
            "neutral": "transparent",
            "neutral-content": "#5E6C01",
            "base-100": "#3D3E73",            
            "base-200": "#782157",
            "base-300": ""  
          }
        }
      ]
  },
  plugins: [      
    require("daisyui")
  ]
}