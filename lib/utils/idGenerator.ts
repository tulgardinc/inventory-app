/**
 * Generate a unique ID for database entities
 * Using timestamp + random suffix for uniqueness
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomSuffix}`;
}

/**
 * Validate if an ID has the expected format
 */
export function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && id.includes('-');
}
