import InventoriesScreen from '@/app/inventories/index';
import { useDatabaseStore } from '@/lib/databaseStore';
import type { Inventory } from '@/lib/schemas';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock database store
jest.mock('@/lib/databaseStore', () => ({
  useDatabaseStore: jest.fn(),
}));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  canGoBack: jest.fn(() => false),
  navigate: jest.fn(),
  dismiss: jest.fn(),
  dismissTo: jest.fn(),
  canDismiss: jest.fn(() => false),
  setParams: jest.fn(),
} as any;

const mockInventories: Inventory[] = [
  {
    id: 'inv-1',
    name: 'Home Inventory',
    description: 'Items in my house',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    id: 'inv-2',
    name: 'Office Supplies',
    description: 'Work related items',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  },
];

describe('InventoriesScreen', () => {
  const mockUseDatabaseStore = useDatabaseStore as jest.MockedFunction<typeof useDatabaseStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
  });

  describe('when loading inventories', () => {
    beforeEach(() => {
      mockUseDatabaseStore.mockImplementation((selector: any) => {
        const mockState = {
          inventories: [],
          isLoadingInventories: true,
          isInitialized: true,
          loadInventories: jest.fn(),
          initializeDatabase: jest.fn(),
          getInventoryItemCount: jest.fn(),
        };
        return selector(mockState);
      });
    });

    it('should display loading state while fetching inventories', () => {
      render(<InventoriesScreen />);
      
      expect(screen.getByText('Loading inventories...')).toBeOnTheScreen();
      expect(screen.queryByText('No inventories yet')).not.toBeOnTheScreen();
    });
  });

  describe('when database is not initialized', () => {
    beforeEach(() => {
      const mockInitializeDatabase = jest.fn();
      mockUseDatabaseStore.mockImplementation((selector: any) => {
        const mockState = {
          inventories: [],
          isLoadingInventories: false,
          isInitialized: false,
          loadInventories: jest.fn(),
          initializeDatabase: mockInitializeDatabase,
          getInventoryItemCount: jest.fn(),
        };
        return selector(mockState);
      });
    });

    it('should initialize database on mount', async () => {
      const mockInitializeDatabase = jest.fn().mockResolvedValue(undefined);
      const mockLoadInventories = jest.fn().mockResolvedValue(undefined);
      
      mockUseDatabaseStore.mockImplementation((selector: any) => {
        const mockState = {
          inventories: [],
          isLoadingInventories: false,
          isInitialized: false,
          loadInventories: mockLoadInventories,
          initializeDatabase: mockInitializeDatabase,
          getInventoryItemCount: jest.fn(),
        };
        return selector(mockState);
      });

      render(<InventoriesScreen />);

      await waitFor(() => {
        expect(mockInitializeDatabase).toHaveBeenCalled();
      });
    });
  });

  describe('when no inventories exist', () => {
    beforeEach(() => {
      mockUseDatabaseStore.mockImplementation((selector: any) => {
        const mockState = {
          inventories: [],
          isLoadingInventories: false,
          isInitialized: true,
          loadInventories: jest.fn(),
          initializeDatabase: jest.fn(),
          getInventoryItemCount: jest.fn(),
        };
        return selector(mockState);
      });
    });

    it('should show empty state with create button', () => {
      render(<InventoriesScreen />);

      expect(screen.getByText('No inventories yet')).toBeOnTheScreen();
      expect(screen.getByText('Create Your First Inventory')).toBeOnTheScreen();
    });

    it('should navigate to create screen when create button is pressed', () => {
      render(<InventoriesScreen />);

      fireEvent.press(screen.getByText('Create Your First Inventory'));
      expect(mockRouter.push).toHaveBeenCalledWith('/inventories/create');
    });
  });

  describe('when inventories exist', () => {
    beforeEach(() => {
      mockUseDatabaseStore.mockImplementation((selector: any) => {
        const mockState = {
          inventories: mockInventories,
          isLoadingInventories: false,
          isInitialized: true,
          loadInventories: jest.fn(),
          initializeDatabase: jest.fn(),
          getInventoryItemCount: (id: string) => {
            if (id === 'inv-1') return 5;
            if (id === 'inv-2') return 3;
            return 0;
          },
        };
        return selector(mockState);
      });
    });

    it('should display all inventories', () => {
      render(<InventoriesScreen />);

      expect(screen.getByText('Home Inventory')).toBeOnTheScreen();
      expect(screen.getByText('Items in my house')).toBeOnTheScreen();
      expect(screen.getByText('Office Supplies')).toBeOnTheScreen();
      expect(screen.getByText('Work related items')).toBeOnTheScreen();
    });

    it('should show item counts for each inventory', () => {
      render(<InventoriesScreen />);

      expect(screen.getByText('5 items')).toBeOnTheScreen();
      expect(screen.getByText('3 items')).toBeOnTheScreen();
    });

    it('should navigate to inventory details when inventory is pressed', () => {
      render(<InventoriesScreen />);

      fireEvent.press(screen.getByText('Home Inventory'));
      expect(mockRouter.push).toHaveBeenCalledWith('/inventories/inv-1');
    });

    it('should navigate to create screen when add new button is pressed', () => {
      render(<InventoriesScreen />);

      fireEvent.press(screen.getByText('Add New'));
      expect(mockRouter.push).toHaveBeenCalledWith('/inventories/create');
    });

    it('should show header with title and add button', () => {
      render(<InventoriesScreen />);

      expect(screen.getByText('My Inventories')).toBeOnTheScreen();
      expect(screen.getByText('Add New')).toBeOnTheScreen();
    });
  });

  describe('error handling', () => {
    it('should display error state when loading fails', async () => {
      const mockLoadInventories = jest.fn().mockRejectedValue(new Error('Database error'));
      const mockInitializeDatabase = jest.fn().mockResolvedValue(undefined);
      
      mockUseDatabaseStore.mockImplementation((selector: any) => {
        const mockState = {
          inventories: [],
          isLoadingInventories: false,
          isInitialized: true,
          loadInventories: mockLoadInventories,
          initializeDatabase: mockInitializeDatabase,
          getInventoryItemCount: jest.fn(),
        };
        return selector(mockState);
      });

      render(<InventoriesScreen />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load inventories')).toBeOnTheScreen();
        expect(screen.getByText('Try Again')).toBeOnTheScreen();
      });
    });

    it('should retry loading when try again button is pressed', async () => {
      const mockLoadInventories = jest.fn().mockRejectedValue(new Error('Database error'));
      const mockInitializeDatabase = jest.fn().mockResolvedValue(undefined);
      
      mockUseDatabaseStore.mockImplementation((selector: any) => {
        const mockState = {
          inventories: [],
          isLoadingInventories: false,
          isInitialized: true,
          loadInventories: mockLoadInventories,
          initializeDatabase: mockInitializeDatabase,
          getInventoryItemCount: jest.fn(),
        };
        return selector(mockState);
      });

      render(<InventoriesScreen />);

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeOnTheScreen();
      });

      fireEvent.press(screen.getByText('Try Again'));
      await waitFor(() => {
        expect(mockLoadInventories).toHaveBeenCalledTimes(2); // Once on mount, once on retry
      });
    });
  });
});
