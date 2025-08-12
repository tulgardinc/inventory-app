import ItemForm from '@/components/forms/ItemForm';
import { useDatabaseStore } from '@/lib/databaseStore';
import { CreateItem, UpdateItem } from '@/lib/schemas';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function CreateItemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { createItem } = useDatabaseStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateItem | UpdateItem) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Ensure inventoryId is set in the data and cast to CreateItem for creation
      const itemData = { ...data, inventoryId: id } as CreateItem;
      await createItem(itemData);
      router.back();
    } catch (error) {
      console.error('Failed to create item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!id) {
    return null;
  }

  return (
    <ItemForm
      inventoryId={id}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      mode="create"
    />
  );
}
