import { TypedEmitter } from "tiny-typed-emitter";
import type { BandwidthEstimate, MSPeer } from "./mediasoup/types";
import type {
  AVParticipant,
  AVResource,
  ConnectOptions,
  ConnectStatus,
  TrackStore,
} from "./types";

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

  async connect(
    localAudioTrackStore: TrackStore,
    localVideoTrackStore: TrackStore,
    options: ConnectOptions
  ) {}

  enableMic() {}
  disableMic(pause: boolean = false) {}

  enableCam() {}
  disableCam(pause: boolean = false) {}

  enableShare() {}
  disableShare(pause: boolean = false) {}
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
