import { useAppStore } from '@/lib/store';
import { Box, Button, ButtonText, Heading, HStack, VStack } from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id, itemId } = useLocalSearchParams();
  const inventoryId = Array.isArray(id) ? id[0] : id;
  const itemIdStr = Array.isArray(itemId) ? itemId[0] : itemId;
  
  const inventories = useAppStore((state) => state.inventories);
  const items = useAppStore((state) => state.items);
  const updateItem = useAppStore((state) => state.updateItem);
  const removeItem = useAppStore((state) => state.removeItem);
  
  const inventory = inventories.find(inv => inv.id === inventoryId);
  const item = items.find(item => item.id === itemIdStr);

  if (!inventory || !item) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" p="$4">
        <Heading>{!inventory ? 'Inventory' : 'Item'} not found</Heading>
        <Button onPress={() => router.back()}>
          <ButtonText>Go Back</ButtonText>
        </Button>
      </Box>
    );
  }

  const handleDelete = () => {
    removeItem(item.id);
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <Box flex={1} p="$4" bg="$backgroundLight0">
      <VStack space="md" flex={1}>
        <VStack space="xs">
          <Heading size="xl">{item.name}</Heading>
          <Heading size="sm" color="$textLight600">
            in {inventory.name}
          </Heading>
        </VStack>

        <VStack space="md" flex={1}>
          {/* Item Details */}
          <VStack space="sm">
            <Heading size="lg">Details</Heading>
            
            <VStack space="xs">
              <HStack justifyContent="space-between">
                <ButtonText>Quantity:</ButtonText>
                <ButtonText fontWeight="$semibold">{item.quantity}</ButtonText>
              </HStack>
              
              {item.description && (
                <VStack space="xs">
                  <ButtonText>Description:</ButtonText>
                  <ButtonText color="$textLight600">{item.description}</ButtonText>
                </VStack>
              )}
              
              {item.barcode && (
                <HStack justifyContent="space-between">
                  <ButtonText>Barcode:</ButtonText>
                  <ButtonText fontWeight="$semibold">{item.barcode}</ButtonText>
                </HStack>
              )}
              
              {item.price && (
                <HStack justifyContent="space-between">
                  <ButtonText>Price:</ButtonText>
                  <ButtonText fontWeight="$semibold">${item.price.toFixed(2)}</ButtonText>
                </HStack>
              )}
              
              {item.category && (
                <HStack justifyContent="space-between">
                  <ButtonText>Category:</ButtonText>
                  <ButtonText fontWeight="$semibold">{item.category}</ButtonText>
                </HStack>
              )}
              
              {item.location && (
                <HStack justifyContent="space-between">
                  <ButtonText>Location:</ButtonText>
                  <ButtonText fontWeight="$semibold">{item.location}</ButtonText>
                </HStack>
              )}
              
              {item.expirationDate && (
                <HStack justifyContent="space-between">
                  <ButtonText>Expires:</ButtonText>
                  <ButtonText fontWeight="$semibold">{formatDate(item.expirationDate)}</ButtonText>
                </HStack>
              )}
            </VStack>
          </VStack>

          {/* Timestamps */}
          <VStack space="xs">
            <Heading size="md">History</Heading>
            <HStack justifyContent="space-between">
              <ButtonText>Added:</ButtonText>
              <ButtonText color="$textLight600">{formatDate(item.entryDate)}</ButtonText>
            </HStack>
            <HStack justifyContent="space-between">
              <ButtonText>Updated:</ButtonText>
              <ButtonText color="$textLight600">{formatDate(item.updatedAt)}</ButtonText>
            </HStack>
          </VStack>
        </VStack>

        {/* Actions */}
        <VStack space="sm">
          <Button variant="outline">
            <ButtonText>Edit Item</ButtonText>
          </Button>
          <Button variant="solid" action="negative" onPress={handleDelete}>
            <ButtonText>Delete Item</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
