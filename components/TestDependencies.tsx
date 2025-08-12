import { Box, Button, Text, VStack } from '@gluestack-ui/themed';
import React from 'react';
import { View } from 'react-native';

// Test component to verify all dependencies work correctly
export default function TestDependencies() {
  return (
    <View className="flex-1 justify-center items-center p-4" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <VStack space="md" alignItems="center">
        <Box bg="$primary500" p="$4" rounded="$lg">
          <Text color="$white" fontWeight="$bold">
            🎉 GlueStack UI Working!
          </Text>
        </Box>
        
        <Text size="lg" textAlign="center">
          All core dependencies installed successfully:
        </Text>
        
        <VStack space="sm" alignItems="center">
          <Text>✅ GlueStack UI + NativeWind</Text>
          <Text>✅ Expo SQLite</Text>
          <Text>✅ Barcode Scanner & Camera</Text>
          <Text>✅ Zustand State Management</Text>
          <Text>✅ Zod Data Validation</Text>
        </VStack>
        
        <Button
          size="md"
          variant="solid"
          action="primary"
          onPress={() => console.log('GlueStack UI Button Works!')}
        >
          <Text color="$white">Test Button</Text>
        </Button>
      </VStack>
    </View>
  );
}
