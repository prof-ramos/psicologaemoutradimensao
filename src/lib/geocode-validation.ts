export const MAX_QUERY_LENGTH = 200

export function validateGeocodeQuery(q: unknown): boolean {
  if (typeof q !== 'string') return false
  const trimmed = q.trim()
  return trimmed.length >= 2 && trimmed.length <= MAX_QUERY_LENGTH
}
