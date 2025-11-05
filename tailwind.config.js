export default {
  content: ["./index.html", "./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        qcBg: "#0b0f0c",
        qcPanel: "#111915",
        qcBubble: "#1a2b23",
        qcAccent: "#5df0a5",
        qcAccentSoft: "#1f3a2e"
      },
      boxShadow: {
        soft: "0 12px 32px rgba(0,0,0,0.4)"
      },
      borderRadius: {
        xl2: "1rem",
        bubble: "1.25rem"
      }
    }
  },
  plugins: []
};

