# Tech Context: Technologies, Setup & Constraints

## Technology Stack

### Core Framework
**Expo React Native ~53.0.20**
- Cross-platform mobile development (iOS/Android)
- TypeScript support with strict typing
- File-based routing with expo-router ~5.1.4
- New Architecture enabled for performance

### UI & Styling
**Gluestack UI with NativeWind** (to be added)
- Modern, accessible component library
- Utility-first CSS with Tailwind-like classes
- Consistent design system
- Native performance with styled-components

**Current UI Components** (to be replaced/supplemented):
- Basic React Native components in `/components`
- Custom themed components (ThemedText, ThemedView)
- Tab bar and icon system already implemented

### Data Storage
**SQLite with expo-sqlite** (to be added)
- Local-first database storage
- ACID compliance for data integrity
- Efficient queries with proper indexing
- Migration system for schema updates

### Navigation & Routing
**Expo Router ~5.1.4** (already configured)
- File-based routing system
- Typed routes enabled
- Tab-based navigation structure
- Modal and stack navigation support

### Development Tools
**Current Development Environment:**
- TypeScript ~5.8.3 with strict configuration
- ESLint ~9.25.0 with expo-config
- React 19.0.0 with latest features
- Node.js and npm for package management

## Required Dependencies (To Add)

### Essential Packages
```json
{
  "@gluestack-ui/themed": "^1.1.0",
  "@gluestack-style/react": "^1.0.0",
  "nativewind": "^4.0.0",
  "expo-sqlite": "~14.0.0",
  "expo-barcode-scanner": "~13.0.0",
  "expo-camera": "~15.0.0",
  "zustand": "^4.5.0",
  "zod": "^3.22.0"
}
```

### Testing Dependencies
```json
{
  "@testing-library/react-native": "^12.0.0",
  "@testing-library/jest-native": "^5.4.0",
  "detox": "^20.0.0",
  "jest": "^29.0.0"
}
```

## Development Setup

### Current Project Structure
```
inventory-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 page
├── assets/                # Static assets
├── components/            # Reusable components
├── constants/             # App constants
├── hooks/                 # Custom React hooks
└── scripts/               # Development scripts
```

### Planned Structure Extensions
```
inventory-app/
├── src/                   # Source code organization
│   ├── services/          # Database & API services
│   ├── stores/            # Zustand state stores
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Utility functions
│   └── __tests__/         # Test files
├── docs/                  # Documentation
└── e2e/                   # End-to-end tests
```

## Technical Constraints

### Platform Limitations
- **iOS Minimum Version**: iOS 13.4 (Expo SDK 53 requirement)
- **Android Minimum Version**: API level 24 (Android 7.0)
- **Device Storage**: Local SQLite database only (no cloud sync)
- **Camera Access**: Required for barcode scanning functionality

### Performance Requirements
- **App Launch Time**: < 3 seconds on mid-range devices
- **Database Queries**: < 100ms for typical operations
- **Search Response**: < 200ms for filtered results
- **Memory Usage**: Reasonable limits for large inventories

### Security Constraints
- **Data Privacy**: All data remains on device
- **Permissions**: Camera access with proper user consent
- **Data Validation**: Client-side validation with Zod schemas
- **Error Handling**: Graceful degradation without crashes

## API Integration

### Product Data Sources
**Primary**: Open Food Facts API
- Free, open-source product database
- Good coverage for food items
- JSON API with barcode lookup

**Secondary**: UPC Database (fallback)
- Broader product coverage beyond food
- Paid tier for commercial usage
- Rate limiting considerations

**Offline Handling**:
- Graceful degradation to manual entry
- Cache successful API responses
- No blocking behavior when offline

## Development Environment Setup

### Required Tools
- **Node.js**: Version 18+ (for Expo CLI)
- **Expo CLI**: For development server and building
- **Android Studio**: For Android emulation and testing  
- **Xcode**: For iOS simulation and testing (macOS only)
- **Git**: Version control

### Development Commands
```bash
# Start development server
npm run start

# Platform-specific development
npm run android  # Android emulator
npm run ios      # iOS simulator  
npm run web      # Web browser

# Code quality
npm run lint     # ESLint checking
```

### Testing Strategy
**Unit Tests**: Jest + React Native Testing Library
- Database operations and business logic
- Component rendering and interactions
- Custom hooks and utilities

**End-to-End Tests**: Detox
- Complete user workflows
- Cross-platform testing on iOS/Android
- Camera and navigation testing

## Configuration Files

### TypeScript Configuration
- Strict mode enabled in `tsconfig.json`
- Path mapping for clean imports
- React Native and Expo type definitions

### Expo Configuration
- App metadata in `app.json`
- Platform-specific settings (iOS/Android)
- Plugin configuration for added functionality

### Linting Configuration
- ESLint with expo-recommended rules
- TypeScript integration
- Consistent code style enforcement

This technical foundation provides a solid base for building the inventory management app with modern React Native practices and comprehensive testing capabilities.
