import Theming from "./Theming";

function Example({ className, styleName }: { className: string; styleName: string}) {
  return (
    <div className={`rounded-lg ${className} p-6 max-w-96`}>
      <h1 className='text-4xl font-bold'>Style: {styleName}</h1>
      <p className='text-lg'>This is a React app with Tailwind CSS.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className='text-background-text min-h-screen' style={{
      backgroundImage: "var(--wallpaper)",
      backgroundAttachment: "fixed",
      backgroundPosition: "center center",
      backgroundSize: "cover",
    }}>
      <Theming />
      <div className="flex flex-wrap flex-row gap-6 p-6 justify-center">
        <Example className='bg-background text-background-text' styleName="default"/>
        <Example className='bg-surface text-surface-text outline-outline outline' styleName="surface"/>
        <Example className='bg-surface-variant text-surface-variant-text outline-outline-variant outline' styleName="surface variant"/>
        <Example className='bg-primary text-primary-text' styleName="primary"/>
        <Example className='bg-primary-container text-primary-container-text' styleName="primary container"/>
        <Example className='bg-secondary text-secondary-text' styleName="secondary"/>
        <Example className='bg-secondary-container text-secondary-container-text' styleName="secondary container"/>
        <Example className='bg-tertiary text-tertiary-text' styleName="tertiary"/>
        <Example className='bg-tertiary-container text-tertiary-container-text' styleName="tertiary container"/>
        <Example className='bg-error text-error-text' styleName="error"/>
        <Example className='bg-error-container text-error-container-text' styleName="error container"/>
        <Example className='bg-inverse-surface text-inverse-surface-text' styleName="inverse surface"/>
      </div>
    </div>
  );
}
