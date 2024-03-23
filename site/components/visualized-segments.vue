<script setup lang="ts">
import type { TranscribedSegment } from "~/utils/transcribe"

export interface Props {
  id?: string
  value: TranscribedSegment[]
}
const props = defineProps<Props>()
</script>

<template>
  <ruby
    :id="props.id"
    v-for="seg in props.value"
    :class="[seg.legacy && 'legacy']"
    :title="seg.legacy ? '旧拼写' : undefined"
    >{{ seg.h }}<rp>(</rp><rt>{{ seg.x }}</rt
    ><rp>)</rp></ruby
  >
</template>

<style>
.legacy {
  color: red;
}
</style>
