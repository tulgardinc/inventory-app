import { useDatabaseStore } from '@/lib/databaseStore';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Badge,
  BadgeText,
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

interface ActionSheetState {
  isOpen: boolean;
  selectedItem: any;
}

interface DeleteDialogState {
  isOpen: boolean;
  selectedItem: any;
}

export default function ItemsListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const inventoryId = Array.isArray(id) ? id[0] : id;
  
  const [actionSheet, setActionSheet] = useState<ActionSheetState>({
    isOpen: false,
    selectedItem: null,
  });
  
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    selectedItem: null,
  });
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Database store selectors  
  const inventory = useDatabaseStore(state => 
    state.inventories.find(inv => inv.id === inventoryId)
  );
  const items = useDatabaseStore(state => 
    state.items.filter(item => item.inventoryId === inventoryId)
  );
  const isLoadingItems = useDatabaseStore(state => state.isLoadingItems);
  const loadItemsForInventory = useDatabaseStore(state => state.loadItemsForInventory);
  const deleteItem = useDatabaseStore(state => state.deleteItem);
  
  // Load items on mount
  useEffect(() => {
    if (inventoryId) {
      loadItemsForInventory(inventoryId);
    }
  }, [inventoryId, loadItemsForInventory]);

  // Handle missing inventory
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

  // Loading state
  if (isLoadingItems) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" p="$4">
        <Spinner size="large" />
        <Text mt="$4">Loading items...</Text>
      </Box>
    );
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  // Get expiration status
  const getExpirationStatus = (expirationDate?: Date) => {
    if (!expirationDate) return null;
    
    const today = new Date();
    const expiry = new Date(expirationDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'EXPIRED', color: '$red500' };
    } else if (daysUntilExpiry <= 7) {
      return { status: 'EXPIRING SOON', color: '$orange500' };
    }
    return null;
  };

  const handleAddItem = () => {
    router.push(`/inventories/${inventoryId}/items/create`);
  };

  const handleItemPress = (itemId: string) => {
    router.push(`/inventories/${inventoryId}/items/${itemId}`);
  };

  const handleItemLongPress = (item: any) => {
    setActionSheet({
      isOpen: true,
      selectedItem: item,
    });
  };

  const handleEdit = () => {
    setActionSheet({ isOpen: false, selectedItem: null });
    router.push(`/inventories/${inventoryId}/items/${actionSheet.selectedItem?.id}`);
  };

  const handleDeletePress = () => {
    setDeleteDialog({
      isOpen: true,
      selectedItem: actionSheet.selectedItem,
    });
    setActionSheet({ isOpen: false, selectedItem: null });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.selectedItem) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteItem(deleteDialog.selectedItem.id);
      setDeleteDialog({ isOpen: false, selectedItem: null });
    } catch (error) {
      console.error('Failed to delete item:', error);
      setDeleteError('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleActionSheetClose = () => {
    setActionSheet({ isOpen: false, selectedItem: null });
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog({ isOpen: false, selectedItem: null });
  };

  return (
    <Box flex={1} p="$4" bg="$backgroundLight0">
      <VStack space="md" flex={1}>
        {/* Header */}
        <VStack space="xs">
          <Heading size="xl">{inventory.name} - Items</Heading>
          <Heading size="sm" color="$textLight600">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </Heading>
        </VStack>

        {/* Add Button */}
        <Button onPress={handleAddItem}>
          <ButtonText>Add New Item</ButtonText>
        </Button>

        {/* Items List */}
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <VStack space="sm">
            {items.length === 0 ? (
              <Box flex={1} justifyContent="center" alignItems="center" py="$20">
                <VStack space="md" alignItems="center">
                  <Heading size="md" color="$textLight500">No items yet</Heading>
                  <Button onPress={handleAddItem}>
                    <ButtonText>Add Your First Item</ButtonText>
                  </Button>
                </VStack>
              </Box>
            ) : (
              items.map((item) => {
                const expirationStatus = getExpirationStatus(item.expirationDate);
                
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleItemPress(item.id)}
                    onLongPress={() => handleItemLongPress(item)}
                  >
                    <Box
                      p="$4"
                      bg="$backgroundLight50"
                      borderRadius="$md"
                      borderWidth="$1"
                      borderColor="$borderLight200"
                    >
                      <VStack space="sm">
                        {/* Item Name and Status */}
                        <HStack justifyContent="space-between" alignItems="flex-start">
                          <VStack flex={1}>
                            <Heading size="md">{item.name}</Heading>
                            {item.description && (
                              <Text size="sm" color="$textLight600">
                                {item.description}
                              </Text>
                            )}
                          </VStack>
                          {expirationStatus && (
                            <Badge bg={expirationStatus.color}>
                              <BadgeText color="$white" size="xs">
                                {expirationStatus.status}
                              </BadgeText>
                            </Badge>
                          )}
                        </HStack>

                        {/* Item Details Grid */}
                        <VStack space="xs">
                          <HStack justifyContent="space-between">
                            <Text size="sm" color="$textLight700">
                              Qty: {item.quantity}
                            </Text>
                            {item.price && (
                              <Text size="sm" color="$textLight700">
                                ${item.price.toFixed(2)}
                              </Text>
                            )}
                          </HStack>
                          
                          {(item.category || item.location) && (
                            <HStack justifyContent="space-between">
                              {item.category && (
                                <Text size="sm" color="$textLight600">
                                  {item.category}
                                </Text>
                              )}
                              {item.location && (
                                <Text size="sm" color="$textLight600">
                                  {item.location}
                                </Text>
                              )}
                            </HStack>
                          )}

                          {item.expirationDate && (
                            <Text size="sm" color="$textLight600">
                              Expires: {formatDate(item.expirationDate)}
                            </Text>
                          )}

                          {item.barcode && (
                            <Text size="xs" color="$textLight500">
                              Barcode: {item.barcode}
                            </Text>
                          )}
                        </VStack>
                      </VStack>
                    </Box>
                  </Pressable>
                );
              })
            )}
          </VStack>
        </ScrollView>
      </VStack>

      {/* Action Sheet */}
      <Actionsheet
        isOpen={actionSheet.isOpen}
        onClose={handleActionSheetClose}
        zIndex={999}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent zIndex={999}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          
          <ActionsheetItem onPress={handleEdit}>
            <ActionsheetItemText>Edit</ActionsheetItemText>
          </ActionsheetItem>
          
          <ActionsheetItem onPress={handleDeletePress}>
            <ActionsheetItemText color="$red600">Delete</ActionsheetItemText>
          </ActionsheetItem>
          
          <ActionsheetItem onPress={handleActionSheetClose}>
            <ActionsheetItemText>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteDialogClose}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">Delete Item</Heading>
            <AlertDialogCloseButton onPress={handleDeleteDialogClose} />
          </AlertDialogHeader>
          
          <AlertDialogBody>
            <Text>
              Are you sure you want to delete "{deleteDialog.selectedItem?.name}"?
            </Text>
            <Text size="sm" color="$textLight600" mt="$2">
              This action cannot be undone.
            </Text>
            {deleteError && (
              <Text size="sm" color="$red600" mt="$2">
                {deleteError}
              </Text>
            )}
          </AlertDialogBody>
          
          <AlertDialogFooter>
            <HStack space="md" flex={1}>
              <Button
                variant="outline"
                onPress={handleDeleteDialogClose}
                flex={1}
                isDisabled={isDeleting}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              
              <Button
                bg="$red600"
                onPress={handleDeleteConfirm}
                flex={1}
                isDisabled={isDeleting}
                opacity={isDeleting ? 0.6 : 1}
              >
                {isDeleting ? (
                  <HStack space="sm" alignItems="center">
                    <Spinner size="small" color="$white" />
                    <ButtonText>Deleting...</ButtonText>
                  </HStack>
                ) : (
                  <ButtonText>Delete</ButtonText>
                )}
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
