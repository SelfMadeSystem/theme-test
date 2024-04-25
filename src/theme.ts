
type ObjectToEntries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type SliceFirst<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never;

/**
 * Represents a simple component with customizable background color, text color, blur, and border radius.
 *
 * @template Color - The type of the color value.
 * @template Size - The type of the size value.
 */
export type SimpleComponent<Color, Size> = {
  bg: Color;
  text: Color;
  blur?: Size;
  radius?: Size;
};

/**
 * Represents an interactive component with hover and active states.
 *
 * @template Color - The type of color for the component.
 * @template Size - The type of size for the component.
 */
export type InteractiveComponent<Color, Size> = {
  hover: SimpleComponent<Color, Size>;
  active: SimpleComponent<Color, Size>;
} & SimpleComponent<Color, Size>;

export type ComponentEntry = [boolean, ...string[]];

/**
 * Represents the theme components configuration.
 * Each key represents a component name, and the corresponding value is an array
 * that specifies whether the component is interactive, followed by any
 * subcomponents.
 */
export const themeComponents = {
  background: [false],
  surface: [false, "variant", "inverse"],
  primary: [true, "container"],
  secondary: [true, "container"],
  tertiary: [true, "container"],
  error: [true, "container"],
} as const satisfies { [key: string]: [boolean, ...string[]] };

type ThemeComponentsType = typeof themeComponents;
type ThemeComponentsEntries = ObjectToEntries<ThemeComponentsType>;

export const themeComponentEntries = Object.entries(themeComponents) as ThemeComponentsEntries;

/**
 * Represents a theme object that defines the components and their types.
 *
 * @template Color - The type of color for the component.
 * @template Size - The type of size for the component.
 */
export type Theme<Color, Size> = {
  [K in keyof ThemeComponentsType]: ThemeComponentsType[K] extends [
    true,
    ...infer T
  ]
    ? InteractiveComponent<Color, Size> & {
        [P in (T extends string[] ? T : never)[number]]: InteractiveComponent<
          Color,
          Size
        >;
      }
    : ThemeComponentsType[K] extends [false, ...infer T]
    ? SimpleComponent<Color, Size> & {
        [P in (T extends string[] ? T : never)[number]]: SimpleComponent<
          Color,
          Size
        >;
      }
    : never;
};
