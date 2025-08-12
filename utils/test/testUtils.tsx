import { render, RenderOptions } from '@testing-library/react-native';
import React from 'react';

// Mock database for testing
export const createMockDatabase = () => ({
  runSync: jest.fn(),
  prepareSync: jest.fn(() => ({
    executeSync: jest.fn(),
    finalizeSync: jest.fn(),
  })),
  execSync: jest.fn(),
  closeSync: jest.fn(),
  getAllSync: jest.fn(() => []),
  getFirstSync: jest.fn(() => null),
});

// Mock router for testing
export const createMockRouter = () => ({
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  canGoBack: jest.fn(() => true),
});

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add any custom options here
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  // For now, just render without providers to avoid dependency issues
  // GlueStack UI components are mocked in jest.setup.js
  return render(ui, options);
};

// Mock store data
export const mockInventoryData = {
  id: 'inv_1234567890_abc',
  name: 'Test Inventory',
  description: 'A test inventory for testing',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockItemData = {
  id: 'item_1234567890_def',
  inventoryId: 'inv_1234567890_abc',
  name: 'Test Item',
  description: 'A test item for testing',
  quantity: 1,
  price: 9.99,
  barcode: '1234567890123',
  category: 'Test Category',
  location: 'Test Location',
  expirationDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Database test helpers
export const setupTestDatabase = () => {
  const mockDb = createMockDatabase();
  
  // Mock successful database operations by default
  mockDb.runSync.mockReturnValue({ changes: 1, lastInsertRowId: 1 });
  mockDb.getAllSync.mockReturnValue([]);
  mockDb.getFirstSync.mockReturnValue(null);

  return mockDb;
};

// Async helpers for testing promises
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Form validation test helpers
export const getFormValidationErrors = (component: any) => {
  const errorElements = component.getAllByText(/error|required|invalid/i);
  return errorElements.map((el: any) => el.props.children);
};

// Navigation test helpers
export const expectNavigationCall = (mockRouter: any, method: string, args?: any) => {
  if (args) {
    expect(mockRouter[method]).toHaveBeenCalledWith(args);
  } else {
    expect(mockRouter[method]).toHaveBeenCalled();
  }
};

// Re-export everything from React Native Testing Library
export * from '@testing-library/react-native';
