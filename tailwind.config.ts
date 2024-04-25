import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import animate from "tailwindcss-animate";
import { themeComponentEntries } from "./src/theme";
import type { ComponentEntry } from "./src/theme";

function color(name: string, extraAlpha: string, type: "text" | "bg" = "bg") {
  return `rgba(var(--${name}), calc(${extraAlpha}var(--tw-${type}-opacity, 1) * var(--${type}-alpha, 1) * var(--${name}-alpha, 1)))`;
}

type ColorComponent =
  | {
      [key: string]: ColorObject;
    }
  | ColorObject;

type ColorObject = {
  DEFAULT: string;
  text: string;
  hover?: { DEFAULT: string; text: string }; // interactive
  active?: { DEFAULT: string; text: string }; // interactive
};

function colorObject(
  name: string,
  extraAlpha: string,
  interactive: boolean
): ColorObject {
  const obj: ColorObject = {
    DEFAULT: color(`${name}`, extraAlpha),
    text: color(`${name}-text`, extraAlpha, "text"),
  };

  if (interactive) {
    obj.hover = {
      DEFAULT: color(
        `${name}-hover`,
        `var(--${name}-hover-alpha, 1) * ${extraAlpha}`
      ),
      text: color(
        `${name}-hover-text`,
        `var(--${name}-hover-text-alpha, 1) * ${extraAlpha}`
      ),
    };
    obj.active = {
      DEFAULT: color(
        `${name}-active`,
        `var(--${name}-active-alpha, 1) * ${extraAlpha}`
      ),
      text: color(
        `${name}-active-text`,
        `var(--${name}-active-text-alpha, 1) * ${extraAlpha}`
      ),
    };
  }

  return obj;
}

function colorComponent(name: string, entry: ComponentEntry) {
  const interactive = entry[0];

  const result: ColorComponent = colorObject(name, "", interactive);

  if (entry.length > 1) {
    const subcomponents = entry.slice(1) as string[];
    for (const subcomponent of subcomponents) {
      const subname = `${name}-${subcomponent}`;
      result[subcomponent] = colorObject(
        subname,
        `var(--${subname}-alpha, 1) * `,
        interactive
      );
    }
  }

  return result;
}

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
      colors: Object.fromEntries(
        themeComponentEntries.map(([name, entry]) => [
          name,
          colorComponent(name, entry),
        ])
      ),
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
    plugin(function ({ addUtilities, theme }) {
      const newUtilities = {};

      newUtilities[`.preset-transition`] = {
        transitionProperty:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
        transitionDuration: "var(--transition-duration, 150ms)",
      };

      function addUtility(name: string, interactive: boolean) {
        const dotName = name.replace(/-/g, ".");
        newUtilities[`.preset-${name}`] = {
          backgroundColor: theme(`colors.${dotName}.DEFAULT`),
          color: theme(`colors.${dotName}.text`),
          backdropFilter: `blur(calc(var(--${name}-blur, 0px) + var(--bg-blur, 0px)))`,
        };

        if (interactive) {
          newUtilities[`.preset-${name}-interactive`] =
            newUtilities[".preset-transition"];
          newUtilities[`.preset-${name}-interactive:hover`] = {
            backgroundColor: theme(`colors.${dotName}.hover.DEFAULT`),
            color: theme(`colors.${dotName}.hover.text`),
            backdropFilter: `blur(calc(var(--${name}-hover-blur, var(--${name}-blur, 0px)) + var(--bg-blur, 0px)))`,
          };
          newUtilities[`.preset-${name}-interactive:active`] = {
            backgroundColor: theme(`colors.${dotName}.active.DEFAULT`),
            color: theme(`colors.${dotName}.active.text`),
            backdropFilter: `blur(calc(var(--${name}-active-blur, var(--${name}-blur, 0px)) + var(--bg-blur, 0px)))`,
          };
        }
      }

      themeComponentEntries.forEach(([name, entry]) => {
        const interactive = entry[0];
        addUtility(name, interactive);

        if (entry.length > 1) {
          const subcomponents = entry.slice(1) as string[];
          for (const subcomponent of subcomponents) {
            addUtility(`${name}-${subcomponent}`, interactive);
          }
        }
      });
      addUtilities(newUtilities);
    }),
  ],
} satisfies Config;
