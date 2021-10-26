<script lang="ts">
  import { get, writable, Writable } from "svelte/store";
  import { VideoMirror } from "video-mirror";
  import { RoomClient } from "./RoomClient";
  import Peer from "./Peer.svelte";

  type PeerData = {
    id: string;
    consumers: Record<string, any>;
  };

  const peers: Writable<Record<string, Writable<PeerData>>> = writable({});

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
  }
</script>

<main>
  <!-- <VideoMirror /> -->
  <VideoMirror on:done={join} />
  {#each Object.values($peers) as peer}
    <Peer {peer} />
  {/each}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
