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
        <dt>2024-09-24</dt>
        <dd>
          <ul>
            <li>字表更新至 240924 版。</li>
          </ul>
        </dd>
        <dt>2024-06-05</dt>
        <dd>
          <ul>
            <li>字表更新至 240604 版。</li>
          </ul>
        </dd>
        <dt>2024-04-05</dt>
        <dd>
          <ul>
            <li>字表更新至 240405 版。</li>
          </ul>
        </dd>
        <dt>2024-03-23</dt>
        <dd>
          <ul>
            <li>现在，可视化结果中使用旧拼写的字词会被标红。</li>
          </ul>
        </dd>
        <dt>2024-03-19</dt>
        <dd>
          <ul>
            <li>字表更新至 240319 版。</li>
          </ul>
        </dd>
        <dt>2024-02-06</dt>
        <dd>
          <ul>
            <li>字表更新至 240206 版。</li>
          </ul>
        </dd>
        <dt>2024-02-05</dt>
        <dd>
          <ul>
            <li>字表更新至 240205 版。</li>
          </ul>
        </dd>
        <dt>2024-02-04</dt>
        <dd>
          <ul>
            <li>字表更新至 240204 版。</li>
          </ul>
        </dd>
        <dt>2024-01-08</dt>
        <dd>
          <ul>
            <li>
              简化无分隔符希转汉时的显示效果：
              <ul>
                <li>叠词不会再出现不同汉字混搭的结果；</li>
                <li>候选结果的注释中不会再出现重复项；</li>
                <li>单字存在多个候选结果时，注释中不再重复其希顶拼写。</li>
              </ul>
            </li>
          </ul>
        </dd>
        <dt>2024-01-02</dt>
        <dd>
          <ul>
            <li>字表 240102 版发布，实际内容相比 231116 版无变化。</li>
          </ul>
        </dd>
        <dt>2023-11-16</dt>
        <dd>
          <ul>
            <li>字表 231116 版发布，实际内容相比 231021 版无变化。</li>
          </ul>
        </dd>
        <dt>2023-11-09</dt>
        <dd>
          <ul>
            <li>添加了访问量统计。在此之前的访问量未被计入。</li>
          </ul>
        </dd>
        <dt>2023-11-02</dt>
        <dd>
          <ul>
            <li>字表更新至 231021 版。</li>
            <li>
              现在在选择一个字词的不同转换结果时，涉及已移除历史拼写的结果会显示成灰色；若除去首选结果外，其余结果均涉及旧拼写，则整个字词会用灰色底纹而不是橙色底纹标出，以便区分和减少干扰。
            </li>
          </ul>
        </dd>
        <dt>2023-08-29</dt>
        <dd>
          <ul>
            <li>字表更新至 230823 版。</li>
            <li>
              现在希顶转汉字模式可以识别曾经在字表中存在过但现已移除的历史希顶拼写，在汉字转希顶模式下也可以手动选用这类拼写。
            </li>
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
    <hr class="d-md-none" />
    <footer class="text-md-end">
      <p>DGCK81LNN 制作</p>
      <p>〇改希顶语字表更新至 240604 版</p>
      <p>
        <span id="busuanzi_container_page_pv" style="display: none">
          本页面已被访问 <span id="busuanzi_value_page_pv"></span> 次
        </span>
      </p>
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
const siteName = "〇改希顶转写器"
useHead({
  titleTemplate: titleChunk => {
    return titleChunk ? `${titleChunk} - ${siteName}` : siteName
  },
  script: [
    {
      src: "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js",
      defer: true,
    },
  ],
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
