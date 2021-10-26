import { Logger } from "./Logger";
import { parseScalabilityMode } from "mediasoup-client";
import type { ProtooRequest, ProtooResponse } from "protoo-client";
import type { RoomClient } from "./RoomClient";

async function newConsumer(
  room: RoomClient,
  accept: RequestAcceptFunction,
  reject: RequestRejectFunction,
  peerId,
  producerId,
  id,
  kind,
  rtpParameters,
  type,
  appData,
  producerPaused
) {
  const consumer = await room.recvTransport.consume({
    id,
    producerId,
    kind,
    rtpParameters,
    appData: { ...appData, peerId }, // Trick.
  });

  try {
    room.consumers.set(consumer.id, consumer);

    consumer.on("transportclose", () => {
      logger.debug("consumer transportclosed", consumer.id);
      this.consumers.delete(consumer.id);
    });

    const { spatialLayers, temporalLayers } = parseScalabilityMode(
      consumer.rtpParameters.encodings[0].scalabilityMode
    );

    room.emit("consumer-added", {
      id: consumer.id,
      type: type,
      locallyPaused: false,
      remotelyPaused: producerPaused,
      rtpParameters: consumer.rtpParameters,
      spatialLayers: spatialLayers,
      temporalLayers: temporalLayers,
      preferredSpatialLayer: spatialLayers - 1,
      preferredTemporalLayer: temporalLayers - 1,
      priority: 1,
      codec: consumer.rtpParameters.codecs[0].mimeType.split("/")[1],
      track: consumer.track,
    });
  } catch (err) {
    logger.error("rejecting consumer: %s", err);
    reject();
    return;
  }

  // We are ready. Answer the protoo request so the server will
  // resume this Consumer (which was paused for now if video).
  accept();
}

const logger = new Logger("NotificationHandler");
export async function dispatchRequest(
  room: RoomClient,
  request: ProtooRequest,
  accept: RequestAcceptFunction,
  reject: RequestRejectFunction
) {
  const data = request.data;

  // debug: show all notifications
  logger.debug("RequestHandler request", request);

  switch (request.method) {
    case "newConsumer":
      return await newConsumer(
        room,
        accept,
        reject,
        data.peerId,
        data.producerId,
        data.id,
        data.kind,
        data.rtpParameters,
        data.type,
        data.appData,
        data.producerPaused
      );
    case "newDataConsumer":
      // For now, we don't support data channels
      reject(403, "I do not want DataChannels");
      break;
    default:
      logger.warn("RequestHandler unknown method", request.method, data);
  }
}
