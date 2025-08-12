import ItemForm from '@/components/forms/ItemForm';
import { useDatabaseStore } from '@/lib/databaseStore';
import { UpdateItem } from '@/lib/schemas';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function EditItemScreen() {
  const router = useRouter();
  const { id, itemId } = useLocalSearchParams();
  const inventoryId = Array.isArray(id) ? id[0] : id;
  const itemIdStr = Array.isArray(itemId) ? itemId[0] : itemId as string;
  
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    getItemsForInventory, 
    updateItem,
    loadItemsForInventory 
  } = useDatabaseStore();
  
  const items = getItemsForInventory(inventoryId);
  const item = items.find(item => item.id === itemIdStr);

  useEffect(() => {
    if (inventoryId) {
      loadItemsForInventory(inventoryId);
    }
  }, [inventoryId, loadItemsForInventory]);

  const handleSubmit = async (data: UpdateItem) => {
    if (!item) return;
    
    setIsLoading(true);
    try {
      await updateItem(item.id, data);
      router.back();
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!inventoryId || !item) {
    return null;
  }

  return (
    <ItemForm
      inventoryId={inventoryId}
      initialData={{
        name: item.name,
        description: item.description || undefined,
        quantity: item.quantity,
        price: item.price || undefined,
        category: item.category || undefined,
        location: item.location || undefined,
        barcode: item.barcode || undefined,
        expirationDate: item.expirationDate || undefined,
        inventoryId: inventoryId
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      mode="edit"
    />
  );
}
