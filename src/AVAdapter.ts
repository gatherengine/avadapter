import { TypedEmitter } from "tiny-typed-emitter";
import { RoomClient } from "./mediasoup/RoomClient";
import type { BandwidthEstimate, MSPeer } from "./mediasoup/types";

interface AVAdapterEvents {
  "participant-added": (peer: AVParticipant) => void;
  "participant-updated": (peer: AVParticipant) => void;
  "participant-removed": (peerId: string) => void;

  "resource-added": (resource: AVResource) => void;
  "resource-updated": (resource: AVResource) => void;
  "resource-removed": (resourceId: string) => void;

  "bandwidth-estimate": (estimate: BandwidthEstimate) => void;
  "status-updated": (status: ConnectStatus) => void;
}

export class AVAdapter extends TypedEmitter<AVAdapterEvents> {
  origin: string;

  constructor({ origin }) {
    super();
    this.origin = origin;
  }

  connect({ roomId, displayName, userId, produceAudio, produceVideo }) {}

  enableMic() {}
  disableMic(pause: boolean = false) {}

  enableCam() {}
  disableCam(pause: boolean = false) {}

  enableShare() {}
  disableShare(pause: boolean = false) {}
}

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

export class MediaSoupAVAdapter extends AVAdapter {
  room: RoomClient;

  connect({
    roomId = "default",
    userId = randomPeerId(),
    displayName = "user",
    produceAudio = true,
    produceVideo = true,
  }) {
    this.room = new RoomClient(this.origin, {
      roomId,
      peerId: userId,
      displayName,
      produceAudio,
      produceVideo,
    });
    this.room.on("peer-added", (peer: MSPeer) => {
      this.emit("participant-added", {
        id: peer.id,
        isDominant: false,
        connectionScore: 1,
      });
    });
    this.room.on("peer-removed", (peerId: string) => {
      this.emit("participant-removed", peerId);
    });
    this.room.on("consumer-added", (consumer) => {
      this.emit("resource-added", {
        id: consumer.id,
        participantId: consumer.peerId,
        paused: false,
        kind: consumer.kind,
        track: consumer.track,
      });
    });
    this.room.on("consumer-removed", (consumerId) => {
      this.emit("resource-removed", consumerId);
    });
    this.room.on("bandwidth-estimate", (estimate: BandwidthEstimate) => {
      this.emit("bandwidth-estimate", estimate);
    });
    this.room.join();
  }
}

// https://www.twilio.com/docs/video
// class TwilioAVAdapter extends AVAdapter {
//   constructor() {
//     super();
//     this.on("twilioParticipantAdded", (twilioParticipant) => {
//       const peer: RelmAVPeer =
//         this.twilioParticipantToRelmPeer(twilioParticipant);
//       this.emit("peer-added", peer);
//     });

//     this.on("twilioAdjustDownlinkReport", (report) => {
//       this.emit("peer-updated", peer);
//     });
//   }

//   connect({ roomId, displayName, userId, produceAudio, produceVideo }) {}

//   enableMic() {}
//   disableMic(pause: boolean = false) {}

//   enableCam() {}
//   disableCam(pause: boolean = false) {}

//   enableShare() {}
//   disableShare(pause: boolean = false) {}
// }
function randomPeerId() {
  return Math.random().toString().slice(2);
}
