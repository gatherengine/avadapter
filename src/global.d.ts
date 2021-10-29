/// <reference types="svelte" />

type RequestAcceptFunction = (data?: ProtooResponse) => void;
type RequestRejectFunction = (
  error?: Error | number,
  errorReason?: string
) => void;

type PeerData = {
  id: string;
  consumers: Record<string, any>;
};

type AppParticipant = {
  id: string;
  resources: Record<string, AVResource>;
};
