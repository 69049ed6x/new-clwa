#!/bin/bash
# ClawX Enhanced Build Script
# Usage: ./scripts/build.sh [win|mac|linux|all]

set -e

echo "╔══════════════════════════════════════╗"
echo "║   ClawX Enhanced Build System        ║"
echo "║   v0.2.0-beta.4                      ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "Error: pnpm is not installed"
    exit 1
fi

echo "Node.js: $(node --version)"
echo "pnpm: $(pnpm --version)"
echo ""

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Build frontend
echo "Building frontend..."
pnpm build

# Build Electron
TARGET=${1:-win}

case $TARGET in
    win)
        echo "Building Windows installer..."
        pnpm build:win
        echo "Build complete! Check release/ directory for the installer."
        ;;
    mac)
        echo "Building macOS DMG..."
        pnpm build:mac
        echo "Build complete! Check release/ directory for the DMG."
        ;;
    linux)
        echo "Building Linux AppImage..."
        pnpm build:linux
        echo "Build complete! Check release/ directory for the AppImage."
        ;;
    all)
        echo "Building for all platforms..."
        pnpm build:win
        pnpm build:mac
        pnpm build:linux
        echo "Build complete! Check release/ directory for all installers."
        ;;
    *)
        echo "Unknown target: $TARGET"
        echo "Usage: ./scripts/build.sh [win|mac|linux|all]"
        exit 1
        ;;
esac

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   Build completed successfully!      ║"
echo "╚══════════════════════════════════════╝"
