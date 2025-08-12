import { create } from 'zustand';
import type { Inventory, Item } from './schemas';

interface AppState {
  // Inventory state
  inventories: Inventory[];
  currentInventoryId: string | null;
  
  // Item state
  items: Item[];
  
  // Actions
  setCurrentInventory: (inventoryId: string | null) => void;
  addInventory: (inventory: Inventory) => void;
  removeInventory: (inventoryId: string) => void;
  updateInventory: (inventoryId: string, updates: Partial<Inventory>) => void;
  
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<Item>) => void;
  
  // Helper functions
  createInventory: (name: string, description?: string) => Inventory;
  createItem: (inventoryId: string, name: string, description?: string, barcode?: string) => Item;
  
  // Computed getters
  getCurrentInventory: () => Inventory | null;
  getCurrentInventoryItems: () => Item[];
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  inventories: [],
  currentInventoryId: null,
  items: [],
  
  // Actions
  setCurrentInventory: (inventoryId) => set({ currentInventoryId: inventoryId }),
  
  addInventory: (inventory) => set((state) => ({
    inventories: [...state.inventories, inventory]
  })),
  
  removeInventory: (inventoryId) => set((state) => ({
    inventories: state.inventories.filter(inv => inv.id !== inventoryId),
    items: state.items.filter(item => item.inventoryId !== inventoryId),
    currentInventoryId: state.currentInventoryId === inventoryId ? null : state.currentInventoryId
  })),
  
  updateInventory: (inventoryId, updates) => set((state) => ({
    inventories: state.inventories.map(inv => 
      inv.id === inventoryId 
        ? { ...inv, ...updates, updatedAt: new Date() }
        : inv
    )
  })),
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter(item => item.id !== itemId)
  })),
  
  updateItem: (itemId, updates) => set((state) => ({
    items: state.items.map(item => 
      item.id === itemId 
        ? { ...item, ...updates, updatedAt: new Date() }
        : item
    )
  })),
  
  // Helper functions
  createInventory: (name, description) => {
    const now = new Date();
    const inventory: Inventory = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      createdAt: now,
      updatedAt: now
    };
    get().addInventory(inventory);
    return inventory;
  },
  
  createItem: (inventoryId, name, description, barcode) => {
    const now = new Date();
    const item: Item = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      inventoryId,
      name,
      description,
      quantity: 1,
      barcode,
      entryDate: now,
      updatedAt: now
    };
    get().addItem(item);
    return item;
  },
  
  // Computed getters
  getCurrentInventory: () => {
    const { inventories, currentInventoryId } = get();
    return inventories.find(inv => inv.id === currentInventoryId) || null;
  },
  
  getCurrentInventoryItems: () => {
    const { items, currentInventoryId } = get();
    return items.filter(item => item.inventoryId === currentInventoryId);
  }
}));
