#!/bin/bash
# ClawX Enhanced Dependency Installer
# Installs OpenClaw and OpenCode runtime dependencies

set -e

echo "╔══════════════════════════════════════╗"
echo "║   ClawX Enhanced Dep Installer       ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Detect OS
OS="$(uname -s)"
case "$OS" in
    Linux*)     PLATFORM="linux";;
    Darwin*)    PLATFORM="mac";;
    MINGW*|MSYS*|CYGWIN*) PLATFORM="win";;
    *)          PLATFORM="unknown";;
esac

echo "Detected platform: $PLATFORM"
echo ""

# Install OpenClaw
echo "═══ Installing OpenClaw ═══"
echo ""

if command -v pip3 &> /dev/null; then
    echo "Installing OpenClaw via pip..."
    pip3 install openclaw --upgrade
    echo "OpenClaw installed successfully!"
elif command -v pip &> /dev/null; then
    echo "Installing OpenClaw via pip..."
    pip install openclaw --upgrade
    echo "OpenClaw installed successfully!"
else
    echo "Warning: pip not found. Please install Python 3.11+ first."
    echo "Then run: pip install openclaw"
fi

echo ""

# Install OpenCode
echo "═══ Installing OpenCode ═══"
echo ""

if command -v go &> /dev/null; then
    echo "Installing OpenCode via go install..."
    go install github.com/anomalyco/opencode@latest
    echo "OpenCode installed successfully!"
else
    echo "Warning: Go not found. Please install Go 1.23+ first."
    echo "Then run: go install github.com/anomalyco/opencode@latest"
    echo ""
    echo "Alternative: Download pre-built binary from"
    echo "https://github.com/anomalyco/opencode/releases"
fi

echo ""

# Create default config directories
echo "═══ Setting up configuration ═══"
echo ""

mkdir -p ~/.openclaw
mkdir -p ~/.opencode

# Create default OpenClaw config if not exists
if [ ! -f ~/.openclaw/config.yaml ]; then
    cat > ~/.openclaw/config.yaml << 'EOF'
gateway:
  port: 8766
  ws_port: 8765

providers:
  anthropic:
    api_key: ${ANTHROPIC_API_KEY}
  openai:
    api_key: ${OPENAI_API_KEY}

skills:
  - document
  - search
  - self-improving

channels:
  default:
    type: local
EOF
    echo "Created default OpenClaw config at ~/.openclaw/config.yaml"
fi

# Create default OpenCode config if not exists
if [ ! -f ~/.opencode.json ]; then
    cat > ~/.opencode.json << 'EOF'
{
  "provider": "anthropic",
  "model": "claude-sonnet-4",
  "server": {
    "port": 9090,
    "host": "localhost"
  },
  "mcpServers": {}
}
EOF
    echo "Created default OpenCode config at ~/.opencode.json"
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   Setup complete!                    ║"
echo "║                                      ║"
echo "║   Next steps:                        ║"
echo "║   1. Set API keys in config files    ║"
echo "║   2. Run: pnpm electron:dev          ║"
echo "╚══════════════════════════════════════╝"
