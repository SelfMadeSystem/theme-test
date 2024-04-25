import { useEffect, useState } from "react";
import { SchemeContent } from "@material/material-color-utilities";
import ColorPicker from "./ColorPicker";
import { capitalCase } from "change-case";
import { themeComponentEntries } from "./theme";
import {
  hexToRGBColor,
  rgbColorToHct,
  getMimeType,
  stripBase64Prefix,
  base64ToArrayBuffer,
} from "./utils";
import {
  Styles,
  defaultMdColor,
  applyNewTheme,
  mdToTheme,
  theme,
  AComponent,
  styles,
  applyTheme,
} from "./GlobalTheme";

export default function Theming() {
  const [style, setStyle] = useState<Styles>("material-you-light");
  const [mdSourceColor, setMdSourceColor] = useState(
    hexToRGBColor(defaultMdColor)
  );

  function applyMarkdownTheme() {
    const scheme = new SchemeContent(
      rgbColorToHct(mdSourceColor),
      style === "material-you-dark",
      0
    );

    applyNewTheme(mdToTheme(scheme, theme));
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

  // FIXME: All AdvancedComponent instances get re-rendered when the theme is
  // updated.
  function AdvancedComponent({
    name,
    component,
  }: {
    name: string;
    component: AComponent;
  }) {
    const [bg, setBg] = useState(component.bg);
    const [text, setText] = useState(component.text);
    return (
      <div className="preset-surface p-2 rounded-lg flex flex-row flex-wrap gap-4">
        <details className="w-full">
          <summary>{capitalCase(name)}</summary>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-row items-center gap-4">
              <span>Background</span>
              <ColorPicker
                color={bg}
                onChange={(color) => {
                  component.bg = color.rgb;
                  setBg(color.rgb);
                  applyTheme();
                }}
              />
            </div>
            <div className="flex flex-row items-center gap-4">
              <span>Text</span>
              <ColorPicker
                color={text}
                onChange={(color) => {
                  component.text = color.rgb;
                  setText(color.rgb);
                  applyTheme();
                }}
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
            className="preset-primary-container preset-primary-container-interactive"
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
                key={name}
                name={name}
                component={theme[name] as AComponent}
              />
            ))}
            <div className="preset-surface p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Wallpaper:
                <input
                  className="preset-primary-container preset-primary-container-interactive p-2 rounded-md"
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
                        theme.wallpaper = {
                          base64: reader.result as string,
                          url,
                        };
                        applyTheme();
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <button
                className="preset-primary preset-primary-interactive p-2 rounded-md"
                onClick={() => {
                  if (theme.wallpaper) {
                    URL.revokeObjectURL(theme.wallpaper.url);
                    theme.wallpaper = undefined;
                    applyTheme();
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
                  className="preset-primary-container preset-primary-container-interactive p-2 rounded-md"
                  type="text"
                  value={theme.radius}
                  onChange={(e) => {
                    theme.radius = e.target.value;
                    applyTheme();
                  }}
                />
              </label>
            </div>
            <div className="preset-surface p-2 rounded-lg flex flex-row flex-wrap gap-4">
              <label className="flex flex-row gap-2 items-center">
                Global alpha:
                <input
                  className="preset-primary-container preset-primary-container-interactive p-2 rounded-md"
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={theme.globalAlpha}
                  onChange={(e) => {
                    theme.globalAlpha = +e.target.value;
                    applyTheme();
                  }}
                />
              </label>
              <label className="flex flex-row gap-2 items-center">
                Global blur:
                <input
                  className="preset-primary-container preset-primary-container-interactive p-2 rounded-md"
                  type="number"
                  value={theme.globalBlur}
                  onChange={(e) => {
                    theme.globalBlur = +e.target.value;
                    applyTheme();
                  }}
                />
              </label>
            </div>
          </div>
        )}
        <div className="preset-surface p-2 rounded-lg flex flex-row flex-wrap gap-4">
          <button
            className="preset-primary preset-primary-interactive p-2 rounded-md"
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
            className="preset-primary preset-primary-interactive p-2 rounded-md"
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
                applyNewTheme(newTheme);
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
