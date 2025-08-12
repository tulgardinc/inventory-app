// Simple test to verify Jest setup is working
describe('Testing Infrastructure Setup', () => {
  it('should be able to run basic unit tests', () => {
    expect(true).toBe(true);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });

  it('should support TypeScript', () => {
    const testObject: { name: string; count: number } = {
      name: 'Test',
      count: 42,
    };
    expect(testObject.name).toBe('Test');
    expect(testObject.count).toBe(42);
  });

  it('should have proper Jest matchers available', () => {
    const testArray = [1, 2, 3];
    expect(testArray).toHaveLength(3);
    expect(testArray).toContain(2);
    expect(testArray).not.toContain(4);
  });
});
