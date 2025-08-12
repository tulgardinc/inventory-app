import { CreateInventory, Inventory, UpdateInventory } from '../schemas';
import { generateId } from '../utils/idGenerator';
import { executeSql, getAllAsync, getFirstAsync } from './connection';
import { DatabaseInventory } from './types';

/**
 * Convert database row to app Inventory type
 */
function mapDbToInventory(dbInventory: DatabaseInventory): Inventory {
  return {
    id: dbInventory.id,
    name: dbInventory.name,
    description: dbInventory.description || undefined,
    createdAt: new Date(dbInventory.created_at),
    updatedAt: new Date(dbInventory.updated_at),
  };
}

/**
 * Create a new inventory
 */
export async function createInventory(data: CreateInventory): Promise<Inventory> {
  const id = generateId();
  const now = new Date().toISOString();
  
  await executeSql(
    `INSERT INTO inventories (id, name, description, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.name, data.description || null, now, now]
  );
  
  return {
    id,
    name: data.name,
    description: data.description,
    createdAt: new Date(now),
    updatedAt: new Date(now),
  };
}

/**
 * Get inventory by ID
 */
export async function getInventoryById(id: string): Promise<Inventory | null> {
  const result = await getFirstAsync<DatabaseInventory>(
    'SELECT * FROM inventories WHERE id = ?',
    [id]
  );
  
  return result ? mapDbToInventory(result) : null;
}

/**
 * Get all inventories ordered by name
 */
export async function getAllInventories(): Promise<Inventory[]> {
  const results = await getAllAsync<DatabaseInventory>(
    'SELECT * FROM inventories ORDER BY name ASC'
  );
  
  return results.map(mapDbToInventory);
}

/**
 * Update inventory by ID
 */
export async function updateInventory(
  id: string, 
  data: UpdateInventory
): Promise<Inventory | null> {
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
  
  if (updates.length === 0) {
    return getInventoryById(id);
  }
  
  updates.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(id);
  
  const result = await executeSql(
    `UPDATE inventories SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  
  if (result.changes === 0) {
    return null;
  }
  
  return getInventoryById(id);
}

/**
 * Delete inventory by ID (cascades to delete items)
 */
export async function deleteInventory(id: string): Promise<boolean> {
  const result = await executeSql(
    'DELETE FROM inventories WHERE id = ?',
    [id]
  );
  
  return result.changes > 0;
}

/**
 * Check if inventory exists
 */
export async function inventoryExists(id: string): Promise<boolean> {
  const result = await getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM inventories WHERE id = ?',
    [id]
  );
  
  return (result?.count || 0) > 0;
}

/**
 * Get inventory count
 */
export async function getInventoryCount(): Promise<number> {
  const result = await getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM inventories'
  );
  
  return result?.count || 0;
}

/**
 * Search inventories by name
 */
export async function searchInventories(query: string): Promise<Inventory[]> {
  const results = await getAllAsync<DatabaseInventory>(
    `SELECT * FROM inventories 
     WHERE name LIKE ? OR description LIKE ? 
     ORDER BY name ASC`,
    [`%${query}%`, `%${query}%`]
  );
  
  return results.map(mapDbToInventory);
}
