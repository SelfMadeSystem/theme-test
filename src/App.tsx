import Theming from "./Theming";

function Example({ className, styleName }: { className: string; styleName: string}) {
  return (
    <div className={`${className} rounded-lg p-6 max-w-96`}>
      <h1 className='text-4xl font-bold'>Style: {styleName}</h1>
      <p className='text-lg'>This is a React app with Tailwind CSS.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className='bg-background min-h-screen p-8' style={{
      backgroundImage: "var(--wallpaper)",
      backgroundAttachment: "fixed",
      backgroundPosition: "center center",
      backgroundSize: "cover",
    }}>
      <Theming />
      <div className="flex flex-wrap flex-row gap-6 p-6 justify-center">
        <Example className='preset-background' styleName="default"/>
        <Example className='preset-surface' styleName="surface"/>
        <Example className='preset-surface-variant' styleName="surface variant"/>
        <Example className='preset-primary' styleName="primary"/>
        <Example className='preset-primary-container' styleName="primary container"/>
        <Example className='preset-secondary' styleName="secondary"/>
        <Example className='preset-secondary-container' styleName="secondary container"/>
        <Example className='preset-tertiary' styleName="tertiary"/>
        <Example className='preset-tertiary-container' styleName="tertiary container"/>
        <Example className='preset-error' styleName="error"/>
        <Example className='preset-error-container' styleName="error container"/>
        <Example className='preset-inverse-surface' styleName="inverse surface"/>
      </div>
    </div>
  );
}
