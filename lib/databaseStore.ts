import { create } from 'zustand';
import {
    createInventory as dbCreateInventory,
    createItem as dbCreateItem,
    deleteInventory as dbDeleteInventory,
    deleteItem as dbDeleteItem,
    updateInventory as dbUpdateInventory,
    updateItem as dbUpdateItem,
    getAllInventories,
    getItemsByInventoryId,
    initializeDatabaseService,
} from './database';
import type { CreateInventory, CreateItem, Inventory, Item } from './schemas';

interface DatabaseStore {
  // State
  inventories: Inventory[];
  items: Item[];
  currentInventoryId: string | null;
  isLoadingInventories: boolean;
  isLoadingItems: boolean;
  isInitialized: boolean;
  
  // Database initialization
  initializeDatabase: () => Promise<void>;
  
  // Inventory operations
  loadInventories: () => Promise<void>;
  createInventory: (data: CreateInventory) => Promise<Inventory>;
  updateInventory: (id: string, data: Partial<Inventory>) => Promise<void>;
  deleteInventory: (id: string) => Promise<void>;
  
  // Item operations
  loadItemsForInventory: (inventoryId: string) => Promise<void>;
  createItem: (data: CreateItem) => Promise<Item>;
  updateItem: (id: string, data: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  
  // Navigation
  setCurrentInventory: (inventoryId: string | null) => void;
  
  // Computed getters
  getCurrentInventory: () => Inventory | null;
  getCurrentInventoryItems: () => Item[];
  getInventoryById: (id: string) => Inventory | undefined;
  getItemById: (id: string) => Item | undefined;
  getItemsForInventory: (inventoryId: string) => Item[];
  totalInventories: () => number;
  totalItems: () => number;
  getInventoryItemCount: (inventoryId: string) => number;
}

export const useDatabaseStore = create<DatabaseStore>((set, get) => ({
  // Initial state
  inventories: [],
  items: [],
  currentInventoryId: null,
  isLoadingInventories: false,
  isLoadingItems: false,
  isInitialized: false,
  
  // Database initialization
  initializeDatabase: async () => {
    try {
      await initializeDatabaseService();
      set({ isInitialized: true });
      console.log('Database store initialized');
    } catch (error) {
      console.error('Failed to initialize database store:', error);
      throw error;
    }
  },
  
  // Inventory operations
  loadInventories: async () => {
    set({ isLoadingInventories: true });
    try {
      const inventories = await getAllInventories();
      set({ inventories, isLoadingInventories: false });
    } catch (error) {
      set({ isLoadingInventories: false });
      console.error('Failed to load inventories:', error);
      throw error;
    }
  },
  
  createInventory: async (data: CreateInventory) => {
    try {
      const inventory = await dbCreateInventory(data);
      set(state => ({
        inventories: [...state.inventories, inventory]
      }));
      return inventory;
    } catch (error) {
      console.error('Failed to create inventory:', error);
      throw error;
    }
  },
  
  updateInventory: async (id: string, data: Partial<Inventory>) => {
    try {
      const updatedInventory = await dbUpdateInventory(id, data);
      if (updatedInventory) {
        set(state => ({
          inventories: state.inventories.map(inv =>
            inv.id === id ? updatedInventory : inv
          )
        }));
      }
    } catch (error) {
      console.error('Failed to update inventory:', error);
      throw error;
    }
  },
  
  deleteInventory: async (id: string) => {
    try {
      await dbDeleteInventory(id);
      set(state => ({
        inventories: state.inventories.filter(inv => inv.id !== id),
        items: state.items.filter(item => item.inventoryId !== id),
        currentInventoryId: state.currentInventoryId === id ? null : state.currentInventoryId
      }));
    } catch (error) {
      console.error('Failed to delete inventory:', error);
      throw error;
    }
  },
  
  // Item operations
  loadItemsForInventory: async (inventoryId: string) => {
    set({ isLoadingItems: true });
    try {
      const items = await getItemsByInventoryId(inventoryId);
      set(state => ({
        items: [
          ...state.items.filter(item => item.inventoryId !== inventoryId),
          ...items
        ],
        isLoadingItems: false
      }));
    } catch (error) {
      set({ isLoadingItems: false });
      console.error('Failed to load items:', error);
      throw error;
    }
  },
  
  createItem: async (data: CreateItem) => {
    try {
      const item = await dbCreateItem(data);
      set(state => ({
        items: [...state.items, item]
      }));
      return item;
    } catch (error) {
      console.error('Failed to create item:', error);
      throw error;
    }
  },
  
  updateItem: async (id: string, data: Partial<Item>) => {
    try {
      const updatedItem = await dbUpdateItem(id, data);
      if (updatedItem) {
        set(state => ({
          items: state.items.map(item =>
            item.id === id ? updatedItem : item
          )
        }));
      }
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error;
    }
  },
  
  deleteItem: async (id: string) => {
    try {
      await dbDeleteItem(id);
      set(state => ({
        items: state.items.filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  },
  
  // Navigation
  setCurrentInventory: (inventoryId: string | null) => {
    set({ currentInventoryId: inventoryId });
  },
  
  // Computed getters
  getCurrentInventory: () => {
    const { inventories, currentInventoryId } = get();
    return inventories.find(inv => inv.id === currentInventoryId) || null;
  },
  
  getCurrentInventoryItems: () => {
    const { items, currentInventoryId } = get();
    return items.filter(item => item.inventoryId === currentInventoryId);
  },
  
  getInventoryById: (id: string) => {
    return get().inventories.find(inv => inv.id === id);
  },
  
  getItemById: (id: string) => {
    return get().items.find(item => item.id === id);
  },
  
  getItemsForInventory: (inventoryId: string) => {
    return get().items.filter(item => item.inventoryId === inventoryId);
  },
  
  totalInventories: () => {
    return get().inventories.length;
  },
  
  totalItems: () => {
    return get().items.length;
  },
  
  getInventoryItemCount: (inventoryId: string) => {
    return get().items.filter(item => item.inventoryId === inventoryId).length;
  },
}));
