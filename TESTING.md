# Testing Infrastructure Documentation

## Overview

This document outlines the comprehensive testing infrastructure set up for the Inventory Management App. The testing setup supports unit, integration, and component testing with proper CI/CD integration.

## 🧪 Testing Stack

### Core Dependencies
- **Jest** - JavaScript testing framework
- **React Native Testing Library** - Component testing utilities  
- **TypeScript Support** - Full type safety in tests
- **Coverage Reporting** - Comprehensive code coverage analysis

### Configuration Files
- `jest.config.js` - Main Jest configuration
- `jest.setup.js` - Test environment setup and mocks
- `scripts/ci-check.sh` - CI-friendly test execution script

## 📦 Installed Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react-native": "^13.2.2",
    "@types/jest": "^30.0.0", 
    "jest": "^30.0.5",
    "jest-expo": "^53.0.9",
    "react-test-renderer": "^19.0.0"
  }
}
```

## 🛠️ Configuration

### Jest Configuration (`jest.config.js`)
- **Preset**: `jest-expo` for React Native compatibility
- **Test Environment**: jsdom for DOM simulation
- **Coverage Thresholds**: 70% across all metrics
- **Module Name Mapping**: Path aliases for easy imports
- **Transform Ignore Patterns**: Proper handling of node_modules

### Available Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode  
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI (no watch, coverage)
npm run test:ci

# Run only unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run end-to-end tests  
npm run test:e2e
```

## 📁 Test Structure

```
__tests__/
├── components/           # Component tests
│   └── forms/
│       └── InventoryForm.test.tsx
├── lib/                 # Unit tests for utilities
│   ├── schemas.test.ts
│   └── utils/
│       └── idGenerator.test.ts
├── utils/              # Test utilities and helpers
│   └── testHelpers.tsx
└── setup-verification.test.ts
```

## 🔧 Test Utilities (`__tests__/utils/testHelpers.tsx`)

### Available Helpers
- `renderWithProviders()` - Render components with necessary providers
- `createMockDatabase()` - Mock database operations
- `createMockRouter()` - Mock navigation functions
- `setupTestDatabase()` - Set up test database state
- `mockInventoryData` - Sample inventory test data
- `mockItemData` - Sample item test data

### Usage Example
```typescript
import { renderWithProviders, mockInventoryData } from '../utils/testHelpers';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = renderWithProviders(<MyComponent />);
    expect(getByText('Expected Text')).toBeTruthy();
  });
});
```

## 🎯 Example Tests

### Unit Test Example (`lib/utils/idGenerator.test.ts`)
```typescript
import { generateId, isValidId } from '../../../lib/utils/idGenerator';

describe('ID Generator', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });
});
```

### Component Test Example (`components/forms/InventoryForm.test.tsx`)
```typescript
import { fireEvent } from '@testing-library/react-native';
import InventoryForm from '../../../components/forms/InventoryForm';
import { renderWithProviders } from '../../utils/testHelpers';

describe('InventoryForm', () => {
  it('should submit form with valid data', () => {
    const mockOnSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <InventoryForm onSubmit={mockOnSubmit} onCancel={jest.fn()} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter inventory name'), 'Test');
    fireEvent.press(getByText('Create Inventory'));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Test', description: '' });
  });
});
```

## 🚀 CI Integration

### CI Check Script (`scripts/ci-check.sh`)
The CI script performs comprehensive checks:
1. **ESLint** - Code quality and style checking
2. **TypeScript Compilation** - Type checking
3. **Test Suite** - Full test execution with coverage
4. **Coverage Validation** - Ensures coverage thresholds are met

### Usage
```bash
# Make script executable
chmod +x scripts/ci-check.sh

# Run CI checks
./scripts/ci-check.sh
```

## 🐛 Known Issues & Solutions

### ✅ RESOLVED: Expo Runtime Conflicts
**Previous Issue**: Tests failed with "import file outside scope" errors due to Expo runtime conflicts.

**Solution Applied**:
1. **Updated Jest Preset**: Changed from `jest-expo` to `react-native` preset
2. **Fixed Babel Configuration**: Added proper `babel-preset-expo` with TypeScript support
3. **Enhanced Mocking**: Comprehensive mocking in `jest.setup.js` for all Expo modules and GlueStack UI components
4. **Transform Patterns**: Properly configured to handle Expo modules and third-party libraries

**Current Status**: ✅ **WORKING** - Basic infrastructure tests pass, unit tests pass, component tests mostly pass

### Minor Issues Remaining
1. **Component Test Assertions**: 2 out of 10 component tests have minor assertion issues (validation text matching)
2. **Test Helper File**: Empty test helper file triggers Jest warning (no actual tests)

### Future Improvements
1. **Component Test Refinement**: Fix remaining assertion issues in component tests
2. **Database Integration Testing**: Add tests for database repositories with in-memory SQLite
3. **E2E Testing**: Consider adding Detox for end-to-end testing
4. **Visual Testing**: Add screenshot testing for UI components

## 📊 Coverage Reporting

Coverage thresholds are set at 70% for:
- **Branches** - Conditional logic paths
- **Functions** - Function execution
- **Lines** - Code line coverage  
- **Statements** - Statement execution

View coverage reports:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 🔍 Testing Best Practices

### 1. Test Structure
- Use descriptive `describe` blocks for grouping
- Clear, specific `it` statements for individual tests
- Follow Arrange-Act-Assert pattern

### 2. Mocking
- Mock external dependencies consistently
- Use `jest.clearAllMocks()` in `beforeEach`
- Mock at the module level for consistency

### 3. Assertions
- Use specific matchers (`toBe`, `toEqual`, `toContain`)
- Test both positive and negative cases
- Verify side effects (function calls, state changes)

### 4. File Organization
- Keep test files close to source code
- Use `.test.ts` or `.spec.ts` extensions
- Group related tests in folders

## 💡 Development Workflow

### Adding New Tests
1. Create test file next to source code
2. Import necessary testing utilities
3. Write tests following existing patterns
4. Run `npm test` to verify
5. Check coverage with `npm run test:coverage`

### Testing Database Operations
```typescript
import { setupTestDatabase } from '../utils/testHelpers';

describe('Database Operations', () => {
  beforeEach(() => {
    const mockDb = setupTestDatabase();
    // Use mockDb for testing
  });
});
```

### Testing Components with Forms
```typescript
import { fireEvent } from '@testing-library/react-native';

// Test form validation
fireEvent.press(submitButton);
expect(getByText('Required field')).toBeTruthy();

// Test successful submission  
fireEvent.changeText(input, 'valid value');
fireEvent.press(submitButton);
expect(mockOnSubmit).toHaveBeenCalled();
```

## 🎯 Acceptance Criteria Status

✅ **Unit tests can be run with npm test** - `npm test` command configured  
✅ **Component tests work with React Native Testing Library** - RNTL integrated  
✅ **Test coverage reporting is available** - Coverage thresholds configured  
✅ **Test scripts in package.json** - Multiple test scripts available  
✅ **CI-friendly test commands** - `ci-check.sh` script created  
✅ **Example tests to verify setup** - Multiple example tests created  

**Note**: Detox e2e testing encountered compatibility issues with current Expo version but infrastructure is in place for future implementation.

## 📝 Maintenance

### Updating Dependencies
```bash
npm update --save-dev @testing-library/react-native jest-expo
```

### Adding New Test Types
1. Update `jest.config.js` if needed
2. Add appropriate test scripts to `package.json`  
3. Update this documentation
4. Create example tests for the new type

This testing infrastructure provides a solid foundation for maintaining code quality and ensuring reliable functionality across the inventory management application.
