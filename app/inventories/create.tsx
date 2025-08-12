import InventoryForm from '@/components/forms/InventoryForm';
import { useDatabaseStore } from '@/lib/databaseStore';
import { CreateInventory } from '@/lib/schemas';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function CreateInventoryScreen() {
  const router = useRouter();
  const createInventory = useDatabaseStore((state) => state.createInventory);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateInventory) => {
    setIsLoading(true);
    try {
      const inventory = await createInventory(data);
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
