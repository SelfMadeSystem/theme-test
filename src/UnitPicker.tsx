const units = ["px", "em", "rem", "%"];

export type Unit = (typeof units)[number];
export type UnitValue = [number, Unit];

export function UnitPicker({
  value,
  onChange,
  className,
}: {
  value: UnitValue;
  onChange: (value: UnitValue) => void;
  className: string;
}) {
  const step = (() => {
    switch (value[1]) {
      case "px":
        return 1;
      case "em":
        return 0.1;
      case "rem":
        return 0.1;
      case "%":
        return 1;
      default:
        return 1;
    }
  })();
  return (
    <div className="flex flex-row">
      <input
        type="number"
        value={value[0]}
        onChange={(e) => onChange([+e.target.value, value[1]])}
        min={0}
        step={step}
        className={`rounded-l-lg p-2 w-24 ${className}`}
      />
      <select
        value={value[1]}
        onChange={(e) => onChange([value[0], e.target.value as Unit])}
        className={`rounded-r-lg p-2 ${className}`}
      >
        {units.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
    </div>
  );
}
