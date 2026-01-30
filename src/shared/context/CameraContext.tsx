"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import { visitorSnapshotService } from "@/shared/services/visitor-snapshot.service";

interface CameraContextType {
  registerVideo: (video: HTMLVideoElement) => void;
  unregisterVideo: () => void;
  captureForSession: (sessionId: string) => Promise<void>;
}

const CameraContext = createContext<CameraContextType | null>(null);

export function CameraProvider({ children }: { children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const registerVideo = useCallback((video: HTMLVideoElement) => {
    videoRef.current = video;
  }, []);

  const unregisterVideo = useCallback(() => {
    videoRef.current = null;
  }, []);

  const captureForSession = useCallback(async (sessionId: string) => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    await visitorSnapshotService.captureAndSend(video, sessionId);
  }, []);

  return (
    <CameraContext.Provider
      value={{ registerVideo, unregisterVideo, captureForSession }}
    >
      {children}
    </CameraContext.Provider>
  );
}

export function useCamera(): CameraContextType {
  const context = useContext(CameraContext);
  if (!context) {
    // Return no-op functions if used outside provider
    return {
      registerVideo: () => {},
      unregisterVideo: () => {},
      captureForSession: async () => {},
    };
  }
  return context;
}
