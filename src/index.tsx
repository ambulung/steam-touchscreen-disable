import {
  ButtonItem,
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC, useState, useEffect } from "react";
import { FaTabletAlt } from "react-icons/fa";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load initial status
  useEffect(() => {
    loadTouchscreenStatus();
  }, []);

  const loadTouchscreenStatus = async () => {
    try {
      const result = await serverAPI.callPluginMethod<{}, boolean>(
        "get_touchscreen_status",
        {}
      );
      if (result.success) {
        setIsEnabled(result.result);
      }
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
      const result = await serverAPI.callPluginMethod<{}, boolean>(
        "toggle_touchscreen",
        {}
      );
      if (result.success && result.result) {
        setIsEnabled(!isEnabled);
        serverAPI.toaster.toast({
          title: "Success",
          body: `Touchscreen ${!isEnabled ? 'enabled' : 'disabled'}`
        });
      } else {
        serverAPI.toaster.toast({
          title: "Error",
          body: "Failed to toggle touchscreen"
        });
      }
    } catch (error) {
      console.error("Toggle error:", error);
      serverAPI.toaster.toast({
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
      const result = await serverAPI.callPluginMethod<{}, boolean>(
        "enable_touchscreen",
        {}
      );
      if (result.success && result.result) {
        setIsEnabled(true);
        serverAPI.toaster.toast({
          title: "Success",
          body: "Touchscreen enabled"
        });
      } else {
        serverAPI.toaster.toast({
          title: "Error",
          body: "Failed to enable touchscreen"
        });
      }
    } catch (error) {
      console.error("Enable error:", error);
      serverAPI.toaster.toast({
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
      const result = await serverAPI.callPluginMethod<{}, boolean>(
        "disable_touchscreen",
        {}
      );
      if (result.success && result.result) {
        setIsEnabled(false);
        serverAPI.toaster.toast({
          title: "Success",
          body: "Touchscreen disabled"
        });
      } else {
        serverAPI.toaster.toast({
          title: "Error",
          body: "Failed to disable touchscreen"
        });
      }
    } catch (error) {
      console.error("Disable error:", error);
      serverAPI.toaster.toast({
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

export default definePlugin((serverAPI: ServerAPI) => {
  console.log("Touchscreen Toggle plugin initializing");

  return {
    title: <div className={staticClasses.Title}>Touchscreen Toggle</div>,
    content: <Content serverAPI={serverAPI} />,
    icon: <FaTabletAlt />,
    onDismount() {
      console.log("Touchscreen Toggle plugin unloading");
    },
  };
});
