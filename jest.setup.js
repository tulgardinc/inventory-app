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

// Mock GlueStack UI components
jest.mock('@gluestack-ui/themed', () => ({
  Box: 'View',
  Text: 'Text',
  Button: ({ children, isDisabled, ...props }) => {
    const React = require('react');
    return React.createElement('TouchableOpacity', { isDisabled, ...props }, children);
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
