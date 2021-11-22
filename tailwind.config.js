module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["NotoSans", "sans-serif"],
        poker: ["ShipporiAntiqueB1", "sans-serif"],
      },
      colors: {
        "poker-red": "#DC2626",
        "poker-black": "#1F2937",
        "poker-white": "#FFFFFF",
        "poker-soft-white": "#F9FAFB",
      },
      width: {
        112: "28rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
