<script lang="ts">
  import type { Writable } from "svelte/store";
  import Circle from "./Circle.svelte";

  export let peer: Writable<PeerData>;

  function getStream(consumers: Record<string, any>, kind: "audio" | "video") {
    return Object.values(consumers).find((consumer) => consumer.kind === kind)
      ?.stream;
  }
</script>

<Circle
  audioStream={getStream($peer.consumers, "audio")}
  videoStream={getStream($peer.consumers, "video")} />
