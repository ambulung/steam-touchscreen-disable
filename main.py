import os
import subprocess
import asyncio
import glob

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code repo
# and add the `decky-loader/plugin/imports` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky

class Plugin:
    def __init__(self):
        self.touchscreen_enabled = True
        self.device_path = None
        self.uevent_path = None

    async def find_touchscreen_device(self):
        """Find the touchscreen device path"""
        try:
            # Common touchscreen device patterns
            possible_devices = [
                "/dev/input/event0",  # Common Steam Deck touchscreen
                "/dev/input/event1",
                "/dev/input/event2",
                "/dev/input/event3"
            ]
            
            # Also check for devices with "touchscreen" in their name
            input_devices = glob.glob("/dev/input/event*")
            
            for device in input_devices + possible_devices:
                if os.path.exists(device):
                    # Try to get device info
                    try:
                        result = subprocess.run(["udevadm", "info", "--name", device], 
                                              capture_output=True, text=True, timeout=5)
                        if "touchscreen" in result.stdout.lower() or "touch" in result.stdout.lower():
                            self.device_path = device
                            # Extract device number for uevent path
                            device_num = device.split("event")[-1]
                            self.uevent_path = f"/sys/class/input/event{device_num}/uevent"
                            decky.logger.info(f"Found touchscreen device: {device}")
                            return True
                    except Exception as e:
                        decky.logger.debug(f"Error checking device {device}: {e}")
                        continue
            
            # Fallback to event0 if no specific touchscreen found
            if os.path.exists("/dev/input/event0"):
                self.device_path = "/dev/input/event0"
                self.uevent_path = "/sys/class/input/event0/uevent"
                decky.logger.info("Using fallback device: /dev/input/event0")
                return True
                
            decky.logger.error("No touchscreen device found")
            return False
            
        except Exception as e:
            decky.logger.error(f"Error finding touchscreen device: {e}")
            return False

    async def get_touchscreen_status(self) -> bool:
        """Get current touchscreen status"""
        try:
            if not self.device_path:
                if not await self.find_touchscreen_device():
                    return False
            
            # Check if touchscreen device exists and is accessible
            result = subprocess.run(["ls", self.device_path], 
                                  capture_output=True, text=True, timeout=5)
            return result.returncode == 0
        except Exception as e:
            decky.logger.error(f"Error checking touchscreen status: {e}")
            return False

    async def toggle_touchscreen(self) -> bool:
        """Toggle touchscreen input on/off"""
        try:
            if not self.uevent_path:
                if not await self.find_touchscreen_device():
                    return False
            
            if self.touchscreen_enabled:
                # Disable touchscreen
                result = subprocess.run(["sudo", "sh", "-c", f"echo '1' > {self.uevent_path}"], 
                                      capture_output=True, text=True, timeout=10)
                if result.returncode == 0:
                    self.touchscreen_enabled = False
                    decky.logger.info("Touchscreen disabled")
                    return True
                else:
                    decky.logger.error(f"Failed to disable touchscreen: {result.stderr}")
                    return False
            else:
                # Enable touchscreen
                result = subprocess.run(["sudo", "sh", "-c", f"echo '0' > {self.uevent_path}"], 
                                      capture_output=True, text=True, timeout=10)
                if result.returncode == 0:
                    self.touchscreen_enabled = True
                    decky.logger.info("Touchscreen enabled")
                    return True
                else:
                    decky.logger.error(f"Failed to enable touchscreen: {result.stderr}")
                    return False
        except Exception as e:
            decky.logger.error(f"Error toggling touchscreen: {e}")
            return False

    async def enable_touchscreen(self) -> bool:
        """Enable touchscreen input"""
        try:
            if not self.uevent_path:
                if not await self.find_touchscreen_device():
                    return False
            
            result = subprocess.run(["sudo", "sh", "-c", f"echo '0' > {self.uevent_path}"], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                self.touchscreen_enabled = True
                decky.logger.info("Touchscreen enabled")
                return True
            else:
                decky.logger.error(f"Failed to enable touchscreen: {result.stderr}")
                return False
        except Exception as e:
            decky.logger.error(f"Error enabling touchscreen: {e}")
            return False

    async def disable_touchscreen(self) -> bool:
        """Disable touchscreen input"""
        try:
            if not self.uevent_path:
                if not await self.find_touchscreen_device():
                    return False
            
            result = subprocess.run(["sudo", "sh", "-c", f"echo '1' > {self.uevent_path}"], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                self.touchscreen_enabled = False
                decky.logger.info("Touchscreen disabled")
                return True
            else:
                decky.logger.error(f"Failed to disable touchscreen: {result.stderr}")
                return False
        except Exception as e:
            decky.logger.error(f"Error disabling touchscreen: {e}")
            return False

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        self.loop = asyncio.get_event_loop()
        decky.logger.info("Touchscreen Toggle Plugin loaded!")
        
        # Find and initialize touchscreen device
        if await self.find_touchscreen_device():
            self.touchscreen_enabled = await self.get_touchscreen_status()
            decky.logger.info(f"Touchscreen device initialized: {self.device_path}")
        else:
            decky.logger.error("Failed to initialize touchscreen device")

    # Function called first during the unload process, utilize this to handle your plugin being stopped, but not
    # completely removed
    async def _unload(self):
        decky.logger.info("Touchscreen Toggle Plugin unloading!")
        pass

    # Function called after `_unload` during uninstall, utilize this to clean up processes and other remnants of your
    # plugin that may remain on the system
    async def _uninstall(self):
        decky.logger.info("Touchscreen Toggle Plugin uninstalling!")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky.logger.info("Migrating Touchscreen Toggle Plugin")
        # Here's a migration example for logs:
        # - `~/.config/decky-touchscreen-toggle/touchscreen-toggle.log` will be migrated to `decky.decky_LOG_DIR/touchscreen-toggle.log`
        decky.migrate_logs(os.path.join(decky.DECKY_USER_HOME,
                                               ".config", "decky-touchscreen-toggle", "touchscreen-toggle.log"))
        # Here's a migration example for settings:
        # - `~/homebrew/settings/touchscreen-toggle.json` is migrated to `decky.decky_SETTINGS_DIR/touchscreen-toggle.json`
        # - `~/.config/decky-touchscreen-toggle/` all files and directories under this root are migrated to `decky.decky_SETTINGS_DIR/`
        decky.migrate_settings(
            os.path.join(decky.DECKY_HOME, "settings", "touchscreen-toggle.json"),
            os.path.join(decky.DECKY_USER_HOME, ".config", "decky-touchscreen-toggle"))
        # Here's a migration example for runtime data:
        # - `~/homebrew/touchscreen-toggle/` all files and directories under this root are migrated to `decky.decky_RUNTIME_DIR/`
        # - `~/.local/share/decky-touchscreen-toggle/` all files and directories under this root are migrated to `decky.decky_RUNTIME_DIR/`
        decky.migrate_runtime(
            os.path.join(decky.DECKY_HOME, "touchscreen-toggle"),
            os.path.join(decky.DECKY_USER_HOME, ".local", "share", "decky-touchscreen-toggle"))
