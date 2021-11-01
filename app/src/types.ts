import type { AVResource } from "avadapter";

export type PeerData = {
  id: string;
  consumers: Record<string, any>;
};

export type AppParticipant = {
  id: string;
  resources: Record<string, AVResource>;
};
