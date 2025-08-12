# Tech Context: Technologies, Setup & Constraints

## Technology Stack (Currently Implemented)

### Core Framework
**Expo React Native ~53.0.20** ✅ **ACTIVE**
- Cross-platform mobile development (iOS/Android)
- TypeScript support with strict typing
- File-based routing with expo-router ~5.1.4
- New Architecture enabled for performance

### UI & Styling
**GlueStack UI v2 + NativeWind** ✅ **IMPLEMENTED**
- @gluestack-ui/themed ^1.1.69
- @gluestack-style/react ^1.0.57  
- nativewind ^4.1.23
- Modern, accessible component library
- Utility-first CSS with Tailwind-like classes
- Consistent design system throughout the app

### Data Storage
**SQLite with expo-sqlite** ✅ **OPERATIONAL**
- expo-sqlite ~14.0.6
- Local-first database storage with full ACID compliance
- Custom repository pattern implementation
- Migration system with versioning support
- Efficient queries with proper indexing
- Complete CRUD operations for inventories and items

### State Management
**Zustand** ✅ **IMPLEMENTED**
- zustand ^5.0.2
- Global state management with `useDatabaseStore`
- Type-safe state updates and selectors
- Integration with database operations
- Consistent data flow across all screens

### Form Validation & Data Handling
**Zod + React Hook Form patterns** ✅ **IMPLEMENTED**
- zod ^3.24.1
- Comprehensive schema validation for all forms
- Type-safe form handling
- Real-time validation feedback
- Integration with GlueStack UI components

### Camera & Scanning
**Modern Expo Camera API** ✅ **IMPLEMENTED** 
- expo-camera ~15.0.16
- Modern CameraView component (migrated from deprecated expo-barcode-scanner)
- useCameraPermissions hook for proper permission handling
- Barcode scanning ready for Phase 3 product API integration

### Date Handling
**React Native Community Date Picker** ✅ **IMPLEMENTED**
- @react-native-community/datetimepicker ^8.4.1
- Native date picker integration
- Cross-platform date/time selection
- Integrated into ItemForm for entry and expiration dates

### Navigation & Routing
**Expo Router** ✅ **OPERATIONAL**
- expo-router ~5.1.5
- File-based routing system with typed routes
- Dynamic routing with parameters (`[id]`, `[itemId]`)
- Tab-based navigation structure
- Modal and stack navigation support

### Testing Infrastructure
**Jest + React Native Testing Library** ✅ **OPERATIONAL**
- jest ^29.7.0
- @testing-library/react-native ^12.8.1
- @testing-library/jest-native ^5.4.3
- 64/64 tests passing (100% success rate)
- Comprehensive test coverage across all components
- TDD methodology with commit gates

## Current Project Structure (Implemented)

```
inventory-app/
├── app/                           # Expo Router pages
│   ├── (tabs)/                   # Tab navigation (placeholder)
│   ├── inventories/              # Complete inventory management
│   │   ├── index.tsx            # Inventory list screen
│   │   ├── create.tsx           # Inventory creation
│   │   └── [id]/                # Dynamic inventory routes
│   │       ├── index.tsx        # Inventory detail screen  
│   │       └── items/           # Complete item management
│   │           ├── index.tsx    # Items list screen
│   │           ├── create.tsx   # Item creation screen
│   │           └── [itemId]/    # Dynamic item routes
│   │               ├── index.tsx # Item detail screen
│   │               └── edit.tsx  # Item edit screen
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx           # 404 page
├── components/                   # Reusable components
│   ├── forms/                   # Form components
│   │   ├── InventoryForm.tsx    # Complete inventory form
│   │   ├── ItemForm.tsx         # Complete item form (8 fields)
│   │   └── BasicItemForm.tsx    # Simplified form variant
│   └── ui/                      # UI components
├── lib/                         # Core business logic
│   ├── database/                # Database service layer
│   │   ├── connection.ts        # Database connection management
│   │   ├── migrations.ts        # Schema migrations
│   │   ├── types.ts             # Database type definitions
│   │   ├── inventoryRepository.ts # Inventory CRUD operations
│   │   ├── itemRepository.ts    # Item CRUD operations
│   │   └── index.ts             # Database service exports
│   ├── utils/                   # Utility functions
│   │   └── idGenerator.ts       # ID generation utility
│   ├── databaseStore.ts         # Zustand database store
│   ├── store.ts                 # Additional stores (legacy)
│   └── schemas.ts               # Zod validation schemas
├── __tests__/                   # Test files (64/64 passing)
│   ├── app/                     # Screen component tests
│   ├── components/              # Component unit tests
│   ├── lib/                     # Business logic tests
│   └── utils/                   # Utility tests
├── scripts/                     # Development scripts
│   └── ci-check.sh              # CI/testing script
├── memory-bank/                 # Project documentation
├── assets/                      # Static assets
├── constants/                   # App constants  
└── hooks/                       # Custom React hooks
```

## Current Dependencies (Installed & Operational)

### Core Dependencies
```json
{
  "expo": "~53.0.20",
  "expo-router": "~5.1.5",  
  "react": "19.0.0",
  "react-native": "0.76.5",
  "typescript": "~5.8.3"
}
```

### UI & Styling Dependencies
```json
{
  "@gluestack-ui/themed": "^1.1.69",
  "@gluestack-style/react": "^1.0.57",
  "nativewind": "^4.1.23",
  "tailwindcss": "^3.4.15"
}
```

### Data & State Management
```json
{
  "expo-sqlite": "~14.0.6",
  "zustand": "^5.0.2", 
  "zod": "^3.24.1"
}
```

### Camera & Media
```json
{
  "expo-camera": "~15.0.16",
  "@react-native-community/datetimepicker": "^8.4.1"
}
```

### Testing Dependencies
```json
{
  "jest": "^29.7.0",
  "@testing-library/react-native": "^12.8.1",
  "@testing-library/jest-native": "^5.4.3"
}
```

## Technical Constraints & Requirements

### Platform Support
- **iOS Minimum Version**: iOS 13.4 (Expo SDK 53 requirement)
- **Android Minimum Version**: API level 24 (Android 7.0)
- **Device Storage**: SQLite database local storage (privacy-focused)
- **Camera Access**: Required for barcode scanning functionality

### Performance Metrics (Current)
- **App Launch Time**: Optimized with lazy loading
- **Database Queries**: < 50ms for typical CRUD operations
- **Test Execution**: 64/64 tests complete in ~30 seconds
- **Memory Usage**: Efficient with proper component cleanup

### Security & Privacy
- **Data Privacy**: All data remains on device (no cloud sync)
- **Permissions**: Camera access with proper user consent flow
- **Data Validation**: Client-side validation with Zod schemas
- **Error Handling**: Graceful degradation without crashes

## Development Environment (Current Setup)

### Development Commands (Active)
```bash
# Start development server
npm run start

# Platform-specific development  
npm run android   # Android emulator
npm run ios       # iOS simulator
npm run web       # Web browser (limited functionality)

# Testing
npm test          # Run all tests (64/64 passing)
npm run test:watch # Watch mode for TDD

# Code quality
npm run lint      # ESLint checking
```

### Configuration Files (Implemented)
- **TypeScript**: Strict mode enabled in `tsconfig.json`
- **Expo**: Complete app configuration in `app.json`
- **Testing**: Jest configuration with React Native Testing Library
- **Linting**: ESLint with expo-recommended rules
- **Database**: Custom migration and connection system

## API Integration (Ready for Phase 3)

### Product Data Sources (Planned)
**Primary**: Open Food Facts API
- Free, open-source product database
- Good coverage for food items
- JSON API with barcode lookup
- Rate limiting: No restrictions for open source

**Secondary**: UPC Database (fallback)
- Broader product coverage beyond food  
- Paid tier for commercial usage
- Rate limiting considerations

**Offline Handling Strategy**:
- Graceful degradation to manual entry
- Local caching of successful API responses
- No blocking behavior when network unavailable

## Current Capabilities & Status

### ✅ Fully Operational Features
1. **Complete Inventory Management**: Create, read, update, delete inventories
2. **Complete Item Management**: Full CRUD with 8 data fields
3. **Database Integration**: SQLite with repository pattern, migrations, transactions
4. **Form Validation**: Zod schemas with real-time feedback
5. **Modern UI**: GlueStack UI components with consistent styling
6. **Testing Infrastructure**: 100% test success rate with TDD methodology
7. **Camera Integration**: Modern expo-camera API ready for barcode scanning
8. **Date Management**: Entry and expiration date tracking with native pickers

### 🔄 Ready for Enhancement (Phase 3+)
- **Product API Integration**: Barcode-to-product data mapping
- **Advanced Search**: Full-text search across items and inventories
- **Batch Operations**: Multi-select and bulk operations
- **Data Export**: CSV/JSON export functionality
- **Performance Optimization**: Virtual lists for large datasets

## Technical Decisions Made

### ✅ Resolved Technical Choices
1. **UI Framework**: GlueStack UI selected over NativeBase for better TypeScript support
2. **State Management**: Zustand chosen over Redux for simpler API and smaller bundle
3. **Database**: SQLite confirmed over Realm/WatermelonDB for ACID compliance and SQL familiarity
4. **Camera API**: Migrated to modern expo-camera from deprecated expo-barcode-scanner
5. **Testing**: Jest + React Native Testing Library for comprehensive testing
6. **Store Architecture**: Single `useDatabaseStore` for consistent data flow (fixed major navigation bug)

### Key Architectural Patterns
- **Repository Pattern**: Database operations abstracted in service layer
- **Component Composition**: Reusable forms and UI components
- **File-based Routing**: Expo Router with dynamic parameters
- **TDD Methodology**: Test-first development with commit gates
- **Type Safety**: Comprehensive TypeScript integration throughout

## Development Environment Setup

### Required Tools (Current)
- **Node.js**: Version 18+ ✅
- **Expo CLI**: For development server ✅ 
- **Android Studio**: For Android testing ✅
- **Xcode**: For iOS testing (macOS only) ✅
- **Git**: Version control with GitHub integration ✅

### Project Health Status
- **Dependency Conflicts**: Resolved ✅
- **Build Process**: Working on all platforms ✅  
- **Test Infrastructure**: 64/64 tests passing ✅
- **Code Quality**: All files under 300 lines, semantic naming ✅
- **Documentation**: Memory bank updated and synchronized ✅

## Next Technical Priorities

### Phase 3: API Integration Requirements
- HTTP client for product API calls (axios or fetch)
- API response caching strategy
- Network error handling and retry logic
- Rate limiting compliance for external APIs

### Future Enhancements
- Performance monitoring for large datasets
- Advanced error boundary implementation
- Accessibility improvements (screen reader support)
- CI/CD pipeline integration for automated testing

This technical foundation provides a solid, tested base for the inventory management app with modern React Native practices, comprehensive testing, and a clear path for future enhancements.
