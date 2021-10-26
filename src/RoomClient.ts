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

function randomPeerId() {
  return Math.random().toString().slice(2);
}

export class RoomClient extends EnhancedEventEmitter {
  // Params
  origin: string; // e.g. https://media.mydomain.com:4443
  room: string;
  peerId: string;
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

  // Events

  // notify {type, message}: messages for user, e.g. errors
  // peer-added peer
  // peer-removed peerId
  // consumer-added consumer
  // consumer-removed consumerId
  // producer-added producer
  // producer-removed producerId

  // Reactive stores
  state: Writable<RoomState> = writable({ status: "disconnected" });
  browserCan: Writable<{ audio: boolean; video: boolean }> = writable({
    audio: false,
    video: false,
  });

  constructor(
    origin,
    {
      room = "default",
      peerId = randomPeerId(),
      displayName = "user",
      produceAudio = true,
      produceVideo = true,
      consume = true,
    }
  ) {
    super();
    logger.debug("constructor()");

    this.origin = origin;
    this.room = room;
    this.peerId = peerId;
    this.displayName = displayName;
    this.produceAudio = produceAudio;
    this.produceVideo = produceVideo;
    this.consume = consume;

    this.micProducerState = writable("closed");
    this.camProducerState = writable("closed");
    this.shareProducerState = writable("closed");
  }

  getMediasoupUrl() {
    return `${this.origin}/?roomId=${this.room}&peerId=${this.peerId}`;
  }

  join() {
    logger.debug("join()");

    this.peer = new ConferencePeer(
      this,
      new WebSocketTransport(this.getMediasoupUrl())
    );
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
