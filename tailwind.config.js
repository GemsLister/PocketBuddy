/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        nunito: "Nunito-Regular",
        "nunito-semibold": "Nunito-SemiBold",
        "nunito-bold": "Nunito-Bold",
      },
    },
  },
  plugins: [],
};
