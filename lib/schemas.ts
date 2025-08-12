import { z } from 'zod';

// Inventory schema
export const InventorySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().trim().min(1, 'Inventory name is required'),
  description: z.string().trim().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Item schema
export const ItemSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  inventoryId: z.string().trim().min(1, 'Inventory ID is required'),
  name: z.string().trim().min(1, 'Item name is required'),
  description: z.string().trim().optional(),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  category: z.string().trim().optional(),
  location: z.string().trim().optional(),
  barcode: z.string().trim().optional(),
  expirationDate: z.date().optional(),
  entryDate: z.date(),
  updatedAt: z.date(),
});

// Input validation schemas for creating/updating
export const CreateInventorySchema = InventorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateItemSchema = ItemSchema.omit({
  id: true,
  entryDate: true,
  updatedAt: true,
});

export const UpdateInventorySchema = CreateInventorySchema.partial();
export const UpdateItemSchema = CreateItemSchema.partial();

// Export types
export type Inventory = z.infer<typeof InventorySchema>;
export type Item = z.infer<typeof ItemSchema>;
export type CreateInventory = z.infer<typeof CreateInventorySchema>;
export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateInventory = z.infer<typeof UpdateInventorySchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;
