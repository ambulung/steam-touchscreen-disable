import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  staticClasses
} from "@decky/ui";
import {
  callable,
  definePlugin,
  toaster
} from "@decky/api"
import { useState, useEffect } from "react";
import { FaTabletAlt } from "react-icons/fa";

// Callable functions for backend communication
const toggleTouchscreen = callable<[], boolean>("toggle_touchscreen");
const getTouchscreenStatus = callable<[], boolean>("get_touchscreen_status");
const enableTouchscreen = callable<[], boolean>("enable_touchscreen");
const disableTouchscreen = callable<[], boolean>("disable_touchscreen");

function Content() {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load initial status
  useEffect(() => {
    loadTouchscreenStatus();
  }, []);

  const loadTouchscreenStatus = async () => {
    try {
      const status = await getTouchscreenStatus();
      setIsEnabled(status);
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to load touchscreen status:", error);
      setIsInitialized(true);
    }
  };

  const handleToggle = async () => {
    if (!isInitialized) return;
    
    setIsLoading(true);
    try {
      const success = await toggleTouchscreen();
      if (success) {
        setIsEnabled(!isEnabled);
        toaster.toast({
          title: "Success",
          body: `Touchscreen ${!isEnabled ? 'enabled' : 'disabled'}`
        });
      } else {
        toaster.toast({
          title: "Error",
          body: "Failed to toggle touchscreen"
        });
      }
    } catch (error) {
      console.error("Toggle error:", error);
      toaster.toast({
        title: "Error",
        body: "Failed to toggle touchscreen"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable = async () => {
    if (!isInitialized) return;
    
    setIsLoading(true);
    try {
      const success = await enableTouchscreen();
      if (success) {
        setIsEnabled(true);
        toaster.toast({
          title: "Success",
          body: "Touchscreen enabled"
        });
      } else {
        toaster.toast({
          title: "Error",
          body: "Failed to enable touchscreen"
        });
      }
    } catch (error) {
      console.error("Enable error:", error);
      toaster.toast({
        title: "Error",
        body: "Failed to enable touchscreen"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!isInitialized) return;
    
    setIsLoading(true);
    try {
      const success = await disableTouchscreen();
      if (success) {
        setIsEnabled(false);
        toaster.toast({
          title: "Success",
          body: "Touchscreen disabled"
        });
      } else {
        toaster.toast({
          title: "Error",
          body: "Failed to disable touchscreen"
        });
      }
    } catch (error) {
      console.error("Disable error:", error);
      toaster.toast({
        title: "Error",
        body: "Failed to disable touchscreen"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <PanelSection title="Touchscreen Controls">
        <PanelSectionRow>
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            padding: "20px"
          }}>
            <span>Loading...</span>
          </div>
        </PanelSectionRow>
      </PanelSection>
    );
  }

  return (
    <PanelSection title="Touchscreen Controls">
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={handleToggle}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : `Toggle Touchscreen (${isEnabled ? 'Enabled' : 'Disabled'})`}
        </ButtonItem>
      </PanelSectionRow>
      
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={handleEnable}
          disabled={isLoading || isEnabled}
        >
          Enable Touchscreen
        </ButtonItem>
      </PanelSectionRow>
      
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={handleDisable}
          disabled={isLoading || !isEnabled}
        >
          Disable Touchscreen
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          padding: "10px",
          backgroundColor: isEnabled ? "#4CAF50" : "#f44336",
          borderRadius: "8px",
          margin: "10px 0"
        }}>
          <span style={{ 
            color: "white", 
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            Status: {isEnabled ? "ENABLED" : "DISABLED"}
          </span>
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
};

export default definePlugin(() => {
  console.log("Touchscreen Toggle plugin initializing")

  return {
    // The name shown in various decky menus
    name: "Touchscreen Toggle",
    // The element displayed at the top of your plugin's menu
    titleView: <div className={staticClasses.Title}>Touchscreen Toggle</div>,
    // The content of your plugin's menu
    content: <Content />,
    // The icon displayed in the plugin list
    icon: <FaTabletAlt />,
    // The function triggered when your plugin unloads
    onDismount() {
      console.log("Touchscreen Toggle plugin unloading")
    },
  };
});
