import { CreateItem, CreateItemSchema, UpdateItem, UpdateItemSchema } from '@/lib/schemas';
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
  HStack,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  VStack
} from '@gluestack-ui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { z } from 'zod';

interface ItemFormProps {
  inventoryId: string;
  initialData?: Partial<CreateItem>;
  onSubmit: (data: CreateItem | UpdateItem) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export default function ItemForm({
  inventoryId,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create'
}: ItemFormProps) {
  const [formData, setFormData] = useState<Partial<CreateItem>>({
    inventoryId,
    name: initialData?.name || '',
    description: initialData?.description || '',
    quantity: initialData?.quantity || 1,
    price: initialData?.price || undefined,
    category: initialData?.category || '',
    location: initialData?.location || '',
    barcode: initialData?.barcode || '',
    expirationDate: initialData?.expirationDate || undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showScanner, setShowScanner] = useState(false);
  const [showExpirationPicker, setShowExpirationPicker] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleSubmit = () => {
    try {
      // Validate using appropriate schema
      const schema = mode === 'create' ? CreateItemSchema : UpdateItemSchema;
      const validatedData = schema.parse(formData);

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

  const handleFieldChange = (field: keyof CreateItem, value: string | number | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    setShowScanner(false);
    handleFieldChange('barcode', data);
  };

  const openScanner = async () => {
    if (!permission) {
      // Camera permissions are still loading.
      return;
    }

    if (!permission.granted) {
      // Camera permissions are not granted yet.
      const newPermission = await requestPermission();
      if (!newPermission.granted) {
        return;
      }
    }
    
    setShowScanner(true);
  };

  if (showScanner) {
    return (
      <Box flex={1} bg="$backgroundLight0">
        <Box flex={1}>
          <CameraView
            style={{ flex: 1 }}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39", "code93", "codabar", "itf14", "datamatrix", "pdf417", "upc_a", "upc_e", "aztec"]
            }}
            onBarcodeScanned={handleBarcodeScanned}
          />
        </Box>
        <Box p="$4">
          <Button variant="outline" onPress={() => setShowScanner(false)}>
            <ButtonText>Cancel Scan</ButtonText>
          </Button>
        </Box>
      </Box>
    );
  }

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

        <FormControl isInvalid={!!errors.barcode}>
          <FormControlLabel>
            <FormControlLabelText>Barcode</FormControlLabelText>
          </FormControlLabel>
          <HStack space="sm">
            <Input flex={1}>
              <InputField
                placeholder="Scan or enter barcode"
                value={formData.barcode || ''}
                onChangeText={(text) => handleFieldChange('barcode', text)}
              />
            </Input>
            <Button size="sm" onPress={openScanner}>
              <ButtonText>Scan</ButtonText>
            </Button>
          </HStack>
          {errors.barcode && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.barcode}</FormControlErrorText>
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

        <FormControl isInvalid={!!errors.price}>
          <FormControlLabel>
            <FormControlLabelText>Price</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Enter price (optional)"
              value={formData.price?.toString() || ''}
              onChangeText={(text) => handleFieldChange('price', parseFloat(text) || undefined)}
              keyboardType="numeric"
            />
          </Input>
          {errors.price && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.price}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.category}>
          <FormControlLabel>
            <FormControlLabelText>Category</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Enter category (optional)"
              value={formData.category || ''}
              onChangeText={(text) => handleFieldChange('category', text)}
            />
          </Input>
          {errors.category && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.category}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.location}>
          <FormControlLabel>
            <FormControlLabelText>Location</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Enter location (optional)"
              value={formData.location || ''}
              onChangeText={(text) => handleFieldChange('location', text)}
            />
          </Input>
          {errors.location && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.location}</FormControlErrorText>
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

        <FormControl isInvalid={!!errors.expirationDate}>
          <FormControlLabel>
            <FormControlLabelText>Expiration Date</FormControlLabelText>
          </FormControlLabel>
          <TouchableOpacity onPress={() => setShowExpirationPicker(true)}>
            <Input isReadOnly>
              <InputField
                placeholder="Select expiration date (optional)"
                value={formData.expirationDate ? formData.expirationDate.toDateString() : ''}
                editable={false}
              />
            </Input>
          </TouchableOpacity>
          {showExpirationPicker && (
            <DateTimePicker
              value={formData.expirationDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event: any, selectedDate?: Date) => {
                setShowExpirationPicker(false);
                if (selectedDate) {
                  handleFieldChange('expirationDate', selectedDate);
                }
              }}
            />
          )}
          {errors.expirationDate && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.expirationDate}</FormControlErrorText>
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
                ? 'Create Item'
                : 'Update Item'
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
