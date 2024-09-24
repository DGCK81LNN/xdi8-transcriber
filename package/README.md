# [xdi8-transcriber 〇改希顶转写器][site]

[![npm 包][npm-badge]][npm] [![GitHub Pages 构建状态][actions-badge]][actions]

**〇改[希顶语][xdi8]↔汉字**转写工具

- [X] 字表已更新至 240924 版
- [X] 兼容旧版字表
- [X] 自带多音字提示
- [X] 部分常见多音字读音自动推测

[启动转写器→][site]

引流(?)：[DGCK81LNN/fairfax_xdpua](https://github.com/DGCK81LNN/fairfax_xdpua) — Fairfax字体 希顶字母PUA编码版

![](https://github.com/DGCK81LNN/xdi8-transcriber/raw/main/images/snapshot.png)

[site]: https://dgck81lnn.github.io/xdi8-transcriber/
[npm]: https://npmjs.org/package/xdi8-transcriber
[npm-badge]: https://img.shields.io/npm/v/xdi8-transcriber?logo=npm
[actions]: https://github.com/DGCK81LNN/xdi8-transcriber/actions/workflows/pages.yml
[actions-badge]: https://img.shields.io/github/actions/workflow/status/DGCK81LNN/xdi8-transcriber/pages.yml?branch=main&logo=github-actions&logoColor=white
[xdi8]: https://wiki.xdi8.top/wiki/%E5%B8%8C%E9%A1%B6%E8%AF%AD

## 调用方法

Node:

~~~sh
npm install xdi8-transcriber
# 或
yarn add xdi8-transcriber
~~~

~~~js
const {
  HanziToXdi8Transcriber,
  Xdi8ToHanziTranscriber,
} = require("xdi8-transcriber")
// 或
import {
  HanziToXdi8Transcriber,
  Xdi8ToHanziTranscriber,
} from "xdi8-transcriber"

const h2x = new HanziToXdi8Transcriber()
const x2h = new Xdi8ToHanziTranscriber()
// ...
~~~

CDN：

~~~html
<script src="https://cdn.jsdelivr.net/npm/xdi8-transcriber"></script>
<script>
const h2x = new xdi8Transcriber.HanziToXdi8Transcriber()
const x2h = new xdi8Transcriber.Xdi8ToHanziTranscriber()
// ...
</script>

<!-- 或 -->

<script type="module">
import {
  HanziToXdi8Transcriber,
  Xdi8ToHanziTranscriber,
} from "https://cdn.jsdelivr.net/npm/xdi8-transcriber/lib/index.mjs"

const h2x = new HanziToXdi8Transcriber()
const x2h = new Xdi8ToHanziTranscriber()
// ...
</script>
~~~

<details><summary>示例（<code>HanziToXdi8Transcriber</code>）</summary>

~~~js
console.log(h2x.transcribe("曾侯乙编钟"));
// 输出：
[
  [
    {
      content: [ { h: '曾', x: 'D8H', v: 'D8H' } ],
      note: 'céng',
      exceptional: false,
      legacy: false
    },
    {
      content: [ { h: '曾', x: 'H3H', v: 'H3H' } ],
      note: 'zēng',
      exceptional: false,
      legacy: false
    }
  ],
  [
    {
      content: [ { h: '侯', x: 'hi6', v: 'hi6' } ],
      note: '',
      exceptional: false,
      legacy: false
    },
    {
      content: [ { h: '侯', x: 'Vhi6', v: 'Vhi6', legacy: true } ],
      note: '旧拼写',
      exceptional: true,
      legacy: true
    }
  ],
  { h: '乙', x: '5E', v: '5E' },
  { h: '编', x: 'abi2', v: 'abi2' },
  [
    {
      content: [ { h: '钟', x: '7iTN', v: '7iTN' } ],
      note: '“鐘”的简化字 打击乐器；计时的器具；指时间或时刻',
      exceptional: false,
      legacy: false
    },
    {
      content: [ { h: '钟', x: 'Nzu3', v: 'Nzu3' } ],
      note: '“鍾”的简化字 盛酒的器皿；（情感）集中、专注；姓氏',
      exceptional: false,
      legacy: false
    },
    {
      content: [ { h: '钟', x: 'Nz3', v: 'Nz3', legacy: true } ],
      note: '旧拼写',
      exceptional: true,
      legacy: true
    }
  ]
]
~~~

</details>

<details><summary>示例（<code>Xdi8ToHanziTranscriber</code>）</summary>

~~~js
console.log(x2h.transcribe("wo de Huajbia", { alphaFilter: null }));
// 输出：
[
  { h: '我', x: 'wo', v: '我' },
  ' ',
  { h: '的', x: 'de', v: '的' },
  ' ',
  [
    {
      content: [ { h: '挚', x: 'Huaj', v: '挚' }, { h: '友', x: 'bia', v: '友' } ],
      note: '',
      exceptional: false,
      legacy: false
    },
    {
      content: [ { h: '支', x: 'Hua', v: '支' }, { h: '发', x: 'jbia', v: '发' } ],
      note: 'jbia — “髪”的简化字 fà',
      exceptional: false,
      legacy: false
    },
    {
      content: [ { h: '支', x: 'Hua', v: '支' }, { h: '髪', x: 'jbia', v: '髪' } ],
      note: '',
      exceptional: true,
      legacy: false
    },
    {
      content: [ { h: '支', x: 'Hua', v: '支' }, { h: '髮', x: 'jbia', v: '髮' } ],
      note: '',
      exceptional: true,
      legacy: false
    }
  ]
]
~~~

</details>

### 通过 CDN 获取最新的字表

〇改希顶语字表可能经常需要更新，但某些情况下，可能并不适合直接更新 `xdi8-transcriber` 包。您可使用以下方法获取与当前包版本相兼容的最新字表数据：

 1. <code>GET https://<span></span>data.jsdelivr.com/v1/packages/npm/xdi8-transcriber/resolved?specifier=^<mark>当前包版本号（不包含前缀 v）</mark></code>

    jsDelivr 将返回一段 JSON 数据。取其根对象上的 `version` 字段，即为最新兼容的版本号。

 2. <code>GET https://<span></span>cdn.jsdelivr.net/npm/xdi8-transcriber@<mark>版本号</mark>/lib/data.json</code>

    即为字表数据 JSON，解析成对象后传递给转写器类的构造函数即可。

`xdi8-transcriber` 目前的主版本号为 0。因此，当 `xdi8-transcriber` 的***次***版本号提升（例如从 `0.2.3` 提升至 `0.3.0`）时，新版本会被认为与旧版本不兼容，此时则必须要将 `xdi8-transcriber` 包本身更新到新版本，才能更新到新的字表。

## API 参考

### 类型定义 `TranscribeResult`

~~~ts
type TranscribeResult = TranscribeResultSegment[]
type TranscribeResultSegment = string | TranscribedSegment | Alternation[]
~~~

转写器返回的结果为一个数组，其中每个元素可能是：

  * 字符串（无法转写的部分，如标点符号）；
  * [`Alternation`](#结构体-alternation) 数组（多种可选结果）或
  * [`TranscribedSegment`](#结构体-transcribedsegment)（成功转写的汉字-希顶词对）。

要将转写结果转为字符串，其中的 `TranscribedSegment` 元素取 `v`的值，`Alternation` 元素选择其中一种可能结果，取其 `content` 数组中各 `TranscribedSegment` 的 `v` 的总和。

在希顶转汉字时，若不指定 `ziSeparator` 分隔符，您可以考虑从结果数组中删去所有仅包含一个空格的字符串（`" "`），以免在输入文本中用空格分隔了希顶词的情况下，汉字之间出现多余的空格。

#### 示例

~~~js
let result = transcriber.transcribe(text)

if (transcriber instanceof AlphaToHanziTranscriber)
  result = result.filter(seg => seg !== " ")

const resultString = result.map(seg => {
  if (typeof seg === "string") return seg
  if (Array.isArray(seg)) return seg[0].content.map(seg => seg.v).join("")
  return seg.v
}).join("")
~~~

### 结构体 `TranscribedSegment`

~~~ts
interface TranscribedSegment {
  h: string
  x: string
  v: string
  legacy?: boolean
}
~~~

成功转写的汉字-希顶词对。`v` 为转写结果，将转写结果以文本形式表示时，只使用 `v` 的值即可。`h` 与 `x` 分别为汉字与其对应的希顶拼写，用于可视化结果中的汉字注音。若该字词使用旧拼写，`legacy` 为 `true`。

特殊地，汉字转希顶时，若指定了 `ziSeparator` 分隔符，则分隔符会以 `h`、`x` 都为空字符串、`v` 为实际分隔符的 `TranscribedSegment` 表示。

#### 示例

~~~js
console.log(x2hTranscriber.transcribe("FY"));
// 输出：
[ { x: 'FY', h: '玉', v: '玉' } ]
~~~

~~~js
console.log(h2xTranscriber.transcribe("爱情", { ziSeparator: "-" }));
// 输出：
[
  { h: '爱', x: '4YF', v: '4YF' },
  { h: '', x: '', v: '-' },
  { h: '情', x: 'Yq8', v: 'Yq8' }
]
~~~

### 结构体 `Alternation`

~~~ts
interface Alternation {
  content: TranscribedSegment[]
  note?: string
  exceptional?: boolean
  legacy?: boolean
}
~~~

当一个字词有多种可选的转写结果时，每种结果用一个 `Alternation` 表示。

#### 成员 `content`

该结果中的各汉字-希顶词对。

#### 成员 `note`

该结果的备注。

#### 成员 `exceptional`

该结果是否为一个“例外结果”。

汉转希时包含多音字的罕见（无法组词）拼写的结果、希转汉中包含汉字的非常用写法的结果，以及下述包含过时的希顶拼写的结果都被认为是“例外结果”。

目前，“例外”拼写在[字表数据](#结构体-data)中体现为对应的 `hh`（汉转希）或 `xh`（希转汉）属性为 `"-"`。

通常，希转汉时可以忽略“例外结果”。汉转希时“例外结果”的定义将来可能改动，目前不建议使用。

#### 成员 `legacy`

该结果是否包含过时的希顶拼写。

目前，过时拼写在[字表数据](#结构体-data)中体现为 `hh` 和 `xh` 属性都为 `"-"`，同时注释中注明“旧拼写”。

### 类 `HanziToXdi8Transcriber`、 `HanziToAlphaTranscriber`

~~~ts
class HanziToXdi8Transcriber extends HanziToAlphaTranscriber
class HanziToAlphaTranscriber implements Transcriber
~~~

汉字转希顶转写器。

`HanziToXdi8Transcriber` 包装了 `HanziToAlphaTranscriber`，将构造函数参数 `data` 的默认值设为了本模块所导出的 [`data`](#常量-data)。

#### 构造函数

~~~ts
new HanziToXdi8Transcriber(data?: Data)
new HanziToAlphaTranscriber(data: Data)
~~~

##### 参数 `data`

字表数据（[`data`](#常量-data)）。

#### 方法 `transcribe`

~~~ts
function transcribe(input: string, options?: {
  ziSeparator?: string
}): TranscribeResult
~~~

将汉字转写为希顶，以 [`TranscribeResult`](#类型定义-transcriberesult) 形式返回。

##### 选项 `options.ziSeparator`

相邻汉字之间使用的分隔符。默认为空字符串。推荐设置为空格（`" "`）。

### 类 `Xdi8ToHanziTranscriber`、 `AlphaToHanziTranscriber`

~~~ts
class Xdi8ToHanziTranscriber extends AlphaToHanziTranscriber
class AlphaToHanziTranscriber implements Transcriber
~~~

希顶转汉字转写器。

`Xdi8ToHanziTranscriber` 包装了 `AlphaToHanziTranscriber`，将构造函数参数 `data` 的默认值设为了本模块所导出的 [`data`](#常量-data)，并将 `transcribe` 方法中选项 `options.alphaFilter` 的默认值设为了 [`chatToXdPUA`](#函数-chattoxdpua)。

#### 构造函数

~~~ts
new Xdi8ToHanziTranscriber(data?: Data)
new AlphaToHanziTranscriber(data: Data)
~~~

##### 参数 `data`

字表数据（[`data`](#常量-data)）。

#### 方法 `transcribe`

~~~ts
function transcribe(input: string, options?: {
  ziSeparator?: string
  alphaFilter?: (x: string) => string
}): TranscribeResult
~~~

将希顶转写为汉字，以 [`TranscribeResult`](#类型定义-transcriberesult) 形式返回。

##### 选项 `options.ziSeparator`

相邻汉字之间的分隔符。设置为空字符串时，转写器会尝试自动分词；不为空时，转写器将***不会***自动分词，将连续的字母串统统视为单个希顶词，但会在把希顶词转写成汉字后，自动删去字词之间的分隔符。

默认为空字符串。

##### 选项 `options.alphaFilter`

若指定，当某个字词出现多个可选结果，选项的注释中出现希顶语时，会使用此函数将聊天字母转换为其他表示方法。在包装类 `Xdi8ToHanziTranscriber` 中默认为 [`chatToXdPUA`](#函数-chattoxdpua)，即转换为希顶字母 PUA 编码；如需保持聊天字母输出，设为 `null` 即可。

### 常量 `data`

~~~ts
const data: Data
~~~

内置字表数据。

### 结构体 `Data`

~~~ts
interface Data {
  dict: DictEntry[]
  subst: Record<string, string>
}
interface DictEntry {
  h: string
  x: string
  n?: string
  hh?: string
  xh?: "-"
}
~~~

#### 成员 `dict`

字表的每一行为一个元素。`n`、`hh`、`xh` 只有多音字或一希对多汉的情况下才需要存在。属性含义如下：

  * `h`：汉字

  * `x`：希顶拼写

  * `n`：注释

  * `hh`：汉希提示

    多音字或修改过拼写的汉字使用。为该字该拼写的一系列组词，用空格分隔，本字用“`~`”代替；或为 `"-"`，表示该字的该拼写无法组词。用于推测多音字的读音。

    汉转希时，若一汉字有多个拼写，会按以下顺序排列：

      * 组词符合当前语境的拼写；
      * 没有汉希提示的拼写；
      * 汉希提示中存在组词，但与当前语境不符的拼写；
      * 汉希提示为 `"-"`，但非过时的拼写；
      * 过时拼写。

  * `xh`：希汉提示

    一希对多汉时使用。此属性为 `"-"` 时，表示当前行是该汉字的非常用写法。

    希转汉时，若一希顶词有多个对应汉字结果，会按照以下顺序排列：

      * 其中所有汉字都没有希汉提示的结果；
      * 其中至少一个汉字的希汉提示为 `"-"`，但不包含过时拼写的结果；
      * 包含过时拼写的结果。

目前，汉希提示与希汉提示均为 `"-"` 表示该汉字的该拼写为过时拼写。

#### 成员 `subst`

指定一系列字符串替换规则。汉字转希顶时，会根据这些规则对文本进行预处理。

在默认数据中指定的是将拆开表示的“纟火”、“糹火”替换为相对应的希顶字母 PUA 编码码位。这样做是因为 [`HanziToAlphaTranscriber`](#类-hanzitoxdi8transcriber-hanzitoalphatranscriber) 的设计要求单个汉字只能用单个 Unicode 代码点表示。

~~~json
{
  "纟火": "\ue106",
  "糹火": "\ue107",
  "\u2eb0火": "\ue106",
  "\u2eaf火": "\ue107"
}
~~~

### 函数 `chatToXdPUA`

~~~ts
function chatToXdPUA(text: string): string
~~~

将聊天字母转换为希顶字母 PUA 编码。暂不支持扩充字母。

### 函数 `xdPUAToChat`

~~~ts
function xdPUAToChat(text: string): string
~~~

将希顶字母 PUA 编码转换为聊天字母。暂不支持扩充字母。

### 接口 `Transcriber`

~~~ts
interface Transcriber {
  transcribe(input: string, ...args: unknown[]): TranscribeResult
}
~~~

具有 `transcribe` 方法，其接受字符串作为第一个参数、返回 `TranscribeResult` 的类型。本模块中的各转写器类都实现该接口。

## 维护

新字表发布时：

 1. 将字表保存到 <code>data/希顶字表<var>xxxxx</var>.xlsx</code>，执行 <code>py tools/totsv.py data/希顶字表<var>xxxxx</var>.xlsx</code> 将其转换为 TSV。

 2. 执行 <code>ruby tools/sort.rb data/<var>xxxxxx</var>.tsv</code>，统一字表数据的排序（希顶拼写按希顶字母表顺序简单排序，相同的按汉字 Unicode 码位排序）。

 3. 在 `data` 目录中，执行 `node ../tools/append.mjs dict.tsv`：此过程可能会移除部分条目的汉希提示，程序会输出相应的提示，在下一步中可能需要将其补回到适当位置。

 4. 检查 `data/dict.tsv` 的 `git diff`，补充缺少的注释、提示（如新增多音字时，填写各读音的释义或对应普通话读音等）。

      * 使用 `tools/dictgitdiff.sh data/dict.tsv` 可省略 diff 中多余的上下文。当标准输出为控制台时，该脚本会自动使用环境中的 <code>python -m [pygments](https://pygments.org/)</code> 或 [`rougify`](https://rouge.jneen.net/) 为 diff 添加颜色。

 5. 如果在注释中使用了数字表示拼音声调的写法（如 `pin1 yin1`），执行 `ruby tools/pinyin.rb data/dict.tsv data/dict.tsv`，将其转换为声调标号。

 6. 执行 `node tools/xhhint.js`，自动补充一些希汉提示（进行此操作前建议先 `git add` `data/dict.tsv` 以便检查）。

 7. 更新 README 和 `site/app.vue` 中注明的字表版本以及更新记录。

 8. 修改 `package/package.json` 中的包版本号，执行 `npm run build:package` 或其他合适的构建指令，为新的版本号创建 Git 标签，发布包更新。
