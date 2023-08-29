<template>
  <Link
    rel="stylesheet"
    href="https://dgck81lnn.github.io/bootstrap-lnn/dist/bootstrap-lnn.min.css"
  />
  <Link
    rel="stylesheet"
    href="https://dgck81lnn.github.io/bootstrap-lnn/dist/bootstrap-vue-3-lnn.min.css"
  />
  <Link rel="canonical" href="https://dgck81lnn.github.io/xdi8-transcriber/" />
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
  <div
    class="text-bg-light border-top mt-5 p-4 pb-5 d-md-flex gap-5 justify-content-between align-items-end"
  >
    <aside>
      <h2 class="h4">更新记录</h2>
      <dl class="changelog mb-0">
        <dt>2023-08-29</dt>
        <dd>
          <ul>
            <li>字表更新至 2023-08-23 版。</li>
            <li>现在希顶转汉字模式可以识别曾经在字表中存在过但现已移除的历史希顶拼写，在汉字转希顶模式下也可以手动选用这类拼写。</li>
          </ul>
        </dd>
        <dt>2023-01-29</dt>
        <dd>
          <ul>
            <li>修复了希顶字体无法加载的问题。</li>
            <li>调整了页面布局：现在在窗口足够宽时，文本框会横向摆放。</li>
            <li>添加了更新记录。</li>
            <li>“字间分隔符”新增“空格”选项，且现在默认选中该选项。</li>
          </ul>
        </dd>
        <dt>2022-12-14</dt>
        <dd>
          <ul>
            <li>本工具发布。</li>
          </ul>
        </dd>
      </dl>
    </aside>
    <hr class="d-md-none">
    <footer class="text-md-end">
      <p>DGCK81LNN 制作</p>
      <p>〇改希顶语字表更新至 2023-08-23 版</p>
      <p class="d-flex flex-wrap gap-1 justify-content-md-end">
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
            src="https://img.shields.io/static/v1?label=npm&message=xdi8-transcriber&color=red&logo=npm"
            alt="npm: xdi8-transcriber"
          />
        </a>
      </p>
      <p class="d-flex flex-wrap gap-1 justify-content-md-end">
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
  </div>
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
body,
[lang] {
  --bs-font-sans-serif: "XEGOEPUAall", "Segoe UI", "思源黑体 CN",
    "Source Han CN", -apple-system, "Roboto", "微软雅黑", "Microsoft YaHei",
    system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  font-family: var(--bs-font-sans-serif);
}

.changelog {
  max-height: 50vh;
  padding: 0 0.5rem;
  overflow-y: auto;
  scrollbar-width: thin;
}
.changelog::-webkit-scrollbar {
  width: 0.5rem;
  background: #f1f1f1;
}
.changelog::-webkit-scrollbar-thumb {
  background: #c0c0c0;
}
.changelog::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
.changelog::-webkit-scrollbar-thumb:active {
  background: #787878;
}
</style>
