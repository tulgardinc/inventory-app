import { useAppStore } from '@/lib/store';
import { Box, Button, ButtonText, Heading, HStack, VStack } from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function ItemsListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const inventoryId = Array.isArray(id) ? id[0] : id;
  
  const inventories = useAppStore((state) => state.inventories);
  const items = useAppStore((state) => state.items);
  const createItem = useAppStore((state) => state.createItem);
  
  const inventory = inventories.find(inv => inv.id === inventoryId);
  const inventoryItems = items.filter(item => item.inventoryId === inventoryId);

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

  const handleAddItem = () => {
    router.push(`/inventories/${inventoryId}/items/create`);
  };

  return (
    <Box flex={1} p="$4" bg="$backgroundLight0">
      <VStack space="md" flex={1}>
        <VStack space="xs">
          <Heading size="xl">{inventory.name} - Items</Heading>
          <Heading size="sm" color="$textLight600">
            {inventoryItems.length} item{inventoryItems.length !== 1 ? 's' : ''}
          </Heading>
        </VStack>

        <Button onPress={handleAddItem}>
          <ButtonText>Add New Item</ButtonText>
        </Button>

        <VStack space="sm" flex={1}>
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
            inventoryItems.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                onPress={() => router.push(`/inventories/${inventoryId}/items/${item.id}`)}
              >
                <Box p="$3" width="100%">
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack alignItems="flex-start" flex={1}>
                      <Heading size="md">{item.name}</Heading>
                      {item.description && (
                        <ButtonText size="sm" color="$textLight600">
                          {item.description}
                        </ButtonText>
                      )}
                      {item.barcode && (
                        <ButtonText size="xs" color="$textLight500">
                          Barcode: {item.barcode}
                        </ButtonText>
                      )}
                    </VStack>
                    <VStack alignItems="flex-end" space="xs">
                      <ButtonText size="sm" color="$textLight500">
                        Qty: {item.quantity}
                      </ButtonText>
                      {item.price && (
                        <ButtonText size="xs" color="$textLight500">
                          ${item.price.toFixed(2)}
                        </ButtonText>
                      )}
                    </VStack>
                  </HStack>
                </Box>
              </Button>
            ))
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
