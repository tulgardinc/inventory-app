import { useAppStore } from '@/lib/store';
import { Box, Button, ButtonText, Heading, HStack, VStack } from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import React from 'react';

export default function InventoriesScreen() {
  const router = useRouter();
  const inventories = useAppStore((state) => state.inventories);
  const createInventory = useAppStore((state) => state.createInventory);

  const handleCreateInventory = () => {
    router.push('/inventories/create');
  };

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
            inventories.map((inventory) => (
              <Button
                key={inventory.id}
                variant="outline"
                onPress={() => router.push(`/inventories/${inventory.id}`)}
              >
                <Box p="$3" width="100%">
                  <VStack space="xs" alignItems="flex-start">
                    <Heading size="md">{inventory.name}</Heading>
                    <ButtonText size="sm" color="$textLight600">
                      {inventory.description || 'No description'}
                    </ButtonText>
                  </VStack>
                </Box>
              </Button>
            ))
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
