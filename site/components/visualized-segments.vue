<script setup lang="ts">
import type { TranscribedSegment } from "~/utils/transcribe"

export interface Props {
  id?: string
  value: TranscribedSegment[]
}
const props = defineProps<Props>()

const segments = computed(() =>
  props.value.map(seg => ({
    ...seg,
    x: chatToXdPUA(seg.x),
    xm: seg.xm ?? inferMainSyllablePosition(seg.x),
  })),
)
</script>

<template>
  <ruby
    :id="props.id"
    v-for="seg in segments"
    :class="[seg.legacy && 'legacy']"
    :title="seg.legacy ? '旧拼写' : undefined"
    :data-debug="JSON.stringify(seg)"
    >{{ seg.h }}<rp>(</rp
    ><rt v-if="seg.xm"
      >{{ seg.x.slice(0, seg.xm[0])
      }}<span class="mainsyllable">{{ seg.x.slice(...seg.xm) }}</span
      >{{ seg.x.slice(seg.xm[1]) }}</rt
    ><rt v-else>{{ seg.x }}</rt
    ><rp>)</rp></ruby
  >
</template>

<style scoped>
.legacy {
  color: red;
}
rt {
  vertical-align: 0.3em;
  color: #678;
}
.mainsyllable {
  color: black;
}
</style>
