export const PULSE_DURATION_MS = 600;

export function applyPulseAnimation(node: HTMLElement): () => void {
  node.style.setProperty("--pulse-duration", `${PULSE_DURATION_MS}ms`);
  node.classList.add("animate-pulse-once");
  const timer = window.setTimeout(() => {
    node.classList.remove("animate-pulse-once");
  }, PULSE_DURATION_MS);

  return () => {
    window.clearTimeout(timer);
    node.classList.remove("animate-pulse-once");
    node.style.removeProperty("--pulse-duration");
  };
}
