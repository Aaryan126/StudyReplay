export function LoadingState({ label = "Loading workspace" }: { label?: string }) {
  return (
    <div aria-label={label} className="space-y-3" role="status">
      <span className="sr-only">{label}</span>
      {["w-2/3", "w-full", "w-5/6"].map((width) => (
        <div className={`skeleton-pulse h-4 rounded-full bg-[#dfe7e2] ${width}`} key={width} />
      ))}
    </div>
  );
}
