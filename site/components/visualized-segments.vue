<script setup lang="ts">
import type { TranscribedSegment } from "~/utils/transcribe"

export interface Props {
  id?: string
  value: TranscribedSegment[]
}
const props = defineProps<Props>()
</script>

<template>
  <ruby :id="props.id"
    ><template v-for="seg in props.value"
      >{{ seg.h }}<rp>(</rp><rt>{{ seg.x }}</rt
      ><rp>)</rp></template
    ></ruby
  >
</template>
