import BasicItemForm from '@/components/forms/BasicItemForm';
import { CreateItem } from '@/lib/schemas';
import { useAppStore } from '@/lib/store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function CreateItemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const createItem = useAppStore((state) => state.createItem);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateItem) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      createItem(id, data.name, data.description, data.barcode);
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
    <BasicItemForm
      inventoryId={id}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}
