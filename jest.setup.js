import 'react-native-gesture-handler/jestSetup';

// React Native Testing Library matchers are now included by default

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  
  return Reanimated;
});

// Mock React Native animated module
jest.mock('react-native/Libraries/Animated/AnimatedImplementation', () => {
  const AnimatedImplementation = jest.requireActual('react-native/Libraries/Animated/AnimatedImplementation');
  return {
    ...AnimatedImplementation,
    timing: () => ({
      start: jest.fn(),
    }),
  };
});

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      name: 'inventory-app',
      slug: 'inventory-app',
    },
  },
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }) => children,
  Stack: {
    Screen: ({ children }) => children,
  },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// Mock expo-camera
jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(() =>
      Promise.resolve({ status: 'granted' })
    ),
  },
}));

// Mock expo-barcode-scanner
jest.mock('expo-barcode-scanner', () => ({
  BarCodeScanner: jest.fn(() => null),
}));

// Mock @react-native-community/datetimepicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  return React.forwardRef((props, ref) => {
    const mockOnChange = props.onChange;
    React.useEffect(() => {
      if (mockOnChange) {
        // Simulate date selection after a short delay
        setTimeout(() => {
          mockOnChange({}, new Date('2025-12-31'));
        }, 100);
      }
    }, [mockOnChange]);
    return React.createElement('View', { testID: 'date-time-picker', ...props });
  });
});

// Mock GlueStack UI components
jest.mock('@gluestack-ui/themed', () => ({
  Box: 'View',
  Text: 'Text',
  Heading: 'Text',
  Button: ({ children, isDisabled, ...props }) => {
    const React = require('react');
    // Pass isDisabled to children so tests can access it from ButtonText
    const enhancedChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { isDisabled, ...child.props });
      }
      return child;
    });
    return React.createElement('TouchableOpacity', { disabled: isDisabled, isDisabled, ...props }, enhancedChildren);
  },
  ButtonText: 'Text',
  Input: 'TextInput',
  InputField: 'TextInput',
  Textarea: 'View',
  TextareaInput: 'TextInput',
  VStack: 'View',
  HStack: 'View',
  Center: 'View',
  Spinner: 'View',
  FormControl: 'View',
  FormControlError: 'View',
  FormControlErrorText: 'Text',
  FormControlErrorIcon: 'View',
  FormControlLabel: 'View',
  FormControlLabelText: 'Text',
  SafeAreaView: 'View',
  ScrollView: 'ScrollView',
  KeyboardAvoidingView: 'View',
  Pressable: 'TouchableOpacity',
  Badge: 'View',
  BadgeText: 'Text',
  Actionsheet: ({ isOpen, children, ...props }) => {
    const React = require('react');
    return isOpen ? React.createElement('View', props, children) : null;
  },
  ActionsheetBackdrop: 'View',
  ActionsheetContent: 'View',
  ActionsheetDragIndicator: 'View',
  ActionsheetDragIndicatorWrapper: 'View',
  ActionsheetItem: 'TouchableOpacity',
  ActionsheetItemText: 'Text',
  AlertDialog: ({ isOpen, children, ...props }) => {
    const React = require('react');
    return isOpen ? React.createElement('View', props, children) : null;
  },
  AlertDialogBackdrop: 'View',
  AlertDialogContent: 'View',
  AlertDialogHeader: 'View',
  AlertDialogCloseButton: 'TouchableOpacity',
  AlertDialogBody: 'View',
  AlertDialogFooter: 'View',
}));

// Mock NativeWind
jest.mock('nativewind', () => ({
  styled: (Component) => Component,
}));

// Mock react-native-css-interop
jest.mock('react-native-css-interop', () => ({
  cssInterop: () => {},
}));

// Global test timeout
jest.setTimeout(15000);
