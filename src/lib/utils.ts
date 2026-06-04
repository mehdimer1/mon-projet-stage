function snakeToCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

export function snakeToCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }
  if (obj !== null && typeof obj === "object") {
    const camelObj: Record<string, unknown> = {};
    for (const key in obj as Record<string, unknown>) {
      const camelKey = snakeToCamelKey(key);
      const value = (obj as Record<string, unknown>)[key];
      camelObj[camelKey] = snakeToCamel(value);
    }
    return camelObj;
  }
  return obj;
}
