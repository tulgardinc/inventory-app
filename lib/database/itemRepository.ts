import { CreateItem, Item, UpdateItem } from '../schemas';
import { generateId } from '../utils/idGenerator';
import { executeSql, getAllAsync, getFirstAsync } from './connection';
import { DatabaseItem } from './types';

/**
 * Convert database row to app Item type
 */
function mapDbToItem(dbItem: DatabaseItem): Item {
  return {
    id: dbItem.id,
    inventoryId: dbItem.inventory_id,
    name: dbItem.name,
    description: dbItem.description || undefined,
    quantity: dbItem.quantity,
    price: dbItem.price || undefined,
    category: dbItem.category || undefined,
    location: dbItem.location || undefined,
    barcode: dbItem.barcode || undefined,
    expirationDate: dbItem.expiration_date ? new Date(dbItem.expiration_date) : undefined,
    entryDate: new Date(dbItem.entry_date),
    updatedAt: new Date(dbItem.updated_at),
  };
}

/**
 * Create a new item
 */
export async function createItem(data: CreateItem): Promise<Item> {
  const id = generateId();
  const now = new Date().toISOString();
  
  await executeSql(
    `INSERT INTO items (
      id, inventory_id, name, description, quantity, price, 
      category, location, barcode, expiration_date, entry_date, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.inventoryId,
      data.name,
      data.description || null,
      data.quantity,
      data.price || null,
      data.category || null,
      data.location || null,
      data.barcode || null,
      data.expirationDate?.toISOString() || null,
      now,
      now,
    ]
  );
  
  return {
    id,
    inventoryId: data.inventoryId,
    name: data.name,
    description: data.description,
    quantity: data.quantity,
    price: data.price,
    category: data.category,
    location: data.location,
    barcode: data.barcode,
    expirationDate: data.expirationDate,
    entryDate: new Date(now),
    updatedAt: new Date(now),
  };
}

/**
 * Get item by ID
 */
export async function getItemById(id: string): Promise<Item | null> {
  const result = await getFirstAsync<DatabaseItem>(
    'SELECT * FROM items WHERE id = ?',
    [id]
  );
  
  return result ? mapDbToItem(result) : null;
}

/**
 * Get all items for an inventory
 */
export async function getItemsByInventoryId(inventoryId: string): Promise<Item[]> {
  const results = await getAllAsync<DatabaseItem>(
    'SELECT * FROM items WHERE inventory_id = ? ORDER BY name ASC',
    [inventoryId]
  );
  
  return results.map(mapDbToItem);
}

/**
 * Update item by ID
 */
export async function updateItem(id: string, data: UpdateItem): Promise<Item | null> {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  
  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description || null);
  }
  
  if (data.quantity !== undefined) {
    updates.push('quantity = ?');
    values.push(data.quantity);
  }
  
  if (data.price !== undefined) {
    updates.push('price = ?');
    values.push(data.price || null);
  }
  
  if (data.category !== undefined) {
    updates.push('category = ?');
    values.push(data.category || null);
  }
  
  if (data.location !== undefined) {
    updates.push('location = ?');
    values.push(data.location || null);
  }
  
  if (data.barcode !== undefined) {
    updates.push('barcode = ?');
    values.push(data.barcode || null);
  }
  
  if (data.expirationDate !== undefined) {
    updates.push('expiration_date = ?');
    values.push(data.expirationDate?.toISOString() || null);
  }
  
  if (updates.length === 0) {
    return getItemById(id);
  }
  
  updates.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(id);
  
  const result = await executeSql(
    `UPDATE items SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  
  if (result.changes === 0) {
    return null;
  }
  
  return getItemById(id);
}

/**
 * Delete item by ID
 */
export async function deleteItem(id: string): Promise<boolean> {
  const result = await executeSql('DELETE FROM items WHERE id = ?', [id]);
  return result.changes > 0;
}

/**
 * Get item count for inventory
 */
export async function getItemCountByInventoryId(inventoryId: string): Promise<number> {
  const result = await getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM items WHERE inventory_id = ?',
    [inventoryId]
  );
  
  return result?.count || 0;
}

/**
 * Search items by name within inventory
 */
export async function searchItemsInInventory(
  inventoryId: string, 
  query: string
): Promise<Item[]> {
  const results = await getAllAsync<DatabaseItem>(
    `SELECT * FROM items 
     WHERE inventory_id = ? AND (name LIKE ? OR description LIKE ?) 
     ORDER BY name ASC`,
    [inventoryId, `%${query}%`, `%${query}%`]
  );
  
  return results.map(mapDbToItem);
}

/**
 * Find item by barcode
 */
export async function findItemByBarcode(barcode: string): Promise<Item | null> {
  const result = await getFirstAsync<DatabaseItem>(
    'SELECT * FROM items WHERE barcode = ?',
    [barcode]
  );
  
  return result ? mapDbToItem(result) : null;
}
