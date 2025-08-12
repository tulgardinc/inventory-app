import { useDatabaseStore } from '@/lib/databaseStore';
import { Box, Button, ButtonText, Center, Heading, HStack, Spinner, Text, VStack } from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function InventoriesScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  // Database store selectors
  const inventories = useDatabaseStore((state) => state.inventories);
  const isLoadingInventories = useDatabaseStore((state) => state.isLoadingInventories);
  const isInitialized = useDatabaseStore((state) => state.isInitialized);
  const initializeDatabase = useDatabaseStore((state) => state.initializeDatabase);
  const loadInventories = useDatabaseStore((state) => state.loadInventories);
  const getInventoryItemCount = useDatabaseStore((state) => state.getInventoryItemCount);

  // Initialize database and load inventories
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        setError(null);
        
        if (!isInitialized) {
          await initializeDatabase();
        }
        
        await loadInventories();
      } catch (err) {
        console.error('Failed to initialize or load inventories:', err);
        setError('Failed to load inventories');
      }
    };

    initializeAndLoad();
  }, [isInitialized, initializeDatabase, loadInventories]);

  const handleCreateInventory = () => {
    router.push('/inventories/create');
  };

  const handleRetry = async () => {
    try {
      setError(null);
      await loadInventories();
    } catch (err) {
      console.error('Failed to retry loading inventories:', err);
      setError('Failed to load inventories');
    }
  };

  const handleInventoryPress = (inventoryId: string) => {
    router.push(`/inventories/${inventoryId}`);
  };

  // Loading state
  if (isLoadingInventories) {
    return (
      <Box flex={1} p="$4" bg="$backgroundLight0">
        <VStack space="md" flex={1}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="xl">My Inventories</Heading>
            <Button size="sm" onPress={handleCreateInventory}>
              <ButtonText>Add New</ButtonText>
            </Button>
          </HStack>
          
          <Center flex={1}>
            <VStack space="md" alignItems="center">
              <Spinner size="large" />
              <Text>Loading inventories...</Text>
            </VStack>
          </Center>
        </VStack>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box flex={1} p="$4" bg="$backgroundLight0">
        <VStack space="md" flex={1}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="xl">My Inventories</Heading>
            <Button size="sm" onPress={handleCreateInventory}>
              <ButtonText>Add New</ButtonText>
            </Button>
          </HStack>
          
          <Center flex={1}>
            <VStack space="md" alignItems="center">
              <Text color="$red600">{error}</Text>
              <Button onPress={handleRetry}>
                <ButtonText>Try Again</ButtonText>
              </Button>
            </VStack>
          </Center>
        </VStack>
      </Box>
    );
  }

  return (
    <Box flex={1} p="$4" bg="$backgroundLight0">
      <VStack space="md" flex={1}>
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="xl">My Inventories</Heading>
          <Button size="sm" onPress={handleCreateInventory}>
            <ButtonText>Add New</ButtonText>
          </Button>
        </HStack>

        <VStack space="sm" flex={1}>
          {inventories.length === 0 ? (
            <Box flex={1} justifyContent="center" alignItems="center">
              <VStack space="md" alignItems="center">
                <Heading size="md" color="$textLight500">No inventories yet</Heading>
                <Button onPress={handleCreateInventory}>
                  <ButtonText>Create Your First Inventory</ButtonText>
                </Button>
              </VStack>
            </Box>
          ) : (
            inventories.map((inventory) => {
              const itemCount = getInventoryItemCount(inventory.id);
              return (
                <Button
                  key={inventory.id}
                  variant="outline"
                  onPress={() => handleInventoryPress(inventory.id)}
                >
                  <Box p="$3" width="100%">
                    <VStack space="xs" alignItems="flex-start">
                      <HStack justifyContent="space-between" alignItems="center" width="100%">
                        <Heading size="md">{inventory.name}</Heading>
                        <Text size="sm" color="$textLight500">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </Text>
                      </HStack>
                      <Text size="sm" color="$textLight600">
                        {inventory.description || 'No description'}
                      </Text>
                    </VStack>
                  </Box>
                </Button>
              );
            })
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
