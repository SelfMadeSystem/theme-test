import { useEffect, useState } from "react";
import {
  argbFromHex,
  themeFromSourceColor,
  Scheme,
} from "@material/material-color-utilities";
import ColorPicker from "./ColorPicker";
import { RGBColor } from "react-color";

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
 * Converts argb number to RGBColor.
 */
function argbToRGBColor(argb: number): RGBColor {
  return {
    r: (argb >> 16) & 0xff,
    g: (argb >> 8) & 0xff,
    b: argb & 0xff,
    a: (argb >> 24) & 0xff,
  };
}

/**
 * Converts RGBColor to an argb number.
 */
function rgbColorToArgb(color: RGBColor): number {
  // color.a is [0, 1], but we need [0, 255]
  const a = Math.round((color.a ?? 1) * 255);
  return (a << 24) | (color.r << 16) | (color.g << 8) | color.b;
}

/**
 * Converts a hex color to an RGBColor.
 */
function hexToRGBColor(hex: string): RGBColor {
  hex = hex.replace(/^#/, "");
  switch (hex.length) {
    case 3:
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    case 4:
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: parseInt(hex[3] + hex[3], 16),
      };
    case 6:
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    case 8:
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: parseInt(hex.slice(6, 8), 16),
      };
    default:
      throw new Error("Invalid hex color");
  }
}

/**
 * The {@link Theme} object contains all the colors used in the app.
 *
 * All in #rrggbb format.
 */
type Theme = {
  background: RGBColor;
  backgroundText: RGBColor;

  surface: RGBColor;
  surfaceText: RGBColor;
  surfaceVariant: RGBColor;
  surfaceVariantText: RGBColor;

  primary: RGBColor;
  primaryText: RGBColor;
  primaryContainer: RGBColor;
  primaryContainerText: RGBColor;

  secondary: RGBColor;
  secondaryText: RGBColor;
  secondaryContainer: RGBColor;
  secondaryContainerText: RGBColor;

  tertiary: RGBColor;
  tertiaryText: RGBColor;
  tertiaryContainer: RGBColor;
  tertiaryContainerText: RGBColor;

  error: RGBColor;
  errorText: RGBColor;
  errorContainer: RGBColor;
  errorContainerText: RGBColor;

  outline: RGBColor;
  outlineVariant: RGBColor;

  shadow: RGBColor;
  scrim: RGBColor;
  inverseSurface: RGBColor;
  inverseOnSurface: RGBColor;
  inversePrimary: RGBColor;

  wallpaper: string;
  radius: string;
};

function mdToTheme(md: Scheme): Theme {
  return {
    background: argbToRGBColor(md.background),
    backgroundText: argbToRGBColor(md.onBackground),

    surface: argbToRGBColor(md.surface),
    surfaceText: argbToRGBColor(md.onSurface),
    surfaceVariant: argbToRGBColor(md.surfaceVariant),
    surfaceVariantText: argbToRGBColor(md.onSurfaceVariant),

    primary: argbToRGBColor(md.primary),
    primaryText: argbToRGBColor(md.onPrimary),
    primaryContainer: argbToRGBColor(md.primaryContainer),
    primaryContainerText: argbToRGBColor(md.onPrimaryContainer),

    secondary: argbToRGBColor(md.secondary),
    secondaryText: argbToRGBColor(md.onSecondary),
    secondaryContainer: argbToRGBColor(md.secondaryContainer),
    secondaryContainerText: argbToRGBColor(md.onSecondaryContainer),

    tertiary: argbToRGBColor(md.tertiary),
    tertiaryText: argbToRGBColor(md.onTertiary),
    tertiaryContainer: argbToRGBColor(md.tertiaryContainer),
    tertiaryContainerText: argbToRGBColor(md.onTertiaryContainer),

    error: argbToRGBColor(md.error),
    errorText: argbToRGBColor(md.onError),
    errorContainer: argbToRGBColor(md.errorContainer),
    errorContainerText: argbToRGBColor(md.onErrorContainer),

    outline: argbToRGBColor(md.outline),
    outlineVariant: argbToRGBColor(md.outlineVariant),

    shadow: argbToRGBColor(md.shadow),
    scrim: argbToRGBColor(md.scrim),
    inverseSurface: argbToRGBColor(md.inverseSurface),
    inverseOnSurface: argbToRGBColor(md.inverseOnSurface),
    inversePrimary: argbToRGBColor(md.inversePrimary),

    wallpaper: "",
    radius: "0.5rem",
  };
}

const defaultMdColor = "#3f51b5";

const styles = {
  "material-light": mdToTheme(Scheme.light(argbFromHex(defaultMdColor))),
  "material-dark": mdToTheme(Scheme.dark(argbFromHex(defaultMdColor))),
  advanced: undefined,
} as const satisfies Record<string, Theme | undefined>;

type Styles = keyof typeof styles;

export default function Theming() {
  const [style, setStyle] = useState<Styles>("material-light");
  const [mdSourceColor, setMdSourceColor] = useState(hexToRGBColor(defaultMdColor));
  const [theme, setTheme] = useState<Theme>(styles["material-light"]);

  function applyTheme(newTheme?: Theme) {
    const currentTheme = newTheme ?? theme;
    addColorStyle("--background", currentTheme.background);
    addColorStyle("--background-text", currentTheme.backgroundText);

    addColorStyle("--surface", currentTheme.surface);
    addColorStyle("--surface-text", currentTheme.surfaceText);
    addColorStyle("--surface-variant", currentTheme.surfaceVariant);
    addColorStyle("--surface-variant-text", currentTheme.surfaceVariantText);

    addColorStyle("--primary", currentTheme.primary);
    addColorStyle("--primary-text", currentTheme.primaryText);
    addColorStyle("--primary-container", currentTheme.primaryContainer);
    addColorStyle(
      "--primary-container-text",
      currentTheme.primaryContainerText
    );

    addColorStyle("--secondary", currentTheme.secondary);
    addColorStyle("--secondary-text", currentTheme.secondaryText);
    addColorStyle("--secondary-container", currentTheme.secondaryContainer);
    addColorStyle(
      "--secondary-container-text",
      currentTheme.secondaryContainerText
    );

    addColorStyle("--tertiary", currentTheme.tertiary);
    addColorStyle("--tertiary-text", currentTheme.tertiaryText);
    addColorStyle("--tertiary-container", currentTheme.tertiaryContainer);
    addColorStyle(
      "--tertiary-container-text",
      currentTheme.tertiaryContainerText
    );

    addColorStyle("--error", currentTheme.error);
    addColorStyle("--error-text", currentTheme.errorText);
    addColorStyle("--error-container", currentTheme.errorContainer);
    addColorStyle("--error-container-text", currentTheme.errorContainerText);

    addColorStyle("--outline", currentTheme.outline);
    addColorStyle("--outline-variant", currentTheme.outlineVariant);

    addColorStyle("--shadow", currentTheme.shadow);
    addColorStyle("--scrim", currentTheme.scrim);
    addColorStyle("--inverse-surface", currentTheme.inverseSurface);
    addColorStyle("--inverse-surface-text", currentTheme.inverseOnSurface);
    addColorStyle("--inverse-primary", currentTheme.inversePrimary);

    if (currentTheme.wallpaper) {
      addStyle("--wallpaper", `url(${currentTheme.wallpaper})`);
    }
    addStyle("--radius", `${currentTheme.radius}`);

    if (newTheme) {
      setTheme(newTheme);
    }
  }

  function applyMarkdownTheme() {
    const sourceColor = rgbColorToArgb(mdSourceColor);
    const mdTheme = themeFromSourceColor(sourceColor);

    const scheme =
      style === "material-dark" ? mdTheme.schemes.dark : mdTheme.schemes.light;

    const newTheme = mdToTheme(scheme);

    applyTheme(newTheme);
  }

  useEffect(() => {
    if (style === "material-light" || style === "material-dark") {
      applyMarkdownTheme();
    }
  }, [mdSourceColor, style]);

  return (
    <div className="text-foreground">
      <h1 className="text-4xl font-bold text-center">Theming</h1>
      <p className="text-lg text-center">
        This is a React app with Tailwind CSS.
      </p>
      <div className="flex flex-col gap-4 items-center">
        <label className="flex flex-row gap-2 items-center">
          Style:
          <select
            className="bg-primary-container text-primary-container-text"
            value={style}
            onChange={(e) => setStyle(e.target.value as Styles)}
          >
            {Object.keys(styles).map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>
        {(style === "material-dark" || style === "material-light") && (
          <div>
            <label className="flex flex-row items-center gap-2">
              Source color:{" "}
              <ColorPicker
                color={mdSourceColor}
                onChange={(color) => setMdSourceColor(color.rgb)}
                disableAlpha={true}
              />
            </label>
          </div>
        )}
        {style === "advanced" && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface outline outline-outline p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Background:{" "}
                <ColorPicker
                  color={theme.background}
                  onChange={(color) =>
                    applyTheme({ ...theme, background: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Background text:{" "}
                <ColorPicker
                  color={theme.backgroundText}
                  onChange={(color) =>
                    applyTheme({ ...theme, backgroundText: color.rgb })
                  }
                />
              </label>
            </div>
            <div className="bg-surface outline outline-outline p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Surface:{" "}
                <ColorPicker
                  color={theme.surface}
                  onChange={(color) =>
                    applyTheme({ ...theme, surface: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Surface text:{" "}
                <ColorPicker
                  color={theme.surfaceText}
                  onChange={(color) =>
                    applyTheme({ ...theme, surfaceText: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Surface variant:{" "}
                <ColorPicker
                  color={theme.surfaceVariant}
                  onChange={(color) =>
                    applyTheme({ ...theme, surfaceVariant: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Surface variant text:{" "}
                <ColorPicker
                  color={theme.surfaceVariantText}
                  onChange={(color) =>
                    applyTheme({ ...theme, surfaceVariantText: color.rgb })
                  }
                />
              </label>
            </div>
            <div className="bg-surface outline outline-outline p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Primary:{" "}
                <ColorPicker
                  color={theme.primary}
                  onChange={(color) =>
                    applyTheme({ ...theme, primary: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Primary text:{" "}
                <ColorPicker
                  color={theme.primaryText}
                  onChange={(color) =>
                    applyTheme({ ...theme, primaryText: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Primary container:{" "}
                <ColorPicker
                  color={theme.primaryContainer}
                  onChange={(color) =>
                    applyTheme({ ...theme, primaryContainer: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Primary container text:{" "}
                <ColorPicker
                  color={theme.primaryContainerText}
                  onChange={(color) =>
                    applyTheme({ ...theme, primaryContainerText: color.rgb })
                  }
                />
              </label>
            </div>
            <div className="bg-surface outline outline-outline p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Secondary:{" "}
                <ColorPicker
                  color={theme.secondary}
                  onChange={(color) =>
                    applyTheme({ ...theme, secondary: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Secondary text:{" "}
                <ColorPicker
                  color={theme.secondaryText}
                  onChange={(color) =>
                    applyTheme({ ...theme, secondaryText: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Secondary container:{" "}
                <ColorPicker
                  color={theme.secondaryContainer}
                  onChange={(color) =>
                    applyTheme({ ...theme, secondaryContainer: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Secondary container text:{" "}
                <ColorPicker
                  color={theme.secondaryContainerText}
                  onChange={(color) =>
                    applyTheme({ ...theme, secondaryContainerText: color.rgb })
                  }
                />
              </label>
            </div>
            <div className="bg-surface outline outline-outline p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Tertiary:{" "}
                <ColorPicker
                  color={theme.tertiary}
                  onChange={(color) =>
                    applyTheme({ ...theme, tertiary: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Tertiary text:{" "}
                <ColorPicker
                  color={theme.tertiaryText}
                  onChange={(color) =>
                    applyTheme({ ...theme, tertiaryText: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Tertiary container:{" "}
                <ColorPicker
                  color={theme.tertiaryContainer}
                  onChange={(color) =>
                    applyTheme({ ...theme, tertiaryContainer: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Tertiary container text:{" "}
                <ColorPicker
                  color={theme.tertiaryContainerText}
                  onChange={(color) =>
                    applyTheme({ ...theme, tertiaryContainerText: color.rgb })
                  }
                />
              </label>
            </div>
            <div className="bg-surface outline outline-outline p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Error:{" "}
                <ColorPicker
                  color={theme.error}
                  onChange={(color) =>
                    applyTheme({ ...theme, error: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Error text:{" "}
                <ColorPicker
                  color={theme.errorText}
                  onChange={(color) =>
                    applyTheme({ ...theme, errorText: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Error container:{" "}
                <ColorPicker
                  color={theme.errorContainer}
                  onChange={(color) =>
                    applyTheme({ ...theme, errorContainer: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Error container text:{" "}
                <ColorPicker
                  color={theme.errorContainerText}
                  onChange={(color) =>
                    applyTheme({ ...theme, errorContainerText: color.rgb })
                  }
                />
              </label>
            </div>
            <div className="bg-surface outline outline-outline p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Outline:{" "}
                <ColorPicker
                  color={theme.outline}
                  onChange={(color) =>
                    applyTheme({ ...theme, outline: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Outline variant:{" "}
                <ColorPicker
                  color={theme.outlineVariant}
                  onChange={(color) =>
                    applyTheme({ ...theme, outlineVariant: color.rgb })
                  }
                />
              </label>
            </div>
            <div className="bg-surface outline outline-outline p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Shadow:{" "}
                <ColorPicker
                  color={theme.shadow}
                  onChange={(color) =>
                    applyTheme({ ...theme, shadow: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Scrim:{" "}
                <ColorPicker
                  color={theme.scrim}
                  onChange={(color) =>
                    applyTheme({ ...theme, scrim: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Inverse surface:{" "}
                <ColorPicker
                  color={theme.inverseSurface}
                  onChange={(color) =>
                    applyTheme({ ...theme, inverseSurface: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Inverse surface text:{" "}
                <ColorPicker
                  color={theme.inverseOnSurface}
                  onChange={(color) =>
                    applyTheme({ ...theme, inverseOnSurface: color.rgb })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Inverse primary:{" "}
                <ColorPicker
                  color={theme.inversePrimary}
                  onChange={(color) =>
                    applyTheme({ ...theme, inversePrimary: color.rgb })
                  }
                />
              </label>
            </div>
            <div className="bg-surface outline outline-outline p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Wallpaper:{" "}
                <input
                  className="bg-primary-container text-primary-container-text p-2 rounded-md"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const result = e.target?.result;
                        if (typeof result === "string") {
                          applyTheme({ ...theme, wallpaper: result });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Radius:{" "}
                <input
                  className="bg-primary-container text-primary-container-text p-2 rounded-md"
                  type="text"
                  value={theme.radius}
                  onChange={(e) =>
                    applyTheme({ ...theme, radius: e.target.value })
                  }
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
