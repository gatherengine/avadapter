import { Logger } from "./Logger";
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
