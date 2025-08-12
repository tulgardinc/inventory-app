# System Patterns: Architecture & Technical Decisions

## Core Architecture Decisions

### Database Design
**SQLite with Expo SQLite** - Local storage with relational data model

```sql
-- Core Tables
CREATE TABLE inventories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inventory_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price REAL,
  category TEXT,
  physical_location TEXT,
  description TEXT,
  barcode TEXT,
  entry_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiration_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_id) REFERENCES inventories (id) ON DELETE CASCADE
);
```

**Key Design Patterns:**
- **Repository Pattern**: Centralized database operations in service layer
- **Foreign Key Constraints**: Ensure data integrity with cascade deletes
- **Audit Fields**: Track creation and update timestamps for all entities

### Navigation Architecture
**Expo Router with File-based Routing**

```
app/
├── (tabs)/
│   ├── index.tsx          # Dashboard (Inventories List)
│   ├── scan.tsx           # Barcode Scanner Tab
│   └── search.tsx         # Search & Filter Tab
├── inventory/
│   ├── [id].tsx           # Inventory Detail View
│   ├── create.tsx         # Create New Inventory
│   └── edit/[id].tsx      # Edit Inventory
├── item/
│   ├── [id].tsx           # Item Detail View
│   ├── create.tsx         # Manual Item Creation
│   └── edit/[id].tsx      # Edit Item
└── modals/
    ├── camera-permission.tsx
    └── item-actions.tsx
```

**Navigation Patterns:**
- **Tab-based Primary Navigation**: Core features accessible via tabs
- **Stack Navigation within Tabs**: Deep navigation for details/editing
- **Modal Presentation**: For permissions and contextual actions
- **Dynamic Routes**: Parameter-based routing for entities (`[id].tsx`)

### Component Architecture

#### Core Component Hierarchy
```
App Components/
├── Layout Components/
│   ├── ScreenContainer
│   ├── TabContainer
│   └── ModalContainer
├── Feature Components/
│   ├── InventoryCard
│   ├── ItemCard
│   ├── BarcodeScanner
│   └── SearchFilters
├── Form Components/
│   ├── InventoryForm
│   ├── ItemForm
│   └── FormField (reusable)
└── UI Components/ (Gluestack-based)
    ├── Button
    ├── Input
    ├── Card
    └── Modal
```

**Component Design Patterns:**
- **Container/Presentation Separation**: Logic containers wrap presentation components
- **Compound Components**: Complex forms built from reusable field components  
- **Render Props**: For complex state sharing (camera, form validation)
- **Custom Hooks**: Business logic abstraction (`useInventories`, `useItems`, `useBarcode`)

### Data Flow Architecture

#### State Management Pattern
**Zustand for Global State + React Context for Component Trees**

```typescript
// Global stores
interface InventoryStore {
  inventories: Inventory[];
  activeInventory: Inventory | null;
  actions: {
    loadInventories: () => Promise<void>;
    createInventory: (data: CreateInventoryData) => Promise<void>;
    updateInventory: (id: number, data: UpdateInventoryData) => Promise<void>;
    deleteInventory: (id: number) => Promise<void>;
    setActiveInventory: (inventory: Inventory) => void;
  };
}

interface ItemStore {
  items: Item[];
  actions: {
    loadItemsForInventory: (inventoryId: number) => Promise<void>;
    createItem: (data: CreateItemData) => Promise<void>;
    updateItem: (id: number, data: UpdateItemData) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
  };
}
```

**Data Flow Patterns:**
- **Single Source of Truth**: Zustand stores hold canonical state
- **Optimistic Updates**: UI updates immediately, sync with database async
- **Error Boundaries**: Graceful error handling with user feedback
- **Cache Invalidation**: Automatic refresh after mutations

### Critical Implementation Paths

#### Barcode Scanning Flow
```typescript
// 1. Permission Check → 2. Camera Access → 3. Scan → 4. API Call → 5. Form Pre-fill → 6. Save
const scanWorkflow = {
  checkCameraPermission: () => Promise<boolean>,
  openCamera: () => CameraInstance,
  processScanResult: (barcode: string) => Promise<ProductData>,
  prefillItemForm: (productData: ProductData) => FormData,
  saveItem: (formData: FormData, inventoryId: number) => Promise<Item>
};
```

#### Product API Integration Pattern
```typescript
interface ProductAPIService {
  fetchProductData: (barcode: string) => Promise<ProductData | null>;
  // Fallback chain: Open Food Facts → UPC Database → Manual Entry
}

// Error handling pattern
const fetchWithFallback = async (barcode: string): Promise<ProductData> => {
  try {
    return await primaryAPI.fetch(barcode);
  } catch {
    try {
      return await secondaryAPI.fetch(barcode);
    } catch {
      return { barcode, name: '', description: '', category: '' }; // Manual entry
    }
  }
};
```

#### Search & Filter Architecture
```typescript
interface SearchState {
  query: string;
  filters: {
    inventoryIds: number[];
    categories: string[];
    locations: string[];
    dateRange: { start: Date; end: Date } | null;
  };
  sortBy: 'name' | 'date' | 'quantity' | 'expiration';
  sortOrder: 'asc' | 'desc';
}

// Real-time search with debouncing
const useItemSearch = (searchState: SearchState) => {
  return useDeferredValue(
    items.filter(applyFilters).sort(applySorting)
  );
};
```

### Key Technical Patterns

#### Database Service Layer
```typescript
class DatabaseService {
  private db: SQLite.Database;
  
  // Transaction pattern for data integrity
  async withTransaction<T>(operations: (tx: SQLite.Transaction) => Promise<T>): Promise<T>;
  
  // Prepared statement pattern for performance
  private statements: Map<string, SQLite.Statement>;
}
```

#### Error Handling Strategy
- **Database Errors**: Graceful degradation with user messaging
- **Network Errors**: Offline-first approach with manual fallback
- **Camera Errors**: Clear permission requests and alternative flows
- **Validation Errors**: Field-level feedback with form state management

#### Performance Optimization Patterns
- **Lazy Loading**: Load inventory items on-demand
- **Virtual Lists**: Handle large inventories efficiently
- **Image Caching**: Cache barcode scanner frames
- **Database Indexing**: Optimize search queries with proper indices

This architecture provides a scalable foundation for the inventory app while maintaining simplicity and testability.
