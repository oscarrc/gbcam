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
          
          },
          red:{
          
          },
          black:{
          
          },
          yellow:{
          
          },
          white:{

          },
          blue:{
            
          }
        }
      ]
  },
  plugins: [      
    require("daisyui")
  ]
}