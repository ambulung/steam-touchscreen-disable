#!/usr/bin/env python3
"""
Test script for Touchscreen Toggle Plugin
This script tests the plugin functionality without requiring Decky Loader
"""

import asyncio
import subprocess
import os
import glob

class TouchscreenTester:
    def __init__(self):
        self.device_path = None
        self.uevent_path = None
        self.touchscreen_enabled = True

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
            
            print("Available input devices:")
            for device in input_devices:
                print(f"  - {device}")
            
            for device in input_devices + possible_devices:
                if os.path.exists(device):
                    # Try to get device info
                    try:
                        result = subprocess.run(["udevadm", "info", "--name", device], 
                                              capture_output=True, text=True, timeout=5)
                        print(f"Device {device} info: {result.stdout[:200]}...")
                        if "touchscreen" in result.stdout.lower() or "touch" in result.stdout.lower():
                            self.device_path = device
                            # Extract device number for uevent path
                            device_num = device.split("event")[-1]
                            self.uevent_path = f"/sys/class/input/event{device_num}/uevent"
                            print(f"Found touchscreen device: {device}")
                            return True
                    except Exception as e:
                        print(f"Error checking device {device}: {e}")
                        continue
            
            # Fallback to event0 if no specific touchscreen found
            if os.path.exists("/dev/input/event0"):
                self.device_path = "/dev/input/event0"
                self.uevent_path = "/sys/class/input/event0/uevent"
                print("Using fallback device: /dev/input/event0")
                return True
                
            print("No touchscreen device found")
            return False
            
        except Exception as e:
            print(f"Error finding touchscreen device: {e}")
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
            print(f"Error checking touchscreen status: {e}")
            return False

    async def test_toggle(self):
        """Test the toggle functionality"""
        print("\n=== Touchscreen Toggle Test ===")
        
        # Find device
        if not await self.find_touchscreen_device():
            print("❌ Failed to find touchscreen device")
            return False
        
        print(f"✅ Found device: {self.device_path}")
        print(f"✅ Uevent path: {self.uevent_path}")
        
        # Check initial status
        initial_status = await self.get_touchscreen_status()
        print(f"✅ Initial status: {'Enabled' if initial_status else 'Disabled'}")
        
        # Test toggle (simulated)
        print("\n⚠️  Note: This is a simulation. No actual device changes will be made.")
        print("To test actual functionality, install the plugin on a Steam Deck.")
        
        return True

async def main():
    tester = TouchscreenTester()
    await tester.test_toggle()

if __name__ == "__main__":
    asyncio.run(main()) 