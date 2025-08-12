import * as SQLite from 'expo-sqlite';

// Database configuration
const DB_NAME = 'inventory_app.db';
const DB_VERSION = 1;

// Database instance
let database: SQLite.SQLiteDatabase | null = null;

// Error types
export class DatabaseError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Initialize database connection and setup
 */
export async function initializeDatabase(): Promise<void> {
  try {
    if (database) {
      return; // Already initialized
    }

    console.log('Initializing database...');
    database = await SQLite.openDatabaseAsync(DB_NAME);
    
    // Enable foreign key constraints
    await database.execAsync('PRAGMA foreign_keys = ON;');
    
    console.log('Database connection established successfully');
  } catch (error) {
    throw new DatabaseError('Failed to initialize database', error as Error);
  }
}

/**
 * Get database instance (ensure initialization)
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!database) {
    await initializeDatabase();
  }
  return database!;
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (database) {
    await database.closeAsync();
    database = null;
    console.log('Database connection closed');
  }
}

/**
 * Execute SQL with error handling
 */
export async function executeSql(
  sql: string, 
  params: any[] = []
): Promise<SQLite.SQLiteRunResult> {
  try {
    const db = await getDatabase();
    return await db.runAsync(sql, params);
  } catch (error) {
    throw new DatabaseError(`SQL execution failed: ${sql}`, error as Error);
  }
}

/**
 * Get first row result with error handling
 */
export async function getFirstAsync<T>(
  sql: string, 
  params: any[] = []
): Promise<T | null> {
  try {
    const db = await getDatabase();
    return await db.getFirstAsync<T>(sql, params);
  } catch (error) {
    throw new DatabaseError(`SQL query failed: ${sql}`, error as Error);
  }
}

/**
 * Get all rows result with error handling
 */
export async function getAllAsync<T>(
  sql: string, 
  params: any[] = []
): Promise<T[]> {
  try {
    const db = await getDatabase();
    return await db.getAllAsync<T>(sql, params);
  } catch (error) {
    throw new DatabaseError(`SQL query failed: ${sql}`, error as Error);
  }
}

/**
 * Execute transaction with error handling and rollback
 */
export async function executeTransaction<T>(
  operations: (db: SQLite.SQLiteDatabase) => Promise<T>
): Promise<T> {
  const db = await getDatabase();
  
  try {
    await db.execAsync('BEGIN TRANSACTION;');
    const result = await operations(db);
    await db.execAsync('COMMIT;');
    return result;
  } catch (error) {
    await db.execAsync('ROLLBACK;');
    throw new DatabaseError('Transaction failed and was rolled back', error as Error);
  }
}
