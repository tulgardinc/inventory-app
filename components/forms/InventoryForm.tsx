import { CreateInventory, CreateInventorySchema } from '@/lib/schemas';
import {
  AlertCircleIcon,
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  VStack
} from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { z } from 'zod';

interface InventoryFormProps {
  initialData?: Partial<CreateInventory>;
  onSubmit: (data: CreateInventory) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export default function InventoryForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  mode = 'create'
}: InventoryFormProps) {
  const [formData, setFormData] = useState<Partial<CreateInventory>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    try {
      // For create mode, use CreateInventorySchema validation
      const validatedData = CreateInventorySchema.parse(formData);
      
      setErrors({});
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleFieldChange = (field: keyof CreateInventory, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Box flex={1} p="$4" bg="$backgroundLight0">
      <VStack space="lg" flex={1}>
        <FormControl isInvalid={!!errors.name}>
          <FormControlLabel>
            <FormControlLabelText>Name *</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Enter inventory name"
              value={formData.name || ''}
              onChangeText={(text) => handleFieldChange('name', text)}
            />
          </Input>
          {errors.name && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.name}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormControlLabel>
            <FormControlLabelText>Description</FormControlLabelText>
          </FormControlLabel>
          <Textarea>
            <TextareaInput
              placeholder="Optional description"
              value={formData.description || ''}
              onChangeText={(text) => handleFieldChange('description', text)}
              multiline
              numberOfLines={3}
            />
          </Textarea>
          {errors.description && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.description}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <VStack space="md" mt="auto">
          <Button 
            onPress={handleSubmit}
            isDisabled={isLoading}
            opacity={isLoading ? 0.6 : 1}
          >
            <ButtonText>
              {isLoading 
                ? 'Saving...' 
                : mode === 'create' 
                  ? 'Create Inventory' 
                  : 'Update Inventory'
              }
            </ButtonText>
          </Button>
          
          <Button 
            variant="outline" 
            onPress={onCancel}
            isDisabled={isLoading}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
