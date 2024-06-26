<script setup lang="ts">
import type { Alternations } from "~/utils/transcribe"

export interface Props {
  value: Alternations
}
const props = defineProps<Props>()

const isLegacyOnly = computed(() => {
  return !props.value[0].legacy && props.value.slice(1).every(alt => alt.legacy)
})

const el = ref<HTMLElement | null>(null)
const show = ref(false)

function select(i: number) {
  props.value.selectedIndex = i
  show.value = false
}
</script>

<template>
  <span
    :class="['selectable', isLegacyOnly && 'selectable-legacyonly']"
    tabindex="0"
    ref="el"
  >
    <VisualizedSegments
      :value="props.value[props.value.selectedIndex].content"
    />
  </span>
  <BPopover
    v-if="el"
    :target="el"
    placement="top"
    triggers="focus"
    customClass="selectable-popover"
  >
    <BListGroup flush>
      <BListGroupItem v-for="(alt, i) in props.value" button @click="select(i)">
        <div
          :class="[
            'd-flex',
            'selectable-option',
            alt.legacy && 'selectable-option-legacy',
            'align-items-center',
          ]"
        >
          <VisualizedSegments :value="alt.content" />
          <span
            v-if="alt.note"
            class="ms-2 text-body-secondary selectable-note"
            >{{ alt.note }}</span
          >
        </div>
      </BListGroupItem>
    </BListGroup>
  </BPopover>
</template>

<style>
.selectable {
  display: inline-block;
  background-color: #fec;
  font-family: inherit;
}
.selectable-legacyonly {
  background-color: #f2f2f2;
}
.selectable:hover {
  box-shadow: inset 0 0 0 9999px rgba(0, 0, 0, 0.05);
}
.selectable > ruby {
  cursor: pointer;
}
.selectable-popover {
  --bs-popover-max-width: calc(216px + 20vw);
}
.selectable-popover .popover-body {
  border-radius: calc(var(--bs-border-radius) + 0.5px);
  padding: 0px;
}
.selectable-option > ruby {
  font-size: 2rem;
  white-space: nowrap;
}
.selectable-note {
  font-size: 1rem;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
</style>
