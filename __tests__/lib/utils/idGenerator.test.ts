import { generateId, isValidId } from '../../../lib/utils/idGenerator';

describe('ID Generator', () => {
  describe('generateId', () => {
    it('should generate a string ID', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with correct format (timestamp-random)', () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
      expect(id).toContain('-');
    });

    it('should generate IDs with timestamp component', () => {
      const beforeTimestamp = Date.now();
      const id = generateId();
      const afterTimestamp = Date.now();
      
      // Extract timestamp from ID (format: timestamp-suffix)
      const parts = id.split('-');
      const timestampBase36 = parts[0];
      const timestamp = parseInt(timestampBase36, 36);
      
      expect(timestamp).toBeGreaterThanOrEqual(beforeTimestamp);
      expect(timestamp).toBeLessThanOrEqual(afterTimestamp);
    });

    it('should generate IDs with random suffix', () => {
      const id = generateId();
      const parts = id.split('-');
      const suffix = parts[1];
      
      expect(suffix).toBeTruthy();
      expect(suffix.length).toBeGreaterThan(0);
      expect(suffix).toMatch(/^[a-z0-9]+$/);
    });
  });

  describe('isValidId', () => {
    it('should validate correctly formatted IDs', () => {
      const validId = generateId();
      expect(isValidId(validId)).toBe(true);
    });

    it('should reject empty strings', () => {
      expect(isValidId('')).toBe(false);
    });

    it('should reject IDs without hyphen', () => {
      expect(isValidId('invalidid')).toBe(false);
    });

    it('should reject non-string values', () => {
      expect(isValidId(null as any)).toBe(false);
      expect(isValidId(undefined as any)).toBe(false);
      expect(isValidId(123 as any)).toBe(false);
    });
  });
});
