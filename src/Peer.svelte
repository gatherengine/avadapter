<script lang="ts">
  import { Audio, Video } from "video-mirror";
  import type { Writable } from "svelte/store";

  export let peer: Writable<PeerData>;

  type PeerData = {
    id: string;
    consumers: Record<string, any>;
  };
</script>

<div><em>Peer</em></div>
{$peer.id}
{#each Object.values($peer.consumers) as consumer}
  {#if consumer.kind === "audio"}<Audio stream={consumer.stream} />{/if}
  {#if consumer.kind === "video"}<Video stream={consumer.stream} />{/if}
{/each}
