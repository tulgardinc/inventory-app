// Main database service exports
export * from './connection';
export * from './inventoryRepository';
export * from './itemRepository';
export * from './migrations';
export * from './types';

// Initialize database with all migrations
import { initializeDatabase } from './connection';
import { runMigrations } from './migrations';

/**
 * Initialize the complete database service
 */
export async function initializeDatabaseService(): Promise<void> {
  try {
    // Initialize connection
    await initializeDatabase();
    
    // Run any pending migrations
    await runMigrations();
    
    console.log('Database service initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database service:', error);
    throw error;
  }
}
