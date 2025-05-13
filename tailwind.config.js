module.exports = {
  content: ["./src/**/*.{css,html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
      },
      borderRadius: {
        md: "8px",
        lg: "12px",
      },
      backdropBlur: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};
