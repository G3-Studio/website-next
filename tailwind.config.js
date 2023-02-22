/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        serif: ["var(--font-oxygen)", "serif"],
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
      colors: {
          "mainGray": "#121518",
          "mainOrange": "#FF8200",
          "mainYellow": "#FCA333",
          "textOrange": "#FC993D",
          "ytbColor": "#FF0000",
          "instaColor": "#E4405F",
          "githubColor": "#181717",
          "twitterColor": "#1DA1F2",

          "official-yellow": "#FDB814",
          "official-orange": "#FB8042",
          "official-red": "#FA485D",
          // Dark colors
          "dark-main": "#1A1C23",
          "dark-navbar": "#16181E",
          "dark-main-content": "#292C37",
          "dark-secondary-content": "#3F4455",
          "dark-main-accent": "#FB8042",
          "dark-secondary-accent": "#6C4937",
          "dark-separate": "#525971",

          // Light colors
          "light-main": "#f0f0f0",
          "light-navbar": "#ffffff",
          "light-main-content": "#292C37",
          "light-secondary-content": "#3F4455",
          "light-main-accent": "#FB8042",
          "light-secondary-accent": "#6C4937",
          "light-separate": "#525971",

      }
    },

  },
  plugins: [],
}
