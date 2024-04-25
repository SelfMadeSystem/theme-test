import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ColorPickerProps, RGBColor, SketchPicker } from "react-color";

export default function ColorPicker({
  color,
  onChange,
  onChangeComplete,
  disableAlpha,
  ...props
}: ColorPickerProps<HTMLDivElement> & { color: RGBColor } & {
  disableAlpha?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open) {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [open]);

  return (
    <span {...props}>
      <button
        ref={buttonRef}
        className="rounded-full
            border-primary-container
            hover:border-primary-container-hover
            active:border-primary-container-active
            border-[0.5rem]
            preset-transition"
        onClick={() => setOpen(!open)}
      >
        <div
          className="rounded-full w-6 h-6"
          style={{
            background: `linear-gradient(135deg, rgba(${color.r}, ${color.g}, ${
              color.b
            }, ${color.a ?? 1}) 50%, rgb(${color.r}, ${color.g}, ${
              color.b
            }) 50%)`,
          }}
        />
      </button>
      {open &&
        createPortal(
          <div
            className="absolute z-10"
            ref={ref}
            style={{ top: position.top, left: position.left }}
          >
            <SketchPicker
              color={color}
              onChange={onChange}
              onChangeComplete={onChangeComplete}
              disableAlpha={disableAlpha}
            />
          </div>,
          document.body
        )}
    </span>
  );
}
