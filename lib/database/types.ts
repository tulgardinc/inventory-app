// Database entity interfaces (for mapping between app types and DB storage)
export interface DatabaseInventory {
  id: string;
  name: string;
  description: string | null;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

export interface DatabaseItem {
  id: string;
  inventory_id: string;
  name: string;
  description: string | null;
  quantity: number;
  price: number | null;
  category: string | null;
  location: string | null;
  barcode: string | null;
  expiration_date: string | null; // ISO string
  entry_date: string; // ISO string
  updated_at: string; // ISO string
}

// Database metadata for migrations
export interface DatabaseMeta {
  key: string;
  value: string;
}

// Schema version tracking
export interface SchemaVersion {
  version: number;
  applied_at: string;
}

// Migration definition
export interface Migration {
  version: number;
  name: string;
  up: string[];
  down?: string[];
}
