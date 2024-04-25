import { Hct } from "@material/material-color-utilities";
import { RGBColor } from "react-color";

/**
 * Converts an RGBColor to HCT.
 */
export function rgbColorToHct(color: RGBColor): Hct {
  return Hct.fromInt(rgbColorToArgb(color));
}

/**
 * Converts argb number to RGBColor.
 */
export function argbToRGBColor(argb: number): RGBColor {
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
export function rgbColorToArgb(color: RGBColor): number {
  // color.a is [0, 1], but we need [0, 255]
  const a = Math.round((color.a ?? 1) * 255);
  return (a << 24) | (color.r << 16) | (color.g << 8) | color.b;
}

/**
 * Converts a hex color to an RGBColor.
 */
export function hexToRGBColor(hex: string): RGBColor {
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
export function getMimeType(base64: string): string {
  return base64.match(/^data:(.*?);base64,/)?.[1] ?? "";
}

/**
 * Strips the base64 prefix from a base64 image.
 */
export function stripBase64Prefix(base64: string): string {
  return base64.replace(/^data:(.*?);base64,/, "");
}

/**
 * Converts base64 image to an array buffer.
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function recursivelyApply<T>(old: T, cur: T) {
  for (const key in cur) {
    if (typeof cur[key] === "object") {
      recursivelyApply(old[key], cur[key]);
    } else {
      old[key] = cur[key];
    }
  }
}
