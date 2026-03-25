/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        nunito: "Nunito-Regular",
        "nunito-semibold": "Nunito-SemiBold",
        "nunito-bold": "Nunito-Bold",
      },
      // Green Colors
      colors: {
        leaf: "#588157",
        cream: "#dcd8cc",
        beige: "#a0b089",
        moss: "#385a41",
      },
    },
  },
  plugins: [],
};
