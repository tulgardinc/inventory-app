import { CreateItem, CreateItemSchema } from '@/lib/schemas';
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
    VStack
} from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { z } from 'zod';

interface BasicItemFormProps {
  inventoryId: string;
  initialData?: Partial<CreateItem>;
  onSubmit: (data: CreateItem) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BasicItemForm({
  inventoryId,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: BasicItemFormProps) {
  const [formData, setFormData] = useState<Partial<CreateItem>>({
    inventoryId,
    name: initialData?.name || '',
    quantity: initialData?.quantity || 1,
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    try {
      const validatedData = CreateItemSchema.parse(formData);
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

  const handleFieldChange = (field: keyof CreateItem, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              placeholder="Enter item name"
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

        <FormControl isInvalid={!!errors.quantity}>
          <FormControlLabel>
            <FormControlLabelText>Quantity *</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Enter quantity"
              value={formData.quantity?.toString() || '1'}
              onChangeText={(text) => handleFieldChange('quantity', parseInt(text) || 0)}
              keyboardType="numeric"
            />
          </Input>
          {errors.quantity && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.quantity}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormControlLabel>
            <FormControlLabelText>Description</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Optional description"
              value={formData.description || ''}
              onChangeText={(text) => handleFieldChange('description', text)}
            />
          </Input>
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
              {isLoading ? 'Creating...' : 'Create Item'}
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
