import { useEffect, useState } from "react";
import {
  argbFromHex,
  themeFromSourceColor,
  Scheme,
} from "@material/material-color-utilities";
import ColorPicker from "./ColorPicker";
import { RGBColor } from "react-color";
import { capitalCase } from "change-case";

function addStyle(name: string, value: string) {
  if (name === '--wallpaper') {
    console.log("hi", value);
  }
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
 * Gets the mime type of a base64 image.
 */
function getMimeType(base64: string): string {
  return base64.match(/^data:(.*?);base64,/)?.[1] ?? "";
}

/**
 * Strips the base64 prefix from a base64 image.
 */
function stripBase64Prefix(base64: string): string {
  return base64.replace(/^data:(.*?);base64,/, "");
}

/**
 * Converts base64 image to an array buffer.
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
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

  wallpaper?: {
    base64: string;
    url: string;
  }
  radius: string;
  globalAlpha: number;
  globalBlur: number;
};

function mdToTheme(md: Scheme, prevTheme?: Theme): Theme {
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

    inverseSurface: argbToRGBColor(md.inverseSurface),
    inverseOnSurface: argbToRGBColor(md.inverseOnSurface),
    inversePrimary: argbToRGBColor(md.inversePrimary),

    outline: argbToRGBColor(md.outline),
    outlineVariant: argbToRGBColor(md.outlineVariant),
    shadow: argbToRGBColor(md.shadow),
    scrim: argbToRGBColor(md.scrim),

    wallpaper: prevTheme?.wallpaper,
    radius: prevTheme?.radius ?? "0.5rem",
    globalAlpha: prevTheme?.globalAlpha ?? 1,
    globalBlur: prevTheme?.globalBlur ?? 0,
  };
}

const colorCategories = [
  ["background", "backgroundText"],
  ["surface", "surfaceText", "surfaceVariant", "surfaceVariantText"],
  ["primary", "primaryText", "primaryContainer", "primaryContainerText"],
  ["secondary", "secondaryText", "secondaryContainer", "secondaryContainerText"],
  ["tertiary", "tertiaryText", "tertiaryContainer", "tertiaryContainerText"],
  ["error", "errorText", "errorContainer", "errorContainerText"],
  ["inverseSurface", "inverseOnSurface", "inversePrimary"],
  ["outline", "outlineVariant"],
  ["shadow", "scrim"],
] as const;

const defaultMdColor = "#3f51b5";

const styles = {
  "material-you-light": mdToTheme(Scheme.light(argbFromHex(defaultMdColor))),
  "material-you-dark": mdToTheme(Scheme.dark(argbFromHex(defaultMdColor))),
  advanced: undefined,
} as const satisfies Record<string, Theme | undefined>;

type Styles = keyof typeof styles;

export default function Theming() {
  const [style, setStyle] = useState<Styles>("material-you-light");
  const [mdSourceColor, setMdSourceColor] = useState(hexToRGBColor(defaultMdColor));
  const [theme, setTheme] = useState<Theme>(styles["material-you-light"]);

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

    addColorStyle("--inverse-surface", currentTheme.inverseSurface);
    addColorStyle("--inverse-surface-text", currentTheme.inverseOnSurface);
    addColorStyle("--inverse-primary", currentTheme.inversePrimary);
    
    addColorStyle("--outline", currentTheme.outline);
    addColorStyle("--outline-variant", currentTheme.outlineVariant);
    addColorStyle("--shadow", currentTheme.shadow);
    addColorStyle("--scrim", currentTheme.scrim);

    if (currentTheme.wallpaper) {
      addStyle("--wallpaper", `url(${currentTheme.wallpaper.url})`);
    } else {
      addStyle("--wallpaper", "none");
    }
    addStyle("--radius", currentTheme.radius);
    addStyle("--bg-alpha", currentTheme.globalAlpha.toString());
    addStyle("--bg-blur", `${currentTheme.globalBlur}px`);

    if (newTheme) {
      setTheme(newTheme);
    }
  }

  function applyMarkdownTheme() {
    const sourceColor = rgbColorToArgb(mdSourceColor);
    const mdTheme = themeFromSourceColor(sourceColor);

    const scheme =
      style === "material-you-dark" ? mdTheme.schemes.dark : mdTheme.schemes.light;

    const newTheme = mdToTheme(scheme, theme);

    applyTheme(newTheme);
  }

  function newStyle(name: Styles) {
    setStyle(name);

    // TODO: When I add new styles e.g. gruvbox, solaris, etc., I will need to
    // apply the theme here.
  }

  useEffect(() => {
    if (style === "material-you-light" || style === "material-you-dark") {
      applyMarkdownTheme();
    }
  }, [mdSourceColor, style]);

  return (
    <div className="preset-background w-fit mx-auto rounded-lg p-8">
      <h1 className="text-4xl font-bold text-center">Theming</h1>
      <p className="text-lg text-center">
        This is a React app with Tailwind CSS.
      </p>
      <div className="flex flex-col gap-4 items-center">
        <label className="flex flex-row gap-2 items-center">
          Style:
          <select
            className="preset-primary-container"
            value={style}
            onChange={(e) => {
              const style = e.target.value as Styles;
              newStyle(style);
            }}
          >
            {Object.keys(styles).map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>
        {(style === "material-you-dark" || style === "material-you-light") && (
          <div>
            <label className="flex flex-row items-center gap-2">
              Source color:
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
            {colorCategories.map((colors) => (
              <div key={colors[0]} className="preset-surface p-2 rounded-lg flex flex-row flex-wrap gap-4">
                {colors.map((colorName) => (
                  <label key={colorName} className="flex flex-row gap-2 items-center">
                    {capitalCase(colorName)}:
                    <ColorPicker
                      color={theme[colorName]}
                      onChange={(color) =>
                        applyTheme({ ...theme, [colorName]: color.rgb })
                      }
                    />
                  </label>
                ))}
              </div>
            ))}
            <div className="preset-surface p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Wallpaper:
                <input
                  className="preset-primary-container p-2 rounded-md"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (theme.wallpaper) {
                        URL.revokeObjectURL(theme.wallpaper.url);
                      }
                      const url = URL.createObjectURL(file);
                      const reader = new FileReader();
                      reader.onload = () => {
                        applyTheme({ ...theme, wallpaper: { base64: reader.result as string, url } });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <button
                className="preset-primary p-2 rounded-md"
                onClick={() => {
                  if (theme.wallpaper) {
                    URL.revokeObjectURL(theme.wallpaper.url);
                    applyTheme({ ...theme, wallpaper: undefined });
                  }
                }}
              >
                Remove wallpaper
              </button>
            </div>
            <div className="preset-surface p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Radius:
                <input
                  className="preset-primary-container p-2 rounded-md"
                  type="text"
                  value={theme.radius}
                  onChange={(e) =>
                    applyTheme({ ...theme, radius: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="preset-surface p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Global alpha:
                <input
                  className="preset-primary-container p-2 rounded-md"
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={theme.globalAlpha}
                  onChange={(e) =>
                    applyTheme({ ...theme, globalAlpha: +e.target.value })
                  }
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Global blur:
                <input
                  className="preset-primary-container p-2 rounded-md"
                  type="number"
                  value={theme.globalBlur}
                  onChange={(e) =>
                    applyTheme({ ...theme, globalBlur: +e.target.value })
                  }
                />
              </label>
            </div>
          </div>
        )}
        <div className="preset-surface p-2 rounded-lg flex flex-row flex-wrap gap-4">
          <button
            className="preset-primary p-2 rounded-md"
            onClick={() => {
              navigator.clipboard.writeText(
                JSON.stringify(
                  {
                    ...theme,
                    wallpaper: theme.wallpaper?.base64,
                  },
                  null,
                  2
                )
              );
            }}
          >
            Copy theme
          </button>
          <button
            className="preset-primary p-2 rounded-md"
            onClick={() => {
              navigator.clipboard.readText().then((text) => {
                if (theme.wallpaper) {
                  URL.revokeObjectURL(theme.wallpaper.url);
                }
                const newTheme = JSON.parse(text);
                if (newTheme.wallpaper) {
                  const base64ImageContent = newTheme.wallpaper;
                  const mimeType = getMimeType(base64ImageContent);
                  const strippedBase64 = stripBase64Prefix(base64ImageContent);
                  const blob = new Blob([base64ToArrayBuffer(strippedBase64)], {
                    type: mimeType,
                  });
                  newTheme.wallpaper = {
                    base64: newTheme.wallpaper,
                    url: URL.createObjectURL(blob),
                  };
                }
                applyTheme(newTheme);
              });
            }}
          >
            Paste theme
          </button>
        </div>
      </div>
    </div>
  );
}
