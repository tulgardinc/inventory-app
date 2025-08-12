import { getDatabase, getFirstAsync } from './connection';
import { Migration } from './types';

// Migration definitions
const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    up: [
      `CREATE TABLE IF NOT EXISTS inventories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );`,
      
      `CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY NOT NULL,
        inventory_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        quantity INTEGER NOT NULL DEFAULT 0,
        price REAL,
        category TEXT,
        location TEXT,
        barcode TEXT,
        expiration_date TEXT,
        entry_date TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (inventory_id) REFERENCES inventories (id) ON DELETE CASCADE
      );`,
      
      `CREATE INDEX IF NOT EXISTS idx_items_inventory_id ON items (inventory_id);`,
      `CREATE INDEX IF NOT EXISTS idx_items_barcode ON items (barcode) WHERE barcode IS NOT NULL;`,
      `CREATE INDEX IF NOT EXISTS idx_items_name ON items (name);`,
      `CREATE INDEX IF NOT EXISTS idx_inventories_name ON inventories (name);`,
      
      `CREATE TABLE IF NOT EXISTS schema_versions (
        version INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL
      );`
    ],
    down: [
      `DROP INDEX IF EXISTS idx_inventories_name;`,
      `DROP INDEX IF EXISTS idx_items_name;`,
      `DROP INDEX IF EXISTS idx_items_barcode;`,
      `DROP INDEX IF EXISTS idx_items_inventory_id;`,
      `DROP TABLE IF EXISTS items;`,
      `DROP TABLE IF EXISTS inventories;`,
      `DROP TABLE IF EXISTS schema_versions;`
    ]
  }
];

/**
 * Get current schema version from database
 */
async function getCurrentVersion(): Promise<number> {
  try {
    const result = await getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_versions ORDER BY version DESC LIMIT 1'
    );
    return result?.version || 0;
  } catch (error) {
    // Schema versions table doesn't exist yet
    return 0;
  }
}

/**
 * Apply a single migration
 */
async function applyMigration(migration: Migration): Promise<void> {
  const db = await getDatabase();
  
  console.log(`Applying migration ${migration.version}: ${migration.name}`);
  
  try {
    await db.execAsync('BEGIN TRANSACTION;');
    
    // Execute all up migrations
    for (const sql of migration.up) {
      await db.execAsync(sql);
    }
    
    // Record migration
    await db.runAsync(
      'INSERT OR REPLACE INTO schema_versions (version, applied_at) VALUES (?, ?)',
      [migration.version, new Date().toISOString()]
    );
    
    await db.execAsync('COMMIT;');
    console.log(`Migration ${migration.version} applied successfully`);
  } catch (error) {
    await db.execAsync('ROLLBACK;');
    throw new Error(`Failed to apply migration ${migration.version}: ${error}`);
  }
}

/**
 * Run all pending migrations
 */
export async function runMigrations(): Promise<void> {
  const currentVersion = await getCurrentVersion();
  const pendingMigrations = MIGRATIONS.filter(m => m.version > currentVersion);
  
  if (pendingMigrations.length === 0) {
    console.log('No pending migrations');
    return;
  }
  
  console.log(`Running ${pendingMigrations.length} pending migrations...`);
  
  for (const migration of pendingMigrations) {
    await applyMigration(migration);
  }
  
  console.log('All migrations completed successfully');
}

/**
 * Rollback to a specific version (for development/testing)
 */
export async function rollbackToVersion(targetVersion: number): Promise<void> {
  const currentVersion = await getCurrentVersion();
  
  if (targetVersion >= currentVersion) {
    console.log('No rollback needed');
    return;
  }
  
  const migrationsToRollback = MIGRATIONS
    .filter(m => m.version > targetVersion && m.version <= currentVersion)
    .sort((a, b) => b.version - a.version); // Rollback in reverse order
  
  const db = await getDatabase();
  
  for (const migration of migrationsToRollback) {
    if (!migration.down) {
      throw new Error(`Migration ${migration.version} has no down migration`);
    }
    
    console.log(`Rolling back migration ${migration.version}: ${migration.name}`);
    
    try {
      await db.execAsync('BEGIN TRANSACTION;');
      
      // Execute all down migrations
      for (const sql of migration.down) {
        await db.execAsync(sql);
      }
      
      // Remove migration record
      await db.runAsync(
        'DELETE FROM schema_versions WHERE version = ?',
        [migration.version]
      );
      
      await db.execAsync('COMMIT;');
      console.log(`Migration ${migration.version} rolled back successfully`);
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw new Error(`Failed to rollback migration ${migration.version}: ${error}`);
    }
  }
  
  console.log(`Rollback to version ${targetVersion} completed`);
}
