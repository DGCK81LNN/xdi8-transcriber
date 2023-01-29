<template>
  <BButtonToolbar class="mb-1">
    <BInputGroup class="me-1">
      <BFormSelect
        class="format-select"
        title="输入类型"
        v-model="sourceFmt"
        :options="exclude(options, targetFmt)"
        :disabled="showOverlay"
        @input="go()"
      />
    </BInputGroup>
    <BButton
      class="me-1"
      title="互换输入和输出类型"
      :disabled="showOverlay"
      @click="exchangeSourceAndTarget()"
    >
      &lrarr;
    </BButton>
    <BInputGroup class="me-1">
      <BFormSelect
        class="format-select"
        title="输出类型"
        v-model="targetFmt"
        :options="exclude(options, sourceFmt)"
        :disabled="showOverlay"
        @input="go()"
      />
    </BInputGroup>
    <BInputGroup
      class="me-1"
      v-show="sourceFmt === 'hanzi' || targetFmt === 'hanzi'"
    >
      <BInputGroupPrepend isText>字间分隔符</BInputGroupPrepend>
      <BFormSelect
        v-model="ziSep"
        :options="[{ text: '无', value: '' }, '-', '_']"
        :disabled="showOverlay"
        @input="go()"
      />
    </BInputGroup>
  </BButtonToolbar>
  <div class="mb-2 d-flex flex-column flex-md-row gap-1">
    <BFormTextarea
      class="textarea"
      v-model="input"
      :placeholder="inPlaceholders[sourceFmt](ziSep)"
      title="输入"
      :disabled="showOverlay"
      @input="go()"
    />
    <BFormTextarea
      class="textarea"
      readonly
      :value="plainResult"
      :placeholder="outPlaceholders[targetFmt](ziSep)"
      title="输出"
      :disabled="showOverlay"
    />
  </div>
  <div class="visual">
    <VisualizedResult v-if="Array.isArray(result)" :value="result" />
  </div>
</template>

<style scoped>
.format-select {
  width: 12em;
}
.textarea {
  height: 30vw;
  resize: none;
}
.visual {
  min-height: 25vh;
}
</style>

<script setup lang="ts">
import type { Format, VisualResult } from "utils/transcribe"

const options: { text: string; value: Format }[] = [
  { text: "汉字", value: "hanzi" },
  { text: "希顶聊天字母", value: "chat" },
  { text: "希顶字母 PUA 编码", value: "xdpua" },
]

const inPlaceholders: Record<Format, (ziSep: string) => string> = {
  chat: s => `c3q${s}rAH yL qzu2${s}xo de wi8${s}b8`,
  xdpua: s => `${s}  ${s}  ${s}`,
  hanzi: _ => `输入 要 转写 的 文本`,
}
const outPlaceholders: Record<Format, (ziSep: string) => string> = {
  chat: s => `qzu2${s}8fY jea${s}gio`,
  xdpua: s => `${s} ${s}`,
  hanzi: _ => `转换 结果`,
}

function exclude<T>(arr: { value: T }[], val: T) {
  return arr.filter(({ value }) => value !== val)
}

const showOverlay = ref(true)
onMounted(() => {
  showOverlay.value = false
})

const input = ref("")
const sourceFmt = ref<Format>("hanzi")
const targetFmt = ref<Format>("chat")
const ziSep = ref("")
const result = ref<VisualResult>()
const plainResult = computed(() => result.value && toPlainResult(result.value))

function exchangeSourceAndTarget() {
  ;[sourceFmt.value, targetFmt.value] = [targetFmt.value, sourceFmt.value]
  go()
}

function go() {
  try {
    result.value = transcribe(input.value, sourceFmt.value, targetFmt.value, {
      ziSeparator: ziSep.value,
    })
  } catch (e) {
    result.value = String(e)
    console.error(e)
  }
}
</script>
