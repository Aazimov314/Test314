"use client";

import Peer from "peerjs";
import { useEffect, useRef } from "react";

export default function Home() {
  const camera = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Create Peer once
    peerRef.current = new Peer();

    async function getCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (camera.current) {
          camera.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }

    getCamera();

    return () => {
      // Stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      // Disconnect peer
      peerRef.current?.destroy();
    };
  }, []);

  return (
    <div className="flex flex-row min-h-screen justify-center items-center">
      <video id="camera" autoPlay ref={camera} className="w-full h-full object-cover" />
    </div>
  );
}
