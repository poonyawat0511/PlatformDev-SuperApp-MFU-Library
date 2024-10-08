export function extractQury(
  query: string | string[],
): Record<string, true | undefined> {
  // Transform includes array into object
  const queries = Array.isArray(query) ? query : [query];
  return Object.fromEntries(queries.map((v) => [v, true]));
}
