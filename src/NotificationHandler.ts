import { Logger } from "./Logger";
import type { ProtooNotification } from "protoo-client";
import type { RoomClient } from "./RoomClient";

const logger = new Logger("NotificationHandler");

function producerScore(room: RoomClient, producerId, score) {
  //
}

function newPeer(room: RoomClient, peer) {
  //
}

function peerClosed(room: RoomClient, peerId) {
  //
}

function peerDisplayNameChanged(
  room: RoomClient,
  peerId,
  displayName,
  oldDisplayName
) {
  //
}

function downlinkBwe(room: RoomClient, data) {
  //
}

function consumerClosed(room: RoomClient, consumerId) {
  //
}

function consumerPaused(room: RoomClient, consumerId) {
  //
}

function consumerResumed(room: RoomClient, consumerId) {
  //
}

function consumerLayersChanged(
  room: RoomClient,
  consumerId,
  spatialLayer,
  temporalLayer
) {
  //
}
function consumerScore(room: RoomClient, consumerId, score) {
  //
}

function activeSpeaker(room: RoomClient, peerId) {
  //
}

export function dispatchNotification(
  client: RoomClient,
  notification: ProtooNotification
) {
  const data = notification.data;

  if (["producerScore", "activeSpeaker"].includes(notification.method)) {
    // logger.debug("received: %o", notification);
  } else {
    logger.debug("received: %o", notification);
  }

  switch (notification.method) {
    case "producerScore":
      return producerScore(client, data.producerId, data.score);
    case "newPeer":
      return newPeer(client, data);
    case "peerClosed":
      return peerClosed(client, data);
    case "peerDisplayNameChanged":
      return peerDisplayNameChanged(
        client,
        data.peerId,
        data.displayName,
        data.oldDisplayName
      );
    case "downlinkBwe":
      return downlinkBwe(client, data);
    case "consumerClosed":
      return consumerClosed(client, data.consumerId);
    case "consumerPaused":
      return consumerPaused(client, data.consumerId);
    case "consumerResumed":
      return consumerResumed(client, data.consumerId);
    case "consumerLayersChanged":
      return consumerLayersChanged(
        client,
        data.consumerId,
        data.spatialLayer,
        data.temporalLayer
      );
    case "consumerScore":
      return consumerScore(client, data.consumerId, data.score);
    case "activeSpeaker":
      return activeSpeaker(client, data.peerId);
    default:
      logger.warn(
        "NotificationHandler unknown method",
        notification.method,
        data
      );
  }
}
