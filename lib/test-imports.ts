// Test file to verify all dependencies are working correctly

// Test Zod import and validation
import { CreateInventorySchema } from './schemas';

// Test Zustand import and store
import { useAppStore } from './store';

// Test SQLite import
import * as SQLite from 'expo-sqlite';

// Test GlueStack UI imports
import { Box, Button, Text } from '@gluestack-ui/themed';

// Test barcode scanner imports
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

// Validation test function
export function testZodValidation() {
  try {
    // Test basic schema validation
    const testInventory = {
      name: 'Test Inventory',
      description: 'A test inventory'
    };
    
    const validatedInventory = CreateInventorySchema.parse(testInventory);
    console.log('✅ Zod validation working:', validatedInventory);
    return true;
  } catch (error) {
    console.error('❌ Zod validation failed:', error);
    return false;
  }
}

// SQLite connection test
export function testSQLiteConnection() {
  try {
    const db = SQLite.openDatabaseSync('test.db');
    console.log('✅ SQLite connection working');
    return true;
  } catch (error) {
    console.error('❌ SQLite connection failed:', error);
    return false;
  }
}

// Store test function
export function testZustandStore() {
  try {
    // This would normally be used in a React component
    // Here we're just testing that the store structure is correct
    const storeState = useAppStore.getState();
    console.log('✅ Zustand store working, initial state:', {
      inventoryCount: storeState.inventories.length,
      itemCount: storeState.items.length,
      currentInventory: storeState.currentInventoryId
    });
    return true;
  } catch (error) {
    console.error('❌ Zustand store failed:', error);
    return false;
  }
}

// Component imports test
export function testComponentImports() {
  try {
    // Test that we can reference the imported components
    const components = { Box, Text, Button };
    console.log('✅ GlueStack UI components imported:', Object.keys(components));
    return true;
  } catch (error) {
    console.error('❌ Component imports failed:', error);
    return false;
  }
}

// Camera imports test  
export function testCameraImports() {
  try {
    // Test that we can reference camera components
    const cameraComponents = { BarCodeScanner, Camera };
    console.log('✅ Camera components imported:', Object.keys(cameraComponents));
    return true;
  } catch (error) {
    console.error('❌ Camera imports failed:', error);
    return false;
  }
}

// Run all tests
export function runAllImportTests() {
  console.log('🧪 Running dependency import tests...\n');
  
  const tests = [
    { name: 'Zod Validation', test: testZodValidation },
    { name: 'SQLite Connection', test: testSQLiteConnection },
    { name: 'Zustand Store', test: testZustandStore },
    { name: 'GlueStack Components', test: testComponentImports },
    { name: 'Camera Components', test: testCameraImports }
  ];
  
  const results = tests.map(({ name, test }) => ({
    name,
    passed: test()
  }));
  
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  
  console.log(`\n📊 Test Results: ${passedCount}/${totalCount} tests passed`);
  
  if (passedCount === totalCount) {
    console.log('🎉 All dependencies are working correctly!');
  } else {
    console.log('⚠️  Some dependencies need attention');
  }
  
  return passedCount === totalCount;
}
