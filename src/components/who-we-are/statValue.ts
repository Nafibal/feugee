export interface ParsedStatValue {
  prefix: string;
  number: number;
  decimals: number;
  suffix: string;
}

/**
 * Splits a CMS stat figure — "55+", "35M+", "$1.5M" — into the parts a
 * count-up animates: everything before the number, the number itself
 * (decimals kept so "1.5" never rounds through "2"), and everything after.
 * Null when the figure holds no number to count.
 */
export const parseStatValue = (value: string): ParsedStatValue | null => {
  const match = /^([^\d.-]*)(-?\d+(?:\.\d+)?)(.*)$/s.exec(value);
  if (match === null) return null;

  const [, prefix, numberText, suffix] = match;
  return {
    prefix,
    number: Number.parseFloat(numberText),
    decimals: numberText.includes(".")
      ? numberText.length - numberText.indexOf(".") - 1
      : 0,
    suffix,
  };
};

export const formatStatValue = (
  parsed: ParsedStatValue,
  value: number,
): string => `${parsed.prefix}${value.toFixed(parsed.decimals)}${parsed.suffix}`;
