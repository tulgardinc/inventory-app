import { CreateInventorySchema, CreateItemSchema } from '../../lib/schemas';

describe('Zod Schemas', () => {
  describe('CreateInventorySchema', () => {
    it('should validate a correct inventory object', () => {
      const validInventory = {
        name: 'Test Inventory',
        description: 'A test inventory',
      };

      const result = CreateInventorySchema.safeParse(validInventory);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.name).toBe('Test Inventory');
        expect(result.data.description).toBe('A test inventory');
      }
    });

    it('should reject inventory with empty name', () => {
      const invalidInventory = {
        name: '',
        description: 'A test inventory',
      };

      const result = CreateInventorySchema.safeParse(invalidInventory);
      expect(result.success).toBe(false);
    });

    it('should reject inventory with missing name', () => {
      const invalidInventory = {
        description: 'A test inventory',
      };

      const result = CreateInventorySchema.safeParse(invalidInventory);
      expect(result.success).toBe(false);
    });

    it('should allow inventory without description', () => {
      const validInventory = {
        name: 'Test Inventory',
      };

      const result = CreateInventorySchema.safeParse(validInventory);
      expect(result.success).toBe(true);
    });

    it('should trim whitespace from name and description', () => {
      const inventoryWithWhitespace = {
        name: '  Test Inventory  ',
        description: '  A test inventory  ',
      };

      const result = CreateInventorySchema.safeParse(inventoryWithWhitespace);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.name).toBe('Test Inventory');
        expect(result.data.description).toBe('A test inventory');
      }
    });
  });

  describe('CreateItemSchema', () => {
    it('should validate a correct item object', () => {
      const validItem = {
        inventoryId: 'inv_123',
        name: 'Test Item',
        description: 'A test item',
        quantity: 1,
        price: 9.99,
        category: 'Test Category',
        location: 'Test Location',
        barcode: '1234567890123',
      };

      const result = CreateItemSchema.safeParse(validItem);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.name).toBe('Test Item');
        expect(result.data.quantity).toBe(1);
        expect(result.data.price).toBe(9.99);
      }
    });

    it('should reject item with empty name', () => {
      const invalidItem = {
        inventoryId: 'inv_123',
        name: '',
        quantity: 1,
      };

      const result = CreateItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });

    it('should reject item with negative quantity', () => {
      const invalidItem = {
        inventoryId: 'inv_123',
        name: 'Test Item',
        quantity: -1,
      };

      const result = CreateItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });

    it('should reject item with negative price', () => {
      const invalidItem = {
        inventoryId: 'inv_123',
        name: 'Test Item',
        quantity: 1,
        price: -1,
      };

      const result = CreateItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });

    it('should allow item with minimal required fields', () => {
      const minimalItem = {
        inventoryId: 'inv_123',
        name: 'Test Item',
        quantity: 1,
      };

      const result = CreateItemSchema.safeParse(minimalItem);
      expect(result.success).toBe(true);
    });

    it('should transform and validate expiration date', () => {
      const itemWithDate = {
        inventoryId: 'inv_123',
        name: 'Test Item',
        quantity: 1,
        expirationDate: new Date('2025-12-31'),
      };

      const result = CreateItemSchema.safeParse(itemWithDate);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.expirationDate).toBeInstanceOf(Date);
      }
    });

    it('should handle undefined expiration date', () => {
      const itemWithoutDate = {
        inventoryId: 'inv_123',
        name: 'Test Item',
        quantity: 1,
      };

      const result = CreateItemSchema.safeParse(itemWithoutDate);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.expirationDate).toBeUndefined();
      }
    });

    it('should trim whitespace from string fields', () => {
      const itemWithWhitespace = {
        inventoryId: '  inv_123  ',
        name: '  Test Item  ',
        description: '  A test item  ',
        category: '  Test Category  ',
        location: '  Test Location  ',
        barcode: '  1234567890123  ',
        quantity: 1,
      };

      const result = CreateItemSchema.safeParse(itemWithWhitespace);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.name).toBe('Test Item');
        expect(result.data.description).toBe('A test item');
        expect(result.data.category).toBe('Test Category');
        expect(result.data.location).toBe('Test Location');
        expect(result.data.barcode).toBe('1234567890123');
      }
    });
  });
});
