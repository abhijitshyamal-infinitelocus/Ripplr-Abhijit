export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Parses a stat like "230k+", "2.5x+", ">95%", "<2 Days", "1,240t" into a numeric target and its surroundings. */
export function parseStat(value: string) {
  const m = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!m) return null;
  const [, prefix, num, suffix] = m;
  const n = parseFloat(num.replace(/,/g, ""));
  if (Number.isNaN(n)) return null;
  const decimals = (num.split(".")[1] || "").length;
  const useCommas = num.includes(",");
  return { prefix, target: n, suffix, decimals, useCommas };
}

export function formatNumber(n: number, decimals: number, useCommas: boolean) {
  const fixed = n.toFixed(decimals);
  if (!useCommas) return fixed;
  const [i, d] = fixed.split(".");
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (d ? "." + d : "");
}
