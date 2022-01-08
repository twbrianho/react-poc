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
        "poker-green": "#079668",
        "poker-black": "#1F2937",
        "poker-white": "#FFFFFF",
        "poker-soft-white": "#F9FAFB",
        "black-op50": "rgba(0, 0, 0, 0.5)",
        "black-op05": "rgba(0, 0, 0, 0.05)",
      },
      height: {
        22: "5.5rem",
      },
      width: {
        144: "36rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
