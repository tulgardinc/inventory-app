import { Stack } from 'expo-router';
import React from 'react';

export default function InventoriesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Inventories',
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Create Inventory',
        }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          title: 'Inventory Details',
        }}
      />
      <Stack.Screen
        name="[id]/items/index"
        options={{
          title: 'Items',
        }}
      />
      <Stack.Screen
        name="[id]/items/create"
        options={{
          title: 'Add Item',
        }}
      />
      <Stack.Screen
        name="[id]/items/[itemId]/index"
        options={{
          title: 'Item Details',
        }}
      />
    </Stack>
  );
}
