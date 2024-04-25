import {
  DynamicScheme,
  TonalPalette,
  SchemeContent,
  Hct,
  argbFromHex,
} from "@material/material-color-utilities";
import { RGBColor } from "react-color";
import {
  SimpleComponent,
  InteractiveComponent,
  themeComponentEntries,
  SliceFirst,
  Theme as TwTheme,
} from "./theme";
import { argbToRGBColor, recursivelyApply } from "./utils";
import { UnitValue } from "./UnitPicker";

// this file is a mess

export type ASComponent = SimpleComponent<RGBColor, string>;
export type AIComponent = InteractiveComponent<RGBColor, string>;
export type AComponent = ASComponent | AIComponent;

function addStyle(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}
function addColorStyle(name: string, color: RGBColor) {
  addStyle(name, `${color.r}, ${color.g}, ${color.b}`);

  if (color.a !== 255) {
    addStyle(`${name}-alpha`, `${color.a}`);
  }
}

/**
 * The {@link Theme} object contains all the colors used in the app.
 *
 * All in #rrggbb format.
 */
export type Theme = {
  wallpaper?: {
    base64: string;
    url: string;
  };
  radius: UnitValue;
  globalAlpha: number;
  globalBlur: number;
  transitionDuration: number;
} & TwTheme<RGBColor, string>;

/**
 * Converts a dynamic scheme object to a theme object.
 * @param md - The dynamic scheme object.
 * @param prevTheme - The previous theme object (optional).
 * @returns The converted theme object.
 */
export function mdToTheme(md: DynamicScheme, prevTheme?: Theme): Theme {
  function tone(palette: TonalPalette, tone: number) {
    if (tone < 0 || tone > 100) {
      throw new Error("Tone must be between 0 and 100");
    }
    if (md.isDark) {
      tone = 100 - tone;
    }
    return argbToRGBColor(palette.tone(tone));
  }

  function containerEtc(palette: TonalPalette) {
    return {
      bg: tone(palette, 80),
      text: tone(palette, 20),
      hover: {
        bg: tone(palette, 75),
        text: tone(palette, 20),
      },
      active: {
        bg: tone(palette, 70),
        text: tone(palette, 20),
      },

      container: {
        bg: tone(palette, 30),
        text: tone(palette, 90),
        hover: {
          bg: tone(palette, 35),
          text: tone(palette, 90),
        },
        active: {
          bg: tone(palette, 20),
          text: tone(palette, 90),
        },
      },
    };
  }

  return {
    background: {
      bg: tone(md.neutralPalette, 90),
      text: tone(md.neutralPalette, 10),
    },

    surface: {
      bg: tone(md.neutralPalette, 90),
      text: tone(md.neutralPalette, 10),

      variant: {
        bg: tone(md.neutralPalette, 90),
        text: tone(md.neutralPalette, 20),
      },

      inverse: {
        bg: tone(md.neutralPalette, 30),
        text: tone(md.neutralPalette, 80),
      },
    },

    primary: containerEtc(md.primaryPalette),
    secondary: containerEtc(md.secondaryPalette),
    tertiary: containerEtc(md.tertiaryPalette),
    error: containerEtc(md.errorPalette),

    wallpaper: prevTheme?.wallpaper,
    radius: prevTheme?.radius ?? [0.5, "rem"],
    globalAlpha: prevTheme?.globalAlpha ?? 1,
    globalBlur: prevTheme?.globalBlur ?? 0,
    transitionDuration: prevTheme?.transitionDuration ?? 150,
  };
}

export const defaultMdColor = "#3f51b5";

export const styles = {
  "material-you-light": mdToTheme(
    new SchemeContent(Hct.fromInt(argbFromHex(defaultMdColor)), false, 0)
  ),
  "material-you-dark": mdToTheme(
    new SchemeContent(Hct.fromInt(argbFromHex(defaultMdColor)), true, 0)
  ),
  advanced: undefined,
} as const satisfies Record<string, Theme | undefined>;

export type Styles = keyof typeof styles;

export const theme = styles["material-you-light"];

/**
 * Applies the theme by adding CSS variables and styles based on the provided theme object.
 */
export function applyTheme() {
  function addFullStyle(name: string, comp: AComponent) {
    addColorStyle(`--${name}`, comp.bg);
    addColorStyle(`--${name}-text`, comp.text);

    if ("hover" in comp && "active" in comp) {
      addColorStyle(`--${name}-hover`, comp.hover.bg);
      addColorStyle(`--${name}-hover-text`, comp.hover.text);
      addColorStyle(`--${name}-active`, comp.active.bg);
      addColorStyle(`--${name}-active-text`, comp.active.text);
    }

    // TODO: Add blur and radius
  }

  for (const [name, entry] of themeComponentEntries) {
    const currentEntry = theme[name];
    addFullStyle(name, currentEntry);

    if (entry.length > 1) {
      const subcomponents = entry.slice(1) as SliceFirst<typeof entry>;
      for (const subcomponent of subcomponents) {
        const currentSubcomponent = currentEntry[
          subcomponent as keyof typeof currentEntry
        ] as unknown as AComponent; // TypeScript is a bit confused here
        addFullStyle(`${name}-${subcomponent}`, currentSubcomponent);
      }
    }
  }

  if (theme.wallpaper) {
    addStyle("--wallpaper", `url(${theme.wallpaper.url})`);
  } else {
    addStyle("--wallpaper", "none");
  }
  addStyle("--radius", theme.radius.join(""));
  addStyle("--bg-alpha", theme.globalAlpha.toString());
  addStyle("--bg-blur", `${theme.globalBlur}px`);
  addStyle("--transition-duration", `${theme.transitionDuration}ms`);
}

/**
 * Applies a new theme to the app by recursively applying the new theme to the existing theme and then applying the theme changes.
 *
 * @param newTheme - The new theme object to apply.
 * @return This function does not return anything.
 */
export function applyNewTheme(newTheme: Theme): void {
  recursivelyApply(theme, newTheme);
  applyTheme();
}
