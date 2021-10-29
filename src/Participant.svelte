<script lang="ts">
  import { setContext, getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import type { AVResource } from "./AVAdapter";
  import Circle from "./Circle.svelte";

  export let participant: Writable<AppParticipant>;

  function streamId(resource: AVResource) {
    return `stream-${resource.track.id}`;
  }

  function getStream(
    resources: Record<string, AVResource>,
    kind: "audio" | "video"
  ) {
    console.log("getStream resources", resources);
    const resource: AVResource = Object.values(resources).find(
      (resource) => resource.kind === kind
    );
    if (resource) {
      let stream: MediaStream = getContext(streamId(resource));
      if (!stream) {
        stream = new MediaStream();
        console.log("resource", resource);
        stream.addTrack(resource.track);
        setContext(streamId(resource), stream);
      }
      return stream;
    }
  }
</script>

<Circle
  audioStream={getStream($participant.resources, "audio")}
  videoStream={getStream($participant.resources, "video")}
/>
