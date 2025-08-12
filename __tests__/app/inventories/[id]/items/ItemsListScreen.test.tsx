import ItemsListScreen from '@/app/inventories/[id]/items/index';
import { useDatabaseStore } from '@/lib/databaseStore';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock database store
jest.mock('@/lib/databaseStore', () => ({
  useDatabaseStore: jest.fn(),
}));

const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUseDatabaseStore = useDatabaseStore as jest.MockedFunction<typeof useDatabaseStore>;

describe('ItemsListScreen', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  const mockInventory = {
    id: 'inv_123',
    name: 'Test Inventory',
    description: 'Test Description',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockItems = [
    {
      id: 'item_1',
      inventoryId: 'inv_123',
      name: 'Test Item 1',
      description: 'Item 1 description',
      quantity: 5,
      price: 29.99,
      category: 'Electronics',
      location: 'Shelf A',
      barcode: '1234567890123',
      expirationDate: new Date('2025-06-15'),
      entryDate: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'item_2',
      inventoryId: 'inv_123',
      name: 'Test Item 2',
      description: undefined,
      quantity: 2,
      price: undefined,
      category: 'Food',
      location: 'Fridge',
      barcode: undefined,
      expirationDate: new Date('2024-12-31'),
      entryDate: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  const mockStoreDefaults = {
    // State
    inventories: [mockInventory],
    items: mockItems,
    currentInventoryId: null,
    isLoadingInventories: false,
    isLoadingItems: false,
    isInitialized: true,
    
    // Database initialization
    initializeDatabase: jest.fn(),
    
    // Inventory operations
    loadInventories: jest.fn(),
    createInventory: jest.fn(),
    updateInventory: jest.fn(),
    deleteInventory: jest.fn(),
    
    // Item operations
    loadItemsForInventory: jest.fn(),
    createItem: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
    
    // Navigation
    setCurrentInventory: jest.fn(),
    
    // Computed getters
    getCurrentInventory: jest.fn(),
    getCurrentInventoryItems: jest.fn(),
    getInventoryById: jest.fn().mockReturnValue(mockInventory),
    getItemById: jest.fn(),
    getItemsForInventory: jest.fn().mockReturnValue(mockItems),
    totalInventories: jest.fn().mockReturnValue(1),
    totalItems: jest.fn().mockReturnValue(2),
    getInventoryItemCount: jest.fn().mockReturnValue(2),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseLocalSearchParams.mockReturnValue({ id: 'inv_123' });
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseDatabaseStore.mockImplementation((selector) => 
      selector(mockStoreDefaults)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Render and Basic Functionality', () => {
    it('should render inventory name and item count', async () => {
      render(<ItemsListScreen />);
      
      expect(screen.getByText('Test Inventory - Items')).toBeTruthy();
      expect(screen.getByText('2 items')).toBeTruthy();
    });

    it('should render add new item button', () => {
      render(<ItemsListScreen />);
      
      expect(screen.getByText('Add New Item')).toBeTruthy();
    });

    it('should show empty state when no items exist', () => {
      mockUseDatabaseStore.mockImplementation((selector) =>
        selector({
          ...mockStoreDefaults,
          items: [],
          getItemsForInventory: jest.fn().mockReturnValue([]),
        })
      );

      render(<ItemsListScreen />);
      
      expect(screen.getByText('No items yet')).toBeTruthy();
      expect(screen.getByText('Add Your First Item')).toBeTruthy();
    });

    it('should handle missing inventory gracefully', () => {
      mockUseDatabaseStore.mockImplementation((selector) =>
        selector({
          ...mockStoreDefaults,
          getInventoryById: jest.fn().mockReturnValue(null),
        })
      );

      render(<ItemsListScreen />);
      
      expect(screen.getByText('Inventory not found')).toBeTruthy();
      expect(screen.getByText('Go Back')).toBeTruthy();
    });
  });

  describe('Item Display - All 8 Fields', () => {
    it('should display all item fields for complete items', () => {
      render(<ItemsListScreen />);
      
      // Item 1 - complete item
      expect(screen.getByText('Test Item 1')).toBeTruthy();
      expect(screen.getByText('Item 1 description')).toBeTruthy();
      expect(screen.getByText('Qty: 5')).toBeTruthy();
      expect(screen.getByText('$29.99')).toBeTruthy();
      expect(screen.getByText('Electronics')).toBeTruthy();
      expect(screen.getByText('Shelf A')).toBeTruthy();
      expect(screen.getByText('Expires: Jun 15, 2025')).toBeTruthy();
      expect(screen.getByText('Barcode: 1234567890123')).toBeTruthy();
    });

    it('should handle optional fields gracefully', () => {
      render(<ItemsListScreen />);
      
      // Item 2 - missing optional fields
      expect(screen.getByText('Test Item 2')).toBeTruthy();
      expect(screen.getByText('Qty: 2')).toBeTruthy();
      expect(screen.getByText('Food')).toBeTruthy();
      expect(screen.getByText('Fridge')).toBeTruthy();
      expect(screen.getByText('Expires: Dec 31, 2024')).toBeTruthy();
      
      // Should not show price, barcode, or description for item 2
      expect(screen.queryByText('$0.00')).toBeNull();
      expect(screen.queryByText('Barcode:')).toBeNull();
    });

    it('should show expiration status indicators', () => {
      const expiredItem = {
        ...mockItems[0],
        id: 'item_expired',
        expirationDate: new Date('2023-01-01'), // Expired
      };

      const soonToExpireItem = {
        ...mockItems[0],
        id: 'item_soon',
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      };

      mockUseDatabaseStore.mockImplementation((selector) =>
        selector({
          ...mockStoreDefaults,
          items: [expiredItem, soonToExpireItem],
          getItemsForInventory: jest.fn().mockReturnValue([expiredItem, soonToExpireItem]),
        })
      );

      render(<ItemsListScreen />);
      
      expect(screen.getByText('EXPIRED')).toBeTruthy();
      expect(screen.getByText('EXPIRING SOON')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to add item screen when add button pressed', () => {
      render(<ItemsListScreen />);
      
      const addButton = screen.getByText('Add New Item');
      fireEvent.press(addButton);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/inventories/inv_123/items/create');
    });

    it('should navigate to item detail screen when item pressed', () => {
      render(<ItemsListScreen />);
      
      const itemButton = screen.getByText('Test Item 1').parent?.parent;
      expect(itemButton).toBeTruthy();
      
      fireEvent.press(itemButton);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/inventories/inv_123/items/item_1');
    });

    it('should navigate back when inventory not found', () => {
      mockUseDatabaseStore.mockImplementation((selector) =>
        selector({
          ...mockStoreDefaults,
          getInventoryById: jest.fn().mockReturnValue(null),
        })
      );

      render(<ItemsListScreen />);
      
      const backButton = screen.getByText('Go Back');
      fireEvent.press(backButton);
      
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  describe('Delete Functionality', () => {
    it('should show delete button on long press', async () => {
      render(<ItemsListScreen />);
      
      const itemButton = screen.getByText('Test Item 1').parent?.parent;
      expect(itemButton).toBeTruthy();
      
      fireEvent(itemButton, 'longPress');
      
      await waitFor(() => {
        expect(screen.getByText('Delete')).toBeTruthy();
        expect(screen.getByText('Edit')).toBeTruthy();
        expect(screen.getByText('Cancel')).toBeTruthy();
      });
    });

    it('should show confirmation dialog when delete pressed', async () => {
      render(<ItemsListScreen />);
      
      const itemButton = screen.getByText('Test Item 1').parent?.parent;
      fireEvent(itemButton, 'longPress');
      
      await waitFor(() => {
        const deleteButton = screen.getByText('Delete');
        fireEvent.press(deleteButton);
      });
      
      expect(screen.getByText('Delete Item')).toBeTruthy();
      expect(screen.getByText('Are you sure you want to delete "Test Item 1"?')).toBeTruthy();
      expect(screen.getByText('This action cannot be undone.')).toBeTruthy();
    });

    it('should call deleteItem when confirmed', async () => {
      const mockDeleteItem = jest.fn().mockResolvedValue(true);
      mockUseDatabaseStore.mockImplementation((selector) =>
        selector({
          ...mockStoreDefaults,
          deleteItem: mockDeleteItem,
        })
      );

      render(<ItemsListScreen />);
      
      const itemButton = screen.getByText('Test Item 1').parent?.parent;
      fireEvent(itemButton, 'longPress');
      
      await waitFor(() => {
        const deleteButton = screen.getByText('Delete');
        fireEvent.press(deleteButton);
      });
      
      const confirmButton = screen.getByText('Delete');
      fireEvent.press(confirmButton);
      
      expect(mockDeleteItem).toHaveBeenCalledWith('item_1');
    });

    it('should handle delete errors gracefully', async () => {
      const mockDeleteItem = jest.fn().mockRejectedValue(new Error('Delete failed'));
      mockUseDatabaseStore.mockImplementation((selector) =>
        selector({
          ...mockStoreDefaults,
          deleteItem: mockDeleteItem,
        })
      );

      render(<ItemsListScreen />);
      
      const itemButton = screen.getByText('Test Item 1').parent?.parent;
      fireEvent(itemButton, 'longPress');
      
      await waitFor(() => {
        const deleteButton = screen.getByText('Delete');
        fireEvent.press(deleteButton);
      });
      
      // Get the last "Delete" button which should be in the dialog footer
      const deleteButtons = screen.getAllByText('Delete');
      const confirmButton = deleteButtons[deleteButtons.length - 1];
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to delete item')).toBeTruthy();
      });
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading state', () => {
      mockUseDatabaseStore.mockImplementation((selector) =>
        selector({
          ...mockStoreDefaults,
          isLoadingItems: true,
        })
      );

      render(<ItemsListScreen />);
      
      expect(screen.getByText('Loading items...')).toBeTruthy();
    });
  });

  describe('Data Loading', () => {
    it('should load items on mount', () => {
      const mockLoadItemsForInventory = jest.fn();
      mockUseDatabaseStore.mockImplementation((selector) =>
        selector({
          ...mockStoreDefaults,
          loadItemsForInventory: mockLoadItemsForInventory,
        })
      );

      render(<ItemsListScreen />);
      
      expect(mockLoadItemsForInventory).toHaveBeenCalledWith('inv_123');
    });

    it('should handle array inventory ID parameter', () => {
      mockUseLocalSearchParams.mockReturnValue({ id: ['inv_456'] });
      
      const mockLoadItemsForInventory = jest.fn();
      mockUseDatabaseStore.mockImplementation((selector) =>
        selector({
          ...mockStoreDefaults,
          loadItemsForInventory: mockLoadItemsForInventory,
        })
      );

      render(<ItemsListScreen />);
      
      expect(mockLoadItemsForInventory).toHaveBeenCalledWith('inv_456');
    });
  });
});
