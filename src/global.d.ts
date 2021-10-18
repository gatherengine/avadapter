/// <reference types="svelte" />

type RequestAcceptFunction = (data?: ProtooResponse) => void;
type RequestRejectFunction = (
  error?: Error | number,
  errorReason?: string
) => void;
