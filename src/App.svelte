<script lang="ts">
  import { get, writable, Writable } from "svelte/store";
  import { VideoMirror, localStream } from "video-mirror";
  import { MediaSoupAVAdapter } from "./AVAdapter";
  import Participant from "./Participant.svelte";
  import Circle from "./Circle.svelte";

  const av = new MediaSoupAVAdapter({ origin: "wss://media2.relm.us:4443" });
  const participants: Writable<Record<string, Writable<AppParticipant>>> =
    writable({});

  let showMirror = true;

  av.on("participant-added", (participant) => {
    console.log("participant-added", participant);
    participants.update((record) => {
      return {
        ...record,
        [participant.id]: writable({
          id: participant.id,
          resources: {},
        }),
      };
    });
  });

  av.on("participant-removed", (participantId) => {
    console.log("participant-removed", participantId);
    participants.update((record) => {
      const { [participantId]: removedPeer, ...peers } = record;
      return peers;
    });
  });

  av.on("resource-added", (resource) => {
    const participantStore = $participants[resource.participantId];
    console.log("resource-added", resource, get(participantStore));
    participantStore.update((record) => {
      return {
        ...record,
        resources: { ...record.resources, [resource.id]: resource },
      };
    });
  });

  function join() {
    av.connect({ roomId: "test-room" });
    showMirror = false;
  }
</script>

{#if showMirror}
  <main>
    <VideoMirror on:done={join} />
  </main>
{:else}
  <div class="grid">
    <Circle audioStream={$localStream} videoStream={$localStream} isMe={true} />
    {#each Object.values($participants) as participant}
      <Participant {participant} />
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
