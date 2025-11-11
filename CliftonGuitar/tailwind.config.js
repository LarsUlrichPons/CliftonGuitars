/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      textshadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.7)',
        'DEFAULT': '0 1px 3px rgba(0, 0, 0, 0.7)',
        'lg': '0 2px 5px rgba(0, 0, 0, 0.9)',
      },
    },
  },
  plugins: [],
}