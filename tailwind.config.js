/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      backgroundImage: {
        "primary-gradient": `linear-gradient(86.88deg, #7D6AFF 1.38%, #FFB86C 64.35%, #FC2872 119.91%)`,
        "secondary-gradient": `linear-gradient(86.88deg, #20E3B2 , #2cccff )`
      },

      //Chapter 10 (CSS sau chỉ dùng cho Chapter 10)
      fontFamily: {
        "body": ["DM Sans", "sans-serif"]
      },
      colors: {
        primary: '#F62682',
        secondary: '#6F5CF1'
      }
    },
  },
  plugins: [],
}