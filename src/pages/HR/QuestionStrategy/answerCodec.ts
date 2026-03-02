type AnswerValue = string | string[];

export function encodeAnswer(val: AnswerValue): string {
  if (Array.isArray(val)) return [...val].sort().join(",");
  return val ?? "";
}

export function decodeMultiAnswer(str: string | undefined): string[] {
  if (!str) return [];
  return str.split(",").filter(Boolean);
}
