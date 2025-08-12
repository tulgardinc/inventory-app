#!/bin/bash

# CI-friendly test execution script
# This script ensures tests pass before allowing commits/PRs

set -e

echo "🧪 Running CI Test Suite..."

# Check if we're in a CI environment
if [ "$CI" = "true" ]; then
    echo "📋 CI Environment detected"
    export NODE_ENV=test
fi

# Run linting first
echo "🔍 Running ESLint..."
npm run lint

# Run type checking
echo "🔧 Running TypeScript compilation check..."
npx tsc --noEmit

# Run tests with coverage
echo "🧪 Running test suite..."
npm run test:ci

# Check coverage thresholds
echo "📊 Checking coverage thresholds..."
# Coverage is already enforced in jest.config.js

echo "✅ All CI checks passed!"
