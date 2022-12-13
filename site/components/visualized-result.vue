<script setup lang="ts">
import type { VisualResultSegment } from "utils/transcribe"

export interface Props {
  value: VisualResultSegment[]
}
const props = defineProps<Props>()
</script>

<template>
  <div class="visual-result">
    <template v-for="segment in props.value">
      <VisualizedAlternations v-if="Array.isArray(segment)" :value="segment" />
      <VisualizedSegments
        v-else-if="typeof segment === 'object'"
        :value="[segment]"
      />
      <template v-else>{{ segment }}</template>
    </template>
  </div>
</template>

<style>
.visual-result {
  font-size: 2rem;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  user-select: none;
}
</style>
