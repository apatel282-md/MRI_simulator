export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["\"Space Grotesk\"", "sans-serif"],
        mono: ["\"IBM Plex Mono\"", "monospace"],
      },
      colors: {
        ink: "#0b1b2b",
        ocean: "#0f4c5c",
        sand: "#f3efe6",
        pulse: "#ef4444",
        t1: "#22c55e",
        t2: "#ef4444",
        water: "#3b82f6",
        fat: "#facc15",
      },
    },
  },
  plugins: [],
};
