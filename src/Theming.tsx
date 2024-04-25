import { useEffect, useState } from "react";
import {
  argbFromHex,
  DynamicScheme,
  TonalPalette,
  SchemeContent,
  Hct,
} from "@material/material-color-utilities";
import ColorPicker from "./ColorPicker";
import { RGBColor } from "react-color";
import { capitalCase } from "change-case";
import {
  InteractiveComponent,
  SimpleComponent,
  SliceFirst,
  themeComponentEntries,
  type Theme as TwTheme,
} from "./theme";

type ASComponent = SimpleComponent<RGBColor, string>;
type AIComponent = InteractiveComponent<RGBColor, string>;

type AComponent = ASComponent | AIComponent;

function addStyle(name: string, value: string) {
  if (name === "--wallpaper") {
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
 * Converts an RGBColor to HCT.
 */
function rgbColorToHct(color: RGBColor): Hct {
  return Hct.fromInt(rgbColorToArgb(color));
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
  wallpaper?: {
    base64: string;
    url: string;
  };
  radius: string;
  globalAlpha: number;
  globalBlur: number;
} & TwTheme<RGBColor, string>;

function mdToTheme(md: DynamicScheme, prevTheme?: Theme): Theme {
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
      active: {
        bg: tone(palette, 99),
        text: tone(palette, 20),
      },
      hover: {
        bg: tone(palette, 90),
        text: tone(palette, 20),
      },

      container: {
        bg: tone(palette, 30),
        text: tone(palette, 90),
        active: {
          bg: tone(palette, 20),
          text: tone(palette, 90),
        },
        hover: {
          bg: tone(palette, 35),
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
    radius: prevTheme?.radius ?? "0.5rem",
    globalAlpha: prevTheme?.globalAlpha ?? 1,
    globalBlur: prevTheme?.globalBlur ?? 0,
  };
}

const defaultMdColor = "#3f51b5";

const styles = {
  "material-you-light": mdToTheme(
    new SchemeContent(Hct.fromInt(argbFromHex(defaultMdColor)), false, 0)
  ),
  "material-you-dark": mdToTheme(
    new SchemeContent(Hct.fromInt(argbFromHex(defaultMdColor)), true, 0)
  ),
  advanced: undefined,
} as const satisfies Record<string, Theme | undefined>;

type Styles = keyof typeof styles;

export default function Theming() {
  const [style, setStyle] = useState<Styles>("material-you-light");
  const [mdSourceColor, setMdSourceColor] = useState(
    hexToRGBColor(defaultMdColor)
  );
  const [theme, setTheme] = useState<Theme>(styles["material-you-light"]);

  function applyTheme(newTheme?: Theme) {
    const currentTheme = newTheme ?? theme;

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
      const currentEntry = currentTheme[name];
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
    const scheme = new SchemeContent(
      rgbColorToHct(mdSourceColor),
      style === "material-you-dark",
      0
    );

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

  function AdvancedComponent({
    name,
    component,
  }: {
    name: string;
    component: AComponent;
  }) {
    return (
      <div className="preset-surface p-2 rounded-lg flex flex-row flex-wrap gap-4">
        <details className="w-full">
          <summary>{capitalCase(name)}</summary>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-row items-center gap-4">
              <span>Background</span>
              <ColorPicker
                color={component.bg}
                onChange={(color) =>
                  applyTheme({
                    ...theme,
                    [name]: {
                      ...component,
                      bg: color.rgb,
                    },
                  })
                }
              />
            </div>
            <div className="flex flex-row items-center gap-4">
              <span>Text</span>
              <ColorPicker
                color={component.text}
                onChange={(color) =>
                  applyTheme({
                    ...theme,
                    [name]: {
                      ...component,
                      text: color.rgb,
                    },
                  })
                }
              />
            </div>
            {(() => {
              const keys = Object.keys(component).filter(
                (key) =>
                  key !== "bg" &&
                  key !== "text" &&
                  key !== "blur" &&
                  key !== "radius"
              ) as Exclude<
                keyof AComponent,
                "bg" | "text" | "blur" | "radius"
              >[];
              if (keys.length === 0) {
                return null;
              }
              return (
                <div className="flex flex-col gap-4">
                  {keys.map((key) => {
                    const subcomponent = component[key];
                    return (
                      <AdvancedComponent
                        key={key}
                        name={`${name}-${key}`}
                        component={subcomponent}
                      />
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </details>
      </div>
    );
  }

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
            {themeComponentEntries.map(([name]) => (
              <AdvancedComponent
                name={name}
                component={theme[name] as AComponent}
              />
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
                        applyTheme({
                          ...theme,
                          wallpaper: { base64: reader.result as string, url },
                        });
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
