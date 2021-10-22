import type { types as media } from "mediasoup-client";
import type { Transport } from "mediasoup-client/lib/Transport";
import { EnhancedEventEmitter } from "mediasoup-client/lib/EnhancedEventEmitter";
import { WebSocketTransport } from "protoo-client";
import { writable, Writable } from "svelte/store";

import { Logger } from "./Logger";
import type { RoomState } from "./RoomState";
import { ConferencePeer } from "./ConferencePeer";

const logger = new Logger("RoomClient");

type ProducerState = "closed" | "open" | "paused" | "error";

export class RoomClient extends EnhancedEventEmitter {
  // Params
  room: string;
  url: string;
  displayName: string;
  produceAudio: boolean;
  produceVideo: boolean;
  consume: boolean;

  // Internal state
  consumers: Map<String, media.Consumer> = new Map();

  micProducer: media.Producer;
  micProducerState: Writable<ProducerState>;

  camProducer: media.Producer;
  camProducerState: Writable<ProducerState>;

  shareProducer: media.Producer;
  shareProducerState: Writable<ProducerState>;

  sendTransport: Transport;
  recvTransport: Transport;
  peer: ConferencePeer;

  // Reactive stores
  state: Writable<RoomState> = writable({ status: "disconnected" });
  browserCan: Writable<{ audio: boolean; video: boolean }> = writable({
    audio: false,
    video: false,
  });

  constructor(
    url,
    {
      room = "default",
      displayName = "user",
      produceAudio = true,
      produceVideo = true,
      consume = true,
    }
  ) {
    super();

    this.url = url;
    this.room = room;
    this.displayName = displayName;
    this.produceAudio = produceAudio;
    this.produceVideo = produceVideo;
    this.consume = consume;

    this.micProducerState = writable("closed");
    this.camProducerState = writable("closed");
    this.shareProducerState = writable("closed");
  }

  join() {
    this.peer = new ConferencePeer(this, new WebSocketTransport(this.url));
    this.state.set({ status: "connecting" });
  }

  close() {
    this.closeTransports();
    this.peer.close();
    this.state.set({ status: "disconnected" });
  }

  async muteMic() {
    if (!this.micProducer) {
      logger.debug("mic already muted");
      return;
    }

    this.micProducer.pause();

    try {
      await this.peer.request("pauseProducer", {
        producerId: this.micProducer.id,
      });

      this.micProducerState.set("paused");
    } catch (error) {
      logger.error("muteMic() | failed: %o", error);

      this.micProducerState.set("error");

      this.emit("notify", {
        type: "error",
        text: `Error pausing server-side mic Producer: ${error}`,
      });
    }
  }

  closeTransports() {
    if (this.sendTransport) {
      this.sendTransport.close();
      this.sendTransport = null;
    }

    if (this.recvTransport) {
      this.recvTransport.close();
      this.recvTransport = null;
    }
  }
}
