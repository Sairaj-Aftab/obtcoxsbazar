/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "primary-color": "#008080",
      "secondary-color": "#008080",
      "tertiary-color": "#008080",
      "primary-background": "#f9f9f9",
      transparent: "transparent",
      white: "#ffffff",
      black: "#000000",
      red: "#ff0000",
      green: "#008000",
      yellow: "#ffff00",
      blue: "#0000ff",
      purple: "#800080",
      orange: "#ffa500",
      cyan: "#00ffff",
      magenta: "#ff00ff",
      gray: "#808080",
      "gray-100": "#f3f4f6",
      "gray-200": "#e5e7eb",
      "gray-300": "#d1d5db",
      "gray-400": "#9ca3af",
      "gray-500": "#6b7280",
      "gray-600": "#4b5563",
      "gray-700": "#374151",
      "gray-800": "#1f2937",
      "gray-900": "#111827",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
