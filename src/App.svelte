<script lang="ts">
  import { VideoMirror } from "video-mirror";
  import { RoomClient } from "./RoomClient";

  let room = new RoomClient("wss://media2.relm.us:4443", { room: "test" });

  function join() {
    room.join();
  }
</script>

<main>
  <!-- <VideoMirror /> -->
  <VideoMirror on:done={join} />
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
