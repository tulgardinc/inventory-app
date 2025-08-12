# System Patterns: Architecture & Technical Decisions

## Core Architecture Decisions (Implemented)

### Database Design (Operational SQLite Schema)
**SQLite with expo-sqlite** - Local storage with relational data model

```sql
-- Implemented Tables (from lib/database/migrations.ts)
CREATE TABLE inventories (
  id TEXT PRIMARY KEY,           -- Custom ID generation (lib/utils/idGenerator.ts)
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
  id TEXT PRIMARY KEY,           -- Custom ID generation
  inventory_id TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price REAL,
  category TEXT,
  location TEXT,                 -- Physical location field
  description TEXT,
  barcode TEXT,
  entry_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiration_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_id) REFERENCES inventories (id) ON DELETE CASCADE
);
```

**Implemented Design Patterns:**
- **Repository Pattern**: Centralized database operations in `lib/database/inventoryRepository.ts` and `lib/database/itemRepository.ts`
- **Foreign Key Constraints**: Ensure data integrity with cascade deletes
- **Audit Fields**: Track creation and update timestamps for all entities
- **Custom ID Generation**: String-based IDs using `lib/utils/idGenerator.ts`
- **Migration System**: Versioned schema updates in `lib/database/migrations.ts`

### Navigation Architecture (Implemented with Expo Router)
**File-based Routing Structure**

```
app/
├── (tabs)/                    # Tab navigation (placeholder for future)
│   ├── index.tsx             # Dashboard placeholder
│   └── explore.tsx           # Explore tab placeholder
├── inventories/              # Complete inventory management
│   ├── index.tsx            # Inventory List Screen (database-integrated)
│   ├── create.tsx           # Inventory Creation Screen
│   └── [id]/                # Dynamic inventory routes
│       ├── index.tsx        # Inventory Detail Screen
│       └── items/           # Complete item management
│           ├── index.tsx    # Items List Screen (8-field display)
│           ├── create.tsx   # Item Creation Screen
│           └── [itemId]/    # Dynamic item routes
│               ├── index.tsx # Item Detail Screen
│               └── edit.tsx  # Item Edit Screen
├── _layout.tsx              # Root layout with GlueStack Provider
└── +not-found.tsx           # 404 error page
```

**Implemented Navigation Patterns:**
- **File-based Dynamic Routing**: Parameter-based routing for entities (`[id].tsx`, `[itemId].tsx`)
- **Nested Route Structure**: Logical hierarchy (inventories → items)
- **Layout Composition**: Root layout with GlueStack UI provider
- **Type-safe Navigation**: Expo Router with TypeScript integration

### Component Architecture (Implemented)

#### Current Component Hierarchy
```
Components/
├── forms/                        # Form components (implemented)
│   ├── InventoryForm.tsx        # Complete inventory form with validation
│   ├── ItemForm.tsx             # Complete item form (8 fields, camera, dates)
│   └── BasicItemForm.tsx        # Simplified item form variant
├── ui/                          # UI components (GlueStack-based)
│   ├── IconSymbol.tsx           # Icon system
│   └── TabBarBackground.tsx     # Tab styling
└── [Legacy Components]/         # Original Expo template components
    ├── ThemedText.tsx           # Themed text component
    ├── ThemedView.tsx           # Themed view component
    └── [Other template files]   # Collapsible, ExternalLink, etc.
```

**Implemented Component Design Patterns:**
- **Form Component Architecture**: Reusable forms with Zod validation integration
- **GlueStack UI Integration**: Modern component library with consistent design system
- **Composition over Inheritance**: Modular component design
- **TypeScript Integration**: Full type safety across all components

### Data Flow Architecture (Operational)

#### State Management Pattern (Zustand Implementation)
**Primary Store: `lib/databaseStore.ts`**

```typescript
// Implemented Zustand Store Structure
interface DatabaseStore {
  // Inventory State
  inventories: Inventory[];
  currentInventory: Inventory | null;
  
  // Item State  
  items: Item[];
  itemCounts: Record<string, number>;
  
  // Loading States
  isLoading: boolean;
  error: string | null;
  
  // Inventory Actions (implemented)
  loadInventories: () => Promise<void>;
  createInventory: (data: CreateInventoryData) => Promise<Inventory>;
  updateInventory: (id: string, data: UpdateInventoryData) => Promise<void>;
  deleteInventory: (id: string) => Promise<void>;
  getInventoryById: (id: string) => Inventory | undefined;
  
  // Item Actions (implemented)
  loadItemsForInventory: (inventoryId: string) => Promise<void>;
  createItem: (data: CreateItemData) => Promise<Item>;
  updateItem: (id: string, data: UpdateItemData) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItemById: (id: string) => Item | undefined;
  
  // Utility Actions
  getInventoryItemCount: (inventoryId: string) => Promise<number>;
  clearError: () => void;
}
```

**Implemented Data Flow Patterns:**
- **Single Source of Truth**: `useDatabaseStore` provides canonical application state
- **Direct Database Integration**: Store methods directly call repository functions
- **Optimistic Updates**: UI updates immediately while database operations run async
- **Error Handling**: Centralized error state management
- **Async State Management**: Loading states for all database operations

### Critical Implementation Paths (Operational)

#### Item Management Flow (Complete Implementation)
```typescript
// Complete CRUD Flow for Items
const itemCRUDFlow = {
  create: async (inventoryId: string, itemData: CreateItemData) => {
    // 1. Validate with Zod schema (lib/schemas.ts)
    // 2. Generate unique ID (lib/utils/idGenerator.ts)  
    // 3. Save to database (lib/database/itemRepository.ts)
    // 4. Update Zustand store (lib/databaseStore.ts)
    // 5. Navigate to item list (app/inventories/[id]/items/index.tsx)
  },
  
  read: async (inventoryId: string) => {
    // 1. Load items from database (itemRepository.getByInventoryId)
    // 2. Update store state (items array)
    // 3. Display in ItemsListScreen with 8-field layout
  },
  
  update: async (itemId: string, updates: UpdateItemData) => {
    // 1. Pre-populate ItemForm with existing data
    // 2. Validate changes with Zod
    // 3. Update database (itemRepository.update)
    // 4. Refresh store state
  },
  
  delete: async (itemId: string) => {
    // 1. Show confirmation dialog (GlueStack AlertDialog)
    // 2. Delete from database (itemRepository.delete)
    // 3. Remove from store state
    // 4. Update UI immediately
  }
};
```

#### Form Validation Pattern (Implemented with Zod)
```typescript
// Comprehensive validation system (lib/schemas.ts)
const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  price: z.number().min(0).optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  barcode: z.string().optional(),
  entry_date: z.date().optional(),
  expiration_date: z.date().optional(),
});

// Form integration pattern used throughout
const formValidation = {
  realTimeValidation: true,    // Immediate feedback on field changes
  submitValidation: true,      // Final validation before database save
  errorDisplayStrategy: "inline", // Field-level error messages
  zodIntegration: true         // Type-safe validation schemas
};
```

#### Camera Integration Pattern (Modern Implementation)
```typescript
// Implemented camera pattern (components/forms/ItemForm.tsx)
const cameraIntegrationFlow = {
  // 1. Permission handling with useCameraPermissions
  requestPermission: () => useCameraPermissions(),
  
  // 2. Modern CameraView component (not deprecated expo-barcode-scanner)
  renderCamera: () => <CameraView />,
  
  // 3. Barcode scanning event handling
  onBarcodeScanned: (result: BarcodeScanningResult) => {
    // Set barcode field in form
    // Ready for Phase 3: API integration for product data
  },
  
  // 4. Error handling for camera failures
  handleCameraError: (error: Error) => {
    // Graceful fallback to manual barcode entry
  }
};
```

### Key Technical Patterns (Implemented)

#### Database Service Layer Pattern
```typescript
// Repository implementation (lib/database/itemRepository.ts)
class ItemRepository {
  private db: SQLiteDatabase;
  
  // Transaction pattern for data integrity
  async create(item: CreateItemData): Promise<Item> {
    return this.db.withTransactionAsync(async () => {
      // Insert with proper error handling
    });
  }
  
  // Prepared statement pattern for performance
  async getByInventoryId(inventoryId: string): Promise<Item[]> {
    // Use parameterized queries for security
  }
}
```

#### Error Handling Strategy (Implemented)
- **Database Errors**: Graceful degradation with user-friendly error messages
- **Validation Errors**: Field-level feedback with Zod schema integration
- **Camera Errors**: Fallback to manual barcode entry when camera unavailable
- **Navigation Errors**: 404 handling with +not-found.tsx

#### Testing Patterns (64/64 Tests Passing)
```typescript
// Comprehensive testing strategy implemented
const testingPatterns = {
  unitTesting: {
    coverage: "Database repositories, utility functions, Zod schemas",
    framework: "Jest with React Native Testing Library",
    approach: "Test-driven development (TDD)"
  },
  
  componentTesting: {
    coverage: "Form components, screen components, UI interactions", 
    mocking: "Database operations, camera permissions, navigation",
    assertions: "Rendering, user interactions, state changes"
  },
  
  integrationTesting: {
    coverage: "Database operations, form submission, navigation flow",
    realData: "SQLite in-memory databases for testing",
    scenarios: "Complete user workflows"
  }
};
```

### Performance Optimization Patterns (Current Implementation)

#### Database Optimization
- **Indexed Queries**: Foreign key indices for fast joins
- **Transaction Batching**: Multiple operations in single transaction
- **Connection Pooling**: Single database connection with proper cleanup
- **Lazy Loading**: Load items only when inventory is accessed

#### Component Optimization  
- **Zustand Selectors**: Prevent unnecessary re-renders with specific selectors
- **Form State Management**: Local state for forms, global state for persistence
- **Conditional Rendering**: Loading states and error boundaries

#### Memory Management
- **Component Cleanup**: Proper useEffect cleanup in all components
- **Database Connection Management**: Automatic connection lifecycle
- **State Normalization**: Flat state structure in Zustand store

## System Architecture Summary (Current State)

### ✅ Fully Implemented Architecture
1. **Database Layer**: Complete SQLite integration with repository pattern
2. **State Management**: Zustand with database integration (`useDatabaseStore`)
3. **Component Architecture**: GlueStack UI with reusable form components
4. **Navigation**: Expo Router with file-based routing and dynamic parameters
5. **Validation**: Zod schemas with real-time form validation
6. **Testing**: Comprehensive test suite with 100% success rate
7. **Error Handling**: Graceful degradation at all system levels

### 🔄 Ready for Extension (Phase 3+)
- **API Integration**: Product data fetching from barcode scans
- **Advanced Search**: Full-text search across items and inventories
- **Batch Operations**: Multi-select and bulk operations
- **Caching Layer**: API response caching and offline support

This architecture provides a robust, tested foundation for the inventory management app with clear patterns for extending functionality in future phases.
