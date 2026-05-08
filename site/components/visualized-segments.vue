<script setup lang="ts">
import type { TranscribedSegment } from "~/utils/transcribe"

export interface Props {
  id?: string
  value: TranscribedSegment[]
  rainbow?: boolean
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
    :class="[seg.legacy && 'legacy', props.rainbow && 'rainbow']"
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
.mainsyllable,
.rainbow rt {
  color: black;
}
.rainbow .mainsyllable {
  animation: 炫彩 2s linear infinite;
}
@keyframes 炫彩 {
  0% {
    color: red;
  }
  16.67% {
    color: yellow;
  }
  33.33% {
    color: lime;
  }
  50% {
    color: cyan;
  }
  66.67% {
    color: blue;
  }
  83.33% {
    color: magenta;
  }
  100% {
    color: red;
  }
}
</style>
