#!/bin/bash

# Touchscreen Toggle Plugin Installation Script
# This script helps install the plugin on a Steam Deck

echo "Touchscreen Toggle Plugin Installer"
echo "=================================="

# Check if we're on a Steam Deck
if [[ ! -f /etc/os-release ]] || ! grep -q "steam" /etc/os-release; then
    echo "Warning: This doesn't appear to be a Steam Deck. Installation may not work correctly."
fi

# Check if Decky Loader is installed
if [[ ! -d "/home/deck/homebrew" ]]; then
    echo "Error: Decky Loader not found. Please install Decky Loader first."
    echo "Visit: https://github.com/SteamDeckHomebrew/decky-loader"
    exit 1
fi

# Create plugin directory
PLUGIN_DIR="/home/deck/homebrew/plugins/touchscreen-toggle"
echo "Creating plugin directory: $PLUGIN_DIR"
mkdir -p "$PLUGIN_DIR"

# Copy plugin files
echo "Copying plugin files..."
cp -r dist "$PLUGIN_DIR/"
cp package.json "$PLUGIN_DIR/"
cp plugin.json "$PLUGIN_DIR/"
cp main.py "$PLUGIN_DIR/"
cp README.md "$PLUGIN_DIR/"
cp LICENSE "$PLUGIN_DIR/"

# Set permissions
echo "Setting permissions..."
chmod -R 755 "$PLUGIN_DIR"

echo ""
echo "Installation complete!"
echo "====================="
echo "The Touchscreen Toggle plugin has been installed to:"
echo "$PLUGIN_DIR"
echo ""
echo "To activate the plugin:"
echo "1. Restart Decky Loader"
echo "2. Open the Decky menu on your Steam Deck"
echo "3. Look for 'Touchscreen Toggle' in the plugin list"
echo ""
echo "Note: The plugin requires sudo privileges to control the touchscreen."
echo "Make sure Decky Loader has the necessary permissions." 