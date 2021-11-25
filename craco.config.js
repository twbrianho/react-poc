module.exports = {
  jest: {
    configure: {
      // roots: ["tests"],
      testMatch: ["tests/**/*.test.{js,jsx,ts,tsx}"],
    },
  },
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
