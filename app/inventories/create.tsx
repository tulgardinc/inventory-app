import InventoryForm from '@/components/forms/InventoryForm';
import { CreateInventory } from '@/lib/schemas';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function CreateInventoryScreen() {
  const router = useRouter();
  const createInventory = useAppStore((state) => state.createInventory);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateInventory) => {
    setIsLoading(true);
    try {
      const inventory = createInventory(data.name, data.description);
      router.back();
      router.push(`/inventories/${inventory.id}`);
    } catch (error) {
      console.error('Failed to create inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <InventoryForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}
