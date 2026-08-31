export function AuthLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-0 w-full"
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: 20 }, (_, i) => {
        const x = 20 + i * 19;
        const height = 30 + Math.sin(i * 0.5) * 40 + 40;

        return (
          <line
            key={i}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke="url(#auth-line-grad)"
            strokeOpacity="0.12"
            strokeWidth="0.5"
          />
        );
      })}
      <defs>
        <linearGradient id="auth-line-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
