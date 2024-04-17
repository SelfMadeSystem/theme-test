function color(name, type = "bg") {
  return `rgba(var(--${name}), calc(var(--tw-${type}-opacity, 1) * var(--${name}-alpha, 1)))`;
}

function colorComponent(name, simple = false) {
  return {
    DEFAULT: color(name),
    text: color(`${name}-text`, "text"),
    ...(!simple && {
      container: {
        DEFAULT: color(`${name}-container`),
        text: color(`${name}-container-text`, "text"),
      },
    }),
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: colorComponent("background", true),
        surface: colorComponent("surface", true),
        "surface-variant": colorComponent("surface-variant", true),
        primary: colorComponent("primary"),
        secondary: colorComponent("secondary"),
        tertiary: colorComponent("tertiary"),
        error: colorComponent("error"),
        outline: color("outline"),
        "outline-variant": color("outline-variant"),
        "inverse-surface": colorComponent("inverse-surface", true),
        "inverse-primary": color("inverse-primary"),
        shadow: color("shadow"),
        scrim: color("scrim"),
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      outlineWidth: {
        DEFAULT: "var(--outline-width)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
