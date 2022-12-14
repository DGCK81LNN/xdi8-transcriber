<template>
  <Link
    rel="stylesheet"
    href="https://dgck81lnn.github.io/bootstrap-lnn/dist/bootstrap-lnn.min.css"
  />
  <Link
    rel="stylesheet"
    href="https://dgck81lnn.github.io/bootstrap-lnn/dist/bootstrap-vue-3-lnn.min.css"
  />
  <main class="m-2">
    <ClientOnly>
      <template #placeholder>
        <div class="float-end d-flex align-items-center">
          初始化……
          <BSpinner variant="primary" class="ms-2" />
        </div>
      </template>
    </ClientOnly>
    <h1>
      〇改希顶转写器
      <span class="text-muted h6">by DGCK81LNN</span>
    </h1>
    <Transcriber />
  </main>
  <footer
    class="text-bg-light border-top mt-5 p-4 pb-5 d-flex flex-column align-items-center"
  >
    <p>基于〇改希顶语字表 2022-12-06 版</p>
    <p class="d-flex flex-wrap gap-1">
      <a
        href="https://github.com/DGCK81LNN/xdi8-transcriber"
        title="本项目的 GitHub 仓库"
      >
        <img
          src="https://img.shields.io/static/v1?label=GitHub&message=DGCK81LNN/xdi8-transcriber&color=lightgrey&logo=github"
          alt="GitHub: DGCK81LNN/xdi8-transcriber"
        />
      </a>
      <a
        href="https://npmjs.org/package/xdi8-transcriber"
        title="本项目的 npm 包"
      >
        <img
          src="https://img.shields.io/static/v1?label=npm&message=xdi8-transcrber&color=red&logo=npm"
          alt="npm: xdi8-transcriber"
        />
      </a>
    </p>
    <p class="d-flex flex-wrap gap-1">
      <a
        href="https://wiki.xdi8.top/wiki/User:DGCK81LNN"
        title="我在希顶维基的用户页"
      >
        <img
          src="https://img.shields.io/static/v1?label=希顶维基&message=用户:DGCK81LNN&color=orange"
          alt="希顶维基: 用户:DGCK81LNN"
        />
      </a>
      <a href="https://github.com/DGCK81LNN" title="我的 GitHub 个人资料">
        <img
          src="https://img.shields.io/static/v1?label=GitHub&message=DGCK81LNN&color=lightgrey&logo=github"
          alt="GitHub: DGCK81LNN"
        />
      </a>
    </p>
  </footer>
</template>

<script setup lang="ts">
import { BSpinner } from "bootstrap-vue-3"

const siteName = "〇改希顶转写器"
useHead({
  titleTemplate: titleChunk => {
    return titleChunk ? `${titleChunk} - ${siteName}` : siteName
  },
})
</script>

<style>
@font-face {
  font-family: "XEGOEPUAall";
  /* 原作者保留权利 */
  src: url("https://wiki.xdi8.top/w/resources/assets/XEGOEPUAall%20Regular.ttf")
    format("truetype");
}
body,
[lang] {
  --bs-font-sans-serif: "XEGOEPUAall", "Segoe UI", "思源黑体 CN",
    "Source Han CN", -apple-system, "Roboto", "微软雅黑", "Microsoft YaHei",
    system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  font-family: var(--bs-font-sans-serif);
}
</style>
