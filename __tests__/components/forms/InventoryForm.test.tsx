import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import InventoryForm from '../../../components/forms/InventoryForm';
import { renderWithProviders } from '../../../utils/test/testUtils';

// Mock the router
const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}));

// Mock the store
const mockStore = {
  addInventory: jest.fn(),
  inventories: [],
  isLoading: false,
};

jest.mock('../../../lib/databaseStore', () => ({
  useDatabaseStore: () => mockStore,
}));

describe('InventoryForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <InventoryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );
    
    expect(getByPlaceholderText('Enter inventory name')).toBeTruthy();
    expect(getByPlaceholderText('Optional description')).toBeTruthy();
  });

  it('should render Create Inventory button', () => {
    const { getByText } = renderWithProviders(
      <InventoryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );
    
    expect(getByText('Create Inventory')).toBeTruthy();
  });

  it('should show validation error for empty name', () => {
    const { getByText } = renderWithProviders(
      <InventoryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );
    
    const submitButton = getByText('Create Inventory');
    fireEvent.press(submitButton);
    
    // Should show validation error (Zod will show "Inventory name is required" for empty string)
    expect(getByText('Inventory name is required')).toBeTruthy();
  });

  it('should update input values when typing', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <InventoryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );
    
    const nameInput = getByPlaceholderText('Enter inventory name');
    const descriptionInput = getByPlaceholderText('Optional description');
    
    fireEvent.changeText(nameInput, 'Test Inventory');
    fireEvent.changeText(descriptionInput, 'Test Description');
    
    expect(nameInput.props.value).toBe('Test Inventory');
    expect(descriptionInput.props.value).toBe('Test Description');
  });

  it('should call onSubmit with valid data', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <InventoryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );
    
    const nameInput = getByPlaceholderText('Enter inventory name');
    const descriptionInput = getByPlaceholderText('Optional description');
    const submitButton = getByText('Create Inventory');
    
    // Fill form with valid data
    fireEvent.changeText(nameInput, 'Test Inventory');
    fireEvent.changeText(descriptionInput, 'Test Description');
    
    // Submit form
    fireEvent.press(submitButton);
    
    // Verify onSubmit was called
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Inventory',
      description: 'Test Description',
    });
  });

  it('should call onCancel when cancel button is pressed', () => {
    const { getByText } = renderWithProviders(
      <InventoryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );
    
    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should show loading state during submission', () => {
    const { getByText } = renderWithProviders(
      <InventoryForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );
    
    // Should show loading text instead of normal button text
    expect(getByText('Saving...')).toBeTruthy();
  });

  it('should disable buttons when loading', () => {
    const { getByText } = renderWithProviders(
      <InventoryForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );
    
    const submitButton = getByText('Saving...');
    const cancelButton = getByText('Cancel');
    
    // GlueStack UI Button uses isDisabled prop
    expect(submitButton.props.isDisabled).toBe(true);
    expect(cancelButton.props.isDisabled).toBe(true);
  });

  it('should trim whitespace from inputs', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <InventoryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );
    
    const nameInput = getByPlaceholderText('Enter inventory name');
    const submitButton = getByText('Create Inventory');
    
    // Input with leading/trailing spaces
    fireEvent.changeText(nameInput, '  Test Inventory  ');
    fireEvent.press(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Inventory',
      description: '',
    });
  });

  it('should work in edit mode', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <InventoryForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        mode="edit"
        initialData={{ name: 'Existing Inventory', description: 'Existing Description' }}
      />
    );
    
    const nameInput = getByPlaceholderText('Enter inventory name');
    const descriptionInput = getByPlaceholderText('Optional description');
    const submitButton = getByText('Update Inventory');
    
    expect(nameInput.props.value).toBe('Existing Inventory');
    expect(descriptionInput.props.value).toBe('Existing Description');
    expect(submitButton).toBeTruthy();
  });
});
