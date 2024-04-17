import { useState } from "react";
import { ColorPickerProps, RGBColor, SketchPicker } from "react-color";

export default function ColorPicker({ color, onChange, onChangeComplete, disableAlpha, ...props }: ColorPickerProps<HTMLDivElement> & { color: RGBColor} & {
    disableAlpha?: boolean;
}) {
    const [open, setOpen] = useState(false);

    return (
        <span {...props}>
            <button
                className="rounded-full border-primary-container border-[0.5rem]"
                onClick={() => {
                    if (open) {
                        return;
                    }
                    setOpen(true);
                    const e = () => {
                        setOpen(false);
                    }
                    requestAnimationFrame(() => window.addEventListener("click", e, { once: true }));
                }}
            >
                <div className="rounded-full w-6 h-6" style={{
                    background: `linear-gradient(135deg, rgba(${color.r}, ${color.g}, ${color.b}, ${(console.log(color.a), color.a) ?? 1}) 50%, rgb(${color.r}, ${color.g}, ${color.b}) 50%)`
                }} />
            </button>
            {open && (
                <div className="absolute z-10">
                    <SketchPicker color={color} onChange={onChange} onChangeComplete={onChangeComplete} disableAlpha={disableAlpha} />
                </div>
            )}
        </span>
    );
}