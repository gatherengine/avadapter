export type AVParticipant = {
  id: string;
  isDominant: boolean;
  connectionScore: number; // 0 to 1
};

export type AVResource = {
  id: string;
  participantId: string;
  kind: "audio" | "video";
  paused: boolean;
  track: MediaStreamTrack;
};

export type ConnectStatus =
  | { status: "disconnected" }
  | { status: "connecting" }
  | { status: "connected" }
  | { status: "error"; error: Error };

