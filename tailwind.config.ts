import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import animate from 'tailwindcss-animate';

function color(name: string, type = "bg") {
  return `rgba(var(--${name}), calc(var(--tw-${type}-opacity, 1) * var(--${type}-alpha, 1) * var(--${name}-alpha, 1)))`;
}

function colorComponent(name: string, simple = false) {
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

const colors = [
  ["background", true],
  ["surface", true],
  ["surface-variant", true],
  ["primary"],
  ["secondary"],
  ["tertiary"],
  ["error"],
  ["inverse-surface", true],
] as const;

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        ...Object.fromEntries(
          colors.map((color) => [color[0], colorComponent(color[0], color[1])])
        ),
        "inverse-primary": color("inverse-primary"),
        outline: color("outline"),
        "outline-variant": color("outline-variant"),
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
  plugins: [
    animate,
    plugin(function({ addUtilities, theme }) {
      const newUtilities = {};
      colors.forEach((color) => {
        const colorName = color[0];
        newUtilities[`.preset-${colorName}`] = {
          backgroundColor: theme(`colors.${colorName}.DEFAULT`),
          color: theme(`colors.${colorName}.text`),
          backdropFilter: `blur(calc(var(--${colorName}-blur, 0px) + var(--bg-blur, 0px)))`,
        };

        if (!color[1]) {
          newUtilities[`.preset-${colorName}-container`] = {
            backgroundColor: theme(`colors.${colorName}.container.DEFAULT`),
            color: theme(`colors.${colorName}.container.text`),
            backdropFilter: `blur(calc(var(--${colorName}-container-blur, 0px) + var(--bg-blur, 0px)))`,
          };
        }
      });
      addUtilities(newUtilities);
    }),
  ],
} satisfies Config;
