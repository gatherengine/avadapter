<script lang="ts">
  import { Audio, Video } from "video-mirror";

  export let audioStream: MediaStream;
  export let videoStream: MediaStream;
  export let mirror: boolean = false;
</script>

<div class="circle">
  {#if audioStream}<Audio stream={audioStream} />{/if}
  {#if videoStream}<Video stream={videoStream} {mirror} visible={true} />{/if}
</div>

<style>
  .circle {
    width: min(33.33vw, 33.33vh);
    height: min(33.33vw, 33.33vh);
    border-radius: 100%;
    overflow: hidden;
  }
</style>
