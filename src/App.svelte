<script lang="ts">
  import { get, writable, Writable } from "svelte/store";
  import { VideoMirror, localStream } from "video-mirror";
  import { RoomClient } from "./RoomClient";
  import Peer from "./Peer.svelte";
  import Circle from "./Circle.svelte";

  const peers: Writable<Record<string, Writable<PeerData>>> = writable({});

  let showMirror = true;
  let room = new RoomClient("wss://media2.relm.us:4443", { room: "test" });

  room.on("peer-added", (peer) => {
    console.log("peer-added", peer);
    peers.update((record) => {
      return {
        ...record,
        [peer.id]: writable({
          id: peer.id,
          consumers: {},
        }),
      };
    });
  });

  room.on("peer-removed", (peerId) => {
    console.log("peer-removed", peerId);
    peers.update((record) => {
      const { [peerId]: removedPeer, ...peers } = record;
      return peers;
    });
  });

  room.on("consumer-added", (data) => {
    console.log("consumer-added", data, get($peers[data.peerId]));
    $peers[data.peerId].update((record) => {
      return { ...record, consumers: { ...record.consumers, [data.id]: data } };
    });
  });

  function join() {
    room.join();
    showMirror = false;
  }
</script>

{#if showMirror}
  <main>
    <VideoMirror on:done={join} />
  </main>
{:else}
  <div class="grid">
    <Circle
      audioStream={$localStream}
      videoStream={$localStream}
      mirror={true} />
    {#each Object.values($peers) as peer}
      <Peer {peer} />
    {/each}
  </div>
{/if}

<style>
  main {
    display: flex;
    padding: 1em;
    max-width: 240px;
    margin: auto;
    justify-content: center;
  }
  .grid {
    display: flex;
    flex-wrap: wrap;
    margin: auto;
    width: min(100vh, 100vw);
    justify-content: center;
  }
  .grid > :global(*) {
    margin: 16px;
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
