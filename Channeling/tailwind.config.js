/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    // add custom styles in the extend section (extend:{})
    extend: {
      screens: {
        'xsm': {'min': '200px', 'max': '640px'},
      },
      colors: {
        'fontDark': '#202643',
        'lightColor': '#fff',
        'green': '#97CE4F',
        'red': '#ff4a4a',
        'blue': '#0047AB',
        'purple': '#6A19B5',
        'grey': '#C0C2C9',
        'lightgray': '#F1F1F1',
        'overlay': '#98DED999',
      
      },
      boxShadow: {
        'custom-light': '0 2px 4px rgba(0, 0, 0, 0.1)', 
        'custom-dark': '0 4px 8px rgba(0, 0, 0, 0.3)',  
        'custom-color': '0 4px 8px rgba(0, 71, 171, 0.5)', 
      },
    },

  },
  plugins: [],
}
