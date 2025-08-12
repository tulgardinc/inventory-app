import { useDatabaseStore } from '@/lib/databaseStore';
import { Box, Button, ButtonText, Heading, HStack, VStack } from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function InventoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const inventoryId = Array.isArray(id) ? id[0] : id;
  // Database store selectors
  const inventories = useDatabaseStore((state) => state.inventories);
  const items = useDatabaseStore((state) => state.items);
  const isInitialized = useDatabaseStore((state) => state.isInitialized);
  const initializeDatabase = useDatabaseStore((state) => state.initializeDatabase);
  const loadInventories = useDatabaseStore((state) => state.loadInventories);
  const loadItemsForInventory = useDatabaseStore((state) => state.loadItemsForInventory);
  const setCurrentInventory = useDatabaseStore((state) => state.setCurrentInventory);
  const createItem = useDatabaseStore((state) => state.createItem);
  
  const inventory = inventories.find(inv => inv.id === inventoryId);
  const inventoryItems = items.filter(item => item.inventoryId === inventoryId);

  // Initialize database and load data
  React.useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        if (!isInitialized) {
          await initializeDatabase();
        }
        
        await loadInventories();
        
        if (inventoryId) {
          setCurrentInventory(inventoryId);
          await loadItemsForInventory(inventoryId);
        }
      } catch (err) {
        console.error('Failed to initialize inventory detail:', err);
      }
    };

    initializeAndLoad();
  }, [inventoryId, isInitialized, initializeDatabase, loadInventories, loadItemsForInventory, setCurrentInventory]);

  if (!inventory) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" p="$4">
        <Heading>Inventory not found</Heading>
        <Button onPress={() => router.back()}>
          <ButtonText>Go Back</ButtonText>
        </Button>
      </Box>
    );
  }

  const handleAddItem = async () => {
    try {
      const newItem = await createItem({
        inventoryId: inventoryId,
        name: `Item ${inventoryItems.length + 1}`,
        description: 'New item',
        quantity: 1,
      });
      router.push(`/inventories/${inventoryId}/items/${newItem.id}`);
    } catch (err) {
      console.error('Failed to create item:', err);
    }
  };

  const handleViewAllItems = () => {
    router.push(`/inventories/${inventoryId}/items`);
  };

  return (
    <Box flex={1} p="$4" bg="$backgroundLight0">
      <VStack space="md" flex={1}>
        <VStack space="xs">
          <Heading size="xl">{inventory.name}</Heading>
          {inventory.description && (
            <Heading size="sm" color="$textLight600">
              {inventory.description}
            </Heading>
          )}
        </VStack>

        <HStack space="md" justifyContent="space-between">
          <Button flex={1} onPress={handleAddItem}>
            <ButtonText>Add Item</ButtonText>
          </Button>
          <Button flex={1} variant="outline" onPress={handleViewAllItems}>
            <ButtonText>View All Items</ButtonText>
          </Button>
        </HStack>

        <VStack space="md" flex={1}>
          <Heading size="lg">Recent Items ({inventoryItems.length})</Heading>
          
          {inventoryItems.length === 0 ? (
            <Box flex={1} justifyContent="center" alignItems="center">
              <VStack space="md" alignItems="center">
                <Heading size="md" color="$textLight500">No items yet</Heading>
                <Button onPress={handleAddItem}>
                  <ButtonText>Add Your First Item</ButtonText>
                </Button>
              </VStack>
            </Box>
          ) : (
            <VStack space="sm">
              {inventoryItems.slice(0, 5).map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  onPress={() => router.push(`/inventories/${inventoryId}/items/${item.id}`)}
                >
                  <Box p="$3" width="100%">
                    <HStack justifyContent="space-between" alignItems="center">
                      <VStack alignItems="flex-start">
                        <Heading size="md">{item.name}</Heading>
                        {item.description && (
                          <ButtonText size="sm" color="$textLight600">
                            {item.description}
                          </ButtonText>
                        )}
                      </VStack>
                      <ButtonText size="sm" color="$textLight500">
                        Qty: {item.quantity}
                      </ButtonText>
                    </HStack>
                  </Box>
                </Button>
              ))}
              
              {inventoryItems.length > 5 && (
                <Button variant="outline" onPress={handleViewAllItems}>
                  <ButtonText>View All {inventoryItems.length} Items</ButtonText>
                </Button>
              )}
            </VStack>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
