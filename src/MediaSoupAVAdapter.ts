import { RoomClient } from "./mediasoup/RoomClient";
import type { BandwidthEstimate, MSPeer } from "./mediasoup/types";
import { AVAdapter } from "./AVAdapter";

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

function randomPeerId() {
  return Math.random().toString().slice(2);
}
