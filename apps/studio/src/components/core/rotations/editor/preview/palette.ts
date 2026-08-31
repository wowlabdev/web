export function stringHashToHsl(
  input: string,
  saturation = 65,
  lightness = 55,
): string {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.codePointAt(i)!;
    hash = Math.trunc(hash);
  }

  const hue = Math.abs(hash) % 360;

  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}
