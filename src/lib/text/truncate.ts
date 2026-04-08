export function truncate(str: string, max: number): string {
  const chars = [...str];
  if (chars.length <= max) return str;
  return chars.slice(0, max).join("") + "…";
}
