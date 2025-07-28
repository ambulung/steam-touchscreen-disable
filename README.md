# Touchscreen Toggle Plugin for Steam Deck

A Decky plugin that allows you to toggle touchscreen input on your Steam Deck.

## Features

- **Toggle Touchscreen**: Quickly enable/disable touchscreen input
- **Individual Controls**: Separate buttons for enable and disable functions
- **Status Indicator**: Visual indicator showing current touchscreen status
- **Real-time Feedback**: Toast notifications for operation success/failure

## Installation

1. Install Decky Loader on your Steam Deck if you haven't already
2. Download this plugin and place it in your Decky plugins directory
3. Restart Decky Loader
4. The plugin will appear in your Decky menu

## Usage

1. Open the Decky menu on your Steam Deck
2. Navigate to the "Touchscreen Toggle" plugin
3. Use the following controls:
   - **Toggle Touchscreen**: Switches between enabled/disabled states
   - **Enable Touchscreen**: Explicitly enables touchscreen input
   - **Disable Touchscreen**: Explicitly disables touchscreen input
   - **Status Indicator**: Shows current state (green for enabled, red for disabled)

## Requirements

- Steam Deck with Decky Loader installed
- Sudo privileges (for touchscreen device control)

## Technical Details

The plugin works by modifying the touchscreen device's uevent file in `/sys/class/input/event0/uevent`. This is a low-level method that directly controls the touchscreen input device.

### Device Path

The plugin uses `/dev/input/event0` as the default touchscreen device. If your Steam Deck uses a different device path, you may need to modify the `device_path` variable in `main.py`.

### Permissions

The plugin requires sudo privileges to modify the touchscreen device. Make sure your Decky Loader installation has the necessary permissions.

## Troubleshooting

### Plugin Not Working

1. Check that Decky Loader is properly installed and running
2. Verify that the plugin appears in your Decky menu
3. Check the Decky logs for any error messages

### Touchscreen Still Responds After Disabling

1. The plugin may need to be restarted
2. Try disabling and re-enabling the plugin
3. Check if your Steam Deck uses a different touchscreen device path

### Permission Errors

1. Ensure Decky Loader has sudo privileges
2. Check that the touchscreen device path is correct
3. Verify that the `/sys/class/input/event0/uevent` file is writable

## Development

### Building

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run watch
```

## License

BSD-3-Clause

## Contributing

Feel free to submit issues and enhancement requests!

## Disclaimer

This plugin modifies system-level input device settings. Use at your own risk. The authors are not responsible for any issues that may arise from using this plugin.
