## 升级目标
- 将网站定位为：把核心设计原则转译为 AI 可执行的提示词与风格规范，服务独立开发/产品/工程师。
- 内容结构升级为可执行的 Prompt 化操作系统，并完善 `designprompt.vercel.app` 的部署与基础 SEO/缓存/安全配置。

## 信息架构与文案调整
- 首页 Hero：替换标题/副标题为你提供的定位文案与英文一句话品牌定位。
- 导航改为：`设计原则`、`原则 → Prompt 模板`、`AI-Ready 规范`、`Prompt 库`、`风格模板`。

## 页面结构改动（index.html）
1. Hero 升级（index.html:10-15 附近）
- 标题：`把设计原则转换成 AI 可执行的提示词，让任何人都能让 AI 产出专业级 UI。`
- 英文副标：`A design prompt system that turns core design principles into AI-ready style rules.`
- 添加 CTA：`复制示例 Prompt`（锚点跳转到 Prompt 库）。

2. 原则 → Prompt 翻译模板（新增 section `#prompt-templates`）
- 每条原则结构：
  - 简述（压缩版）
  - Prompt Style 模板（列表化约束点）
  - 变量（如 spacing-scale, contrast-level）
  - 用法规则（简短操作指南）
  - 示例输出（可复制的 Prompt 片段）
- 示例条目（Hierarchy）：
```
Use clear visual hierarchy by:
- Strong weight contrast
- Clear spacing groups
- Single focal point per view
- Progressive disclosure
Variables:
- contrast-level: high|medium
- spacing-scale: 8px-grid
- focal-point: primary-action
```

3. AI-Ready Spec（新增 section `#ai-ready-spec`）
- 以“提示词约束形式”整理：Spacing / Typography / Layout / Color / Components rules / Interaction patterns。
- 每项采用“约束清单 + 可复制 Prompt 参数块”呈现，例如：
```
Spacing Spec:
- Base unit: 8px-grid
- Container padding: responsive
- Component gaps: sm|md|lg
Prompt params:
spacing-base=8px-grid; container-padding=responsive; gap=md
```

4. Prompt 库（新增 section `#prompt-library`）
- 提供直接可复制的完整 Prompt：
  - `整洁风 UI 完整 Prompt`
  - `高对比度、可读性强的 UI Prompt`
  - `移动端优先布局 Prompt`
  - `渐进曝光式交互 Prompt`
- 每个条目附“复制”按钮（前端实现剪贴板）。

5. 风格系统模板（新增 section `#style-templates`）
- 提供风格化模板：Minimal / Neo-brutalism / Dashboard。
- 结构：描述 + Prompt 模板 + 可调整变量（如 color-mode, radius-scale, shadow-density）。

## 样式与交互改动
- `styles.css`：新增版式与代码块样式、复制按钮样式；保持现有设计令牌体系与响应式规则。
- `script.js`：新增复制按钮逻辑；保留现有滚动与入场动画，不引入外部库。

## Vercel 配置调整（vercel.json）
1. 修正 SPA 重写：仅对“无扩展名”路径重写至 `index.html`，避免误伤静态资源。
```
{
  "rewrites": [
    { "source": "/((?!.*\\.).*)", "destination": "/index.html" }
  ]
}
```
2. 添加响应头（缓存与安全）：
```
{
  "headers": [
    { "source": "/index.html", "headers": [ { "key": "Cache-Control", "value": "no-cache" } ] },
    { "source": "/(.*)\\.(css|js)", "headers": [ { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] },
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "interest-cohort=()" },
      { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
    ] }
  ]
}
```
3. SEO：在 `<head>` 添加 canonical 与 OG/Twitter 标签，指向 `https://designprompt.vercel.app`。

## 验证清单
- 访问 `https://designprompt.vercel.app/styles.css` 与 `script.js` 返回资源而非 HTML。
- 响应头：HTML 无缓存；CSS/JS 长缓存。
- 页面 `<head>` 有 canonical/OG 标签；复制按钮工作正常。
- 导航与新内容结构在移动端/桌面端均正常显示。

## 实施与范围
- 仅修改 `index.html`、`styles.css`、`script.js`、`vercel.json`；不创建新后端或改平台设置。
- 不引入新依赖与第三方库；遵循现有代码风格。

请确认是否按此升级方案执行；确认后我将开始具体代码改造与配置更新。