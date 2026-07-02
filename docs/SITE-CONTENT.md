# Rose Profile — 全站内容编辑文档

> **怎么用：** 直接在本文件里改文案。改好后把文档发给我，我会同步到网站代码（主要是 `src/content/site.ts`，以及少数写在组件里的标题）。
>
> **不要改：** 以 `<!-- 固定 -->` 或 `路径:` 标注的技术字段（图片路径、链接 id 等），除非你明确要换资源。
>
> **当前结构：** 首页以 **About** 为首屏（无 Hero）；沉浸式研究地图在子页 **`/signals-to-support`**。

---

## 0. 浏览器标签 & SEO

**文件：** `index.html`

| 字段 | 当前内容 |
|------|----------|
| 页面标题 `<title>` | Yanqing (Rose) Liu — HCI Researcher |
| 页面描述 `<meta description>` | Yanqing (Rose) Liu — HCI researcher studying data-driven digital systems for everyday mental wellbeing: conversational and behavioral signals for safe, long-term empathic interventions. |

---

## 1. 导航 Nav

**文件：** `src/content/site.ts` → `nav`

| 链接文字 | 锚点 id |
|----------|---------|
| About | about |
| News | news |
| Research | research |
| Projects | projects |
| Publications | publications |
| Journey | journey |
| Contact | contact |

导航左侧品牌名来自 `profile.name`（见下方 Profile）。

---

## 2. Profile（全局个人信息）

**文件：** `src/content/site.ts` → `profile`

| 字段 | 当前内容 |
|------|----------|
| name | Yanqing (Rose) Liu |
| nameZh | 刘艳青 |
| role | HCI Researcher · Research Fellow, HII Lab, Duke Kunshan University |
| email | yanqing.liu2@dukekunshan.edu.cn |
| cv（PDF 路径） | /Yanqing_Liu_CV.pdf |
| seekingPhd（是否显示 PhD 寻求提示） | true |
| github | https://github.com/BlueRosy |
| linkedin | https://www.linkedin.com/in/yanqing-liu-rose |
| scholar | （已移除，页脚不再显示） |

**图片路径（一般不用改文案，换图时改路径）：**

| 用途 | 路径 |
|------|------|
| About 头像 | /Rose-PersonalImage/Rose.2.jpg |

---

## 3. About（单 section，已合并 More）

**文件：** `src/content/site.ts` → `about` + `hero` + `interests` + `currentLens`  
**组件：** `About.tsx` · `AboutIdentityCard.tsx` · `AboutWorldPortal.tsx` · `AboutBottomCards.tsx`

**布局：** 左栏 60% 研究身份/CTA · 右栏 40% 两小卡（Identity + Portal）· 底部三卡（Methods / Current Lens / Beyond research）

### 3.1 左栏

| 字段 | 来源 |
|------|------|
| 姓名 / role | profile |
| headline / headlineSub | hero |
| intro | about.intro |
| researchInterest | about.researchInterest（closed-loop focus，含 autonomy/safety） |
| researchAreas | about.researchAreas chips |
| CTA | View Research · Download CV |

### 3.2 右栏（无重复姓名）

| 卡片 | 内容 |
|------|------|
| Identity card | 头像 · Seeking PhD · phdAreas 关键词 · Email/GitHub/LinkedIn |
| Portal card | ✦ Explore Research World →（interactive 文案） |

### 3.3 底部三卡

| 卡片 | 内容 |
|------|------|
| Methods I use | about.methods |
| Current Lens | currentLens |
| Beyond research | interests |

---

## 4. Research World 子页 `/signals-to-support`

**文件：** `src/content/site.ts` → `researchWorld` + `researchWorldAssets` + `signalFlow`  
**主题：** `src/theme/rwWonderland.ts`（Ivory Wonderland，暖色游戏地图感；主站 palette 不变）

### 4.1 交互（桌面 + 3D 可用时）

- **全屏探索：** `RWExplorationView` — WASD 走动，走近地标/沿路关卡牌按 **E** 交互，**Esc** 关闭
- **探索者：** `RWExplorerSilhouette`（中性剪影，非 Rose Girl）
- **沿路节点：** `RWPathNodes` — focusCards 玻璃关卡牌分布在路径两侧
- **底部导航：** `RWZoneProgressBar` — Entry → Signals → States → Support → Loop，点击传送
- **Zone 面板：** 右下角紧凑浮窗（非全屏遮罩）
- **移动端 / 无 3D：** `RWMobileFallback` — zone 列表 + rose-land 静态底

### 4.2 世界布局

| 地标 | 坐标 | Zone |
|------|------|------|
| Spawn | (0, 0, 8) | Entry |
| Tree 1 | (-6, 0, -2) | Signals Garden |
| Tree 2 | (0, 0, -14) | States Observatory |
| Tree 3 | (6, 0, -26) | Support Sanctuary |
| Loop ring | (0, 0, -34) | Closed-loop Bridge |

路径：`PathRibbon` 发光带 + 藤蔓 GLB + 玫瑰金粒子。树上玻璃面板朝向玩家。

### 4.3 3D 资产（`public/research-world-elements/`）

| 键 | 路径 | 用途 |
|----|------|------|
| land | rose-land/rose-land.png | 地面极淡 overlay（6%）+ mobile fallback |
| tree | rose-tree-milestone/rose-tree-compressed.glb | 三区 milestone ×3 |
| vine | rose-vines/rose-vine-compressed.glb | 路径藤蔓 |

桌面探索者使用程序化剪影，不再加载 figureWalk GLB。

### 4.4 Zones

Entry → **Signals Garden** → **States Observatory** → **Support Sanctuary** → **Closed-loop Bridge**

每区含 `focusCards`（3D 沿路节点 + overlay 可展开）+ 相关 projects。

### 4.5 signalFlow 标签

- Signals: Conversational logs · Behavioral traces · Micro-interactions
- States: Stress · Emotional shifts · Resistance · Self-disclosure
- Support: Empathic intervention · Reflection-to-action · Safety boundaries

---

## 5. News

**文件：** `src/content/site.ts` → `news`

### 5.1 Section 标题（组件里）

| 字段 | 当前内容 |
|------|----------|
| eyebrow | News & Updates |
| title | What I've been building, writing, and presenting |
| intro | Recent talks, papers, roles, and milestones. |

### 5.2 新闻条目（从新到旧）

| date | title | text | tag | featured |
|------|-------|------|-----|----------|
| Jun 2026 | DMH 2026 | Presenting Mindful-Scroll at the Digital Mental Health International Conference in Hong Kong. | Talk | ✓ |
| 2026 | UIST 2026 | CoSim short paper (with the Tsinghua Pervasive HCI Group) is under review. | Paper | ✓ |
| Feb 2026 | HII Lab | Started as a full-time Research Fellow at Duke Kunshan University, advised by Prof. Yucheng Jin. | Role | ✓ |
| Dec 2025 | — | Joined Tsinghua University's Pervasive HCI Group as a Research Intern. | Role | |
| 2025 | — | Received Australia's Global University Award at UNSW. | Award | |
| 2027 Target | — | Preparing two manuscripts targeting CHI 2027 on short-form video wellbeing and caregiver AI literacy. | Manuscript | |

---

## 6. Research

**文件：** `src/content/site.ts` → `research` + `loop`

### 6.1 Section 标题（组件里）

| 字段 | 当前内容 |
|------|----------|
| eyebrow | Research Vision |
| title | Closed-loop systems for everyday mental wellbeing |
| intro | I build and study systems that sense everyday stress from conversational and behavioral signals, interpret underlying mechanisms, select appropriate support strategies, and help users move from reflection to sustainable action. |

### 6.2 Research Focus 卡片

Data-driven wellbeing intervention systems for everyday and subclinical stress and emotional support, with conversational support as a key modality.

### 6.3 Vision 长文（第二段起显示，第一段在 intro 已覆盖）

My research vision is to build closed-loop systems for everyday mental wellbeing. These systems sense stress and emotional states from conversational and behavioral signals, interpret the mechanisms behind these patterns, select appropriate support strategies, and help users translate reflection into sustainable action.

Rather than treating empathic AI as a one-time response generator, I am interested in how conversational support can become long-term, safety-aware, and action-oriented — understanding when to intervene, what support to provide, how to preserve user autonomy, and how to evaluate emotional outcomes, retention, and dependency risks over time.

### 6.4 两大主题 themes

**01 — Empathic Wellbeing Intervention Systems with Safety Boundaries**  
I design and evaluate sustainable empathic support systems within a sensing–interpretation–intervention–maintenance loop, with conversational support as a key modality. I treat safety and ethical boundaries as design constraints that shape when, how, and how much support should be provided.

**02 — Subclinical Stress & Emotion Sensing for Mechanism-Aware Intervention**  
I study how everyday stress, emotional shifts, resistance, and self-disclosure can be inferred from conversational and behavioral patterns, and how these patterns can guide mechanism-aware intervention strategies that remain controllable, low-burden, and sustainable.

### 6.5 The Loop 交互区（组件里部分固定文案）

- 小标题：The Loop
- 标题：Sensing → Interpretation → Intervention → Action → Sustainability & Safety
- 说明：Hover or select a stage to explore how signals become safe, sustainable support.

**Loop 五个节点（`loop` 数组，可改 label / body / items）：**

1. **Sensing** — Identify stress, emotional shifts, resistance, and self-disclosure from conversational and behavioral signals.  
   Items: Conversational logs · Behavioral traces · Micro-interactions

2. **Interpretation** — Move from "what happened" to "why it happened" by examining triggers, relationship dynamics, and individual differences.  
   Items: Stress · Emotional shifts · Resistance · Readiness

3. **Intervention Selection**（当前高亮 current）— Select passive or active support strategies based on users' goals, risks, and readiness for action.  
   Items: Passive vs. active support · Timing · Personalization

4. **Action** — Translate empathic support into low-burden, trackable, and achievable everyday actions.  
   Items: Low-burden steps · Reflection-to-action · Behavioral translation

5. **Sustainability & Safety** — Evaluate retention, emotional outcomes, autonomy, dependency risks, and adaptive safety boundaries over time.  
   Items: Autonomy · Dependency risk · Long-term outcomes

### 6.6 Intellectual grounding

This work is grounded in HCI, human-centered AI, emotional & social computing, and digital mental wellbeing.

---

## 7. Projects

**文件：** `src/content/site.ts` → `projects` + `restrictedNote`

### 7.1 Section 标题（组件里）

| 字段 | 当前内容 |
|------|----------|
| eyebrow | Selected Projects |
| title | Research systems and tools I have built |
| intro | Research prototypes that connect signals to support, alongside public tools that show how I turn analysis and design into working interfaces. Click any card for the full story. |

子标题：**Core Research Projects** · **Tools & Prototypes**

### 7.2 受限项目说明（弹窗底部）

Live demo restricted due to ongoing research protocols. Screenshots and a sanitized walkthrough are available upon request.

---

### 项目 A — mindful-scroll

| 字段 | 内容 |
|------|------|
| type | System · research |
| title | From Social Media Micro-Interactions to Mental State Cues |
| context | Mindful Scroll · HII Lab, Duke Kunshan University |
| question | How can subtle interaction behaviors on social platforms reveal users' psychological states and inform timely wellbeing interventions? |
| contribution | Links fine-grained interaction logs to self-reported wellbeing signals in a simulated short-form video platform, informing closed-loop intervention design. |
| methods | Behavioral log analysis · Pattern mining · Feature interpretation · Intervention opportunity mapping |
| focus | Sensing · Timing · Low-burden intervention |
| role | Independently designed & built the simulated platform (React/JS, Dockerized); led the pilot study (N=32) and analysis pipeline. |
| status | Presentation at DMH 2026 · CHI 2027 manuscript in preparation |
| access | private |
| image | /Mindful-Scroll/feed.png（卡片封面，完整显示手机 UI） |
| gallery | Consent（一次）→ Morning diary → Feed → EMA → Evening reflection → Conversational support |
| links | Demo available upon request |

---

### 项目 B — cosim

| 字段 | 内容 |
|------|------|
| type | Study · research |
| title | Conversational Patterns in Counselor–Student Support Simulations |
| context | CoSim · Pervasive HCI Group, Tsinghua University |
| question | How do emotional cues, resistance, and self-disclosure emerge in simulated counselor–student conversations, and how can these patterns inform better support strategies? |
| contribution | Identifies facilitative vs. hindering communication patterns in simulated peer support, informing conversational intervention design. |
| methods | Dialogue annotation · Thematic analysis · Conversational pattern analysis · Strategy mapping |
| focus | Conversational support · Reflection · Readiness · Intervention design |
| role | Built a trajectory–thematic pipeline across 10 supporters / 19 sessions; identified facilitative vs. hindering patterns. |
| status | Short paper under review at UIST 2026 |
| access | private |
| links | Sanitized walkthrough upon request |

---

### 项目 C — caregiver

| 字段 | 内容 |
|------|------|
| type | Study · research |
| title | Risk Communication & AI Literacy in GenAI-Supported Parenting |
| context | Caregiver AI-Literacy Study · Tsinghua University |
| question | How can interactive GenAI tools improve parents' AI literacy and reduce moral disengagement in everyday parenting contexts? |
| contribution | Links caregiving question themes in parent–AI interactions to AI literacy and self-awareness, informing responsible caregiver-support design. |
| methods | Pre–post survey · Conversational log analysis · OLS modeling · Qualitative analysis |
| focus | AI literacy · Moral disengagement · Risk awareness · Responsible AI |
| role | Developed an LLM-assisted topic-coding workflow with human correction; linked themes to participant profiles. |
| status | CHI 2027 manuscript in preparation |
| access | private |
| links | Demo available upon request |

---

### 项目 D — misinfo-sharing

| 字段 | 内容 |
|------|------|
| type | Design Research · research |
| title | Designing Social Platforms to Reduce Misinformation Sharing |
| context | Studio for Narrative Spaces, City University of Hong Kong |
| question | How do people respond differently to authentic versus misleading posts on social platforms, and how might platform design interrupt or reduce the sharing of misinformation? |
| contribution | Compares behavioral responses to authentic vs. misleading posts across treatment conditions, informing responsible platform intervention design. |
| methods | Behavioral experiment design · Treatment / control comparison · Simulated platform development · Interaction response analysis |
| focus | Misinformation · Responsible AI · Platform design · Behavioral response |
| role | Building the simulated X / Instagram-style study platform and leading later analysis… |
| status | Early stage — study platform in development |
| access | private |
| links | Demo available upon request |

---

### 项目 E — rose-stats-studio（公开工具）

| 字段 | 内容 |
|------|------|
| type | Tool · tool |
| title | Rose Stats Studio |
| context | Browser-local statistics & modeling workbench |
| question | A research-focused, Tableau-like workbench that runs entirely in the browser — statistics, correlation, and regression with data that never leaves the device. |
| contribution | Demonstrates browser-local data analysis and visualization for privacy-sensitive research workflows. |
| methods | DuckDB-WASM · React + TypeScript · ECharts · Statistical modeling |
| focus | Data analysis · Visualization · Regression / model comparison |
| access | public |
| image | /rose-stats-studio/cover.png（相关矩阵 + 散点全屏，卡片封面） |
| gallery | Correlation → Histogram → Category → Regression → Bivariate scatter |
| links | Open live app → https://rose-data-analysis.vercel.app/（私有仓库，无 Code 链接） |

---

### 项目 F — meal-right（公开工具）

| 字段 | 内容 |
|------|------|
| type | Prototype · tool |
| title | Meal Right |
| context | Daily calorie-tracking interface |
| question | A calorie-tracking app emphasizing information hierarchy, visual feedback, and low cognitive load during everyday meal logging. |
| contribution | Explores low cognitive load and clear information hierarchy in everyday health-tracking interfaces. |
| methods | React · HCI design patterns · Responsive UI |
| focus | Information hierarchy · Visual feedback · Accessibility |
| access | public |
| image | `/meal-right/cover.png`（Food bag · 含 Nutrition Facts） |
| imageFit | contain |
| gallery | welcome → signup → login → food bag → add food → cal diary（共 6 张，见 `public/meal-right/gallery-*.png`） |
| links | Open live app → https://mealright.vercel.app/ · Code → https://github.com/BlueRosy/Meal-Right |

---

## 8. Publications

**文件：** `src/content/site.ts` → `publications`

### 8.1 Section 标题（组件里）

| 字段 | 当前内容 |
|------|----------|
| eyebrow | Publications & Manuscripts |
| title | Selected work |
| intro | Peer-reviewed presentations and manuscripts in preparation. Status is reported honestly and updated as work progresses. |

### 8.2 条目列表

| year | authors | title | venue | status | highlight |
|------|---------|-------|-------|--------|-----------|
| 2026 | Liu, Y. | Mindful-Scroll: Linking Interaction Logs to Self-Reported Mental Health and Well-Being, and In-App Interventions. | Digital Mental Health International Conference (DMH), Hong Kong | Presentation | ✓ |
| 2026 | Deng, W., Liu, Y., Chen, Y., Zhang, H., Li, Y., Mi, H., & Yu, C. | CoSim: Identifying Communication Patterns and Skill Development for Fudaoyuan in Chinese Universities. | UIST (Short Paper) | Under Review | |
| 2027 | Liu, Y., Zhu, Y., & Jin, Y. | Simulated Douyin-Style Short Video: Linking Interaction Logs to Self-Reported Mental Health and Well-Being, and In-App Interventions. | CHI (Full Paper) — targeting 2027 | Target Venue | |
| 2026 | Liu, Y., Zhu, Y., & Jin, Y. | A Conversational AI Agent for Short-Form Video Use: Dialogue-Derived Features for Improving Stress and Anxiety Prediction. | Information Processing & Management Conference (IP&MC), Dataset & Full Paper | In Preparation | |

---

## 9. Methods

**文件：** `src/content/site.ts` → `methods`

### 9.1 Section 标题

| 字段 | 当前内容 |
|------|----------|
| eyebrow | Methods |
| title | How I connect data, design, and evaluation |
| intro | Organized around research capabilities — combining data analysis, evaluation, and lightweight building. |

### 9.2 能力分组 groups

**Data & Trace Analysis**  
Conversational log analysis · Behavioral trace analysis · Interaction log analysis

**Human-Centered Research**  
Mixed-methods research · Interview / survey design · Thematic analysis

**System Prototyping**  
Lightweight prototyping · Interface design · Interactive dashboards

**Evaluation**  
Intervention evaluation · User study design · Longitudinal outcome thinking

### 9.3 Emerging

- 标签：Multimodal analysis
- 说明：As a future methodological extension, I hope to integrate language, interaction traces, self-reports, and contextual signals to better interpret everyday stress and emotional states.

### 9.4 Technical skills 列表

```
Python
R
JavaScript / TypeScript
React / Next.js
Data visualization
Lightweight prototyping
LLM-assisted analysis workflows
```

---

## 10. Journey

**文件：** `src/content/site.ts` → `journey`

### 10.1 Section 标题（组件里）

| 字段 | 当前内容 |
|------|----------|
| eyebrow | Journey |
| title | Where I've been |
| intro | A longer timeline of how my path moved across economics, data engineering, front-end systems, and eventually HCI research on everyday wellbeing. |

### 10.2 时间线（按顺序）

| period | place | title | detail |
|--------|-------|-------|--------|
| Roots | Hefei, Anhui, China | Born in Hefei, Anhui | Where my curiosity about people, behavior, and the everyday systems that shape wellbeing first took root. |
| 2016 – 2020 | Macau, China | B.Sc. in Applied Economics, MUST | Ranked 2/882 in the School of Business; foundations in statistics, behavioral economics, and game theory. |
| 2021 – 2023 | New York, USA | M.S. in Applied Analytics, Columbia University | Research design, storytelling with data, and applied text & NLP analytics. |
| 2023 – 2024 | Shanghai, China | Data Engineer, CIB Fintech (兴业数金) | Full-time data engineer on enterprise big-data architecture projects… |
| 2024 | Beijing, China | Frontend Developer Intern | Led frontend of a RAG workflow platform; cut workflow creation time from 2 hours to 30 minutes. |
| 2025 – 2026 | Sydney, Australia | M.S. in Information Technology, UNSW | Interactive design and web front-end programming. WAM 90.3 / High Distinction. |
| 2026 – 2027 | Kunshan, China | Research Fellow, HII Lab, Duke Kunshan University | Leading a two-phase study on short-form video behavior, mental wellbeing signals, and in-app interventions. |
| Jun – Aug 2026 | Hong Kong, China | Summer Research Assistant, Studio for Narrative Spaces, CityU | Built a simulated social media study platform… |

---

## 11. CV 区块

**文件：** `src/components/CV.tsx`（部分硬编码）

### 11.1 Section 标题

| 字段 | 当前内容 |
|------|----------|
| eyebrow | Curriculum Vitae |
| title | The full story, on one page |

### 11.2 三条摘要 highlights

**Education**  
Columbia (M.S. Applied Analytics) · UNSW (M.S. IT, HD) · MUST (B.Sc. Economics, Rank 2/882)

**Research**  
Research Fellow @ DKU HII Lab · Research Intern @ Tsinghua Pervasive HCI · Summer RA @ CityU Studio for Narrative Spaces

**Building**  
React / TypeScript front-end · data analysis & visualization · lightweight prototyping

### 11.3 按钮

Download CV (PDF) → 链接到 profile.cv

---

## 12. Contact（页脚）

**文件：** `src/components/Contact.tsx`（部分硬编码）

| 字段 | 当前内容 |
|------|----------|
| eyebrow | Contact |
| title | Let's talk research |
| intro | I am always glad to discuss data-driven wellbeing systems, conversational support, and PhD collaboration. |
| 邮箱 | yanqing.liu2@dukekunshan.edu.cn |
| 社交按钮 | Email · GitHub · LinkedIn |
| 版权行 | © {年份} Yanqing (Rose) Liu · 刘艳青 |
| Back to top | Back to top |

---

## 附录：内容源文件对照

| 区块 | 主要代码位置 |
|------|----------------|
| 大部分文案 | `src/content/site.ts` |
| Section 标题（部分） | 各 `src/components/*.tsx` 内 `SectionHeading` |
| CV 三条摘要 | `src/components/CV.tsx` |
| About 侧边栏 PhD 一行 | `src/components/About.tsx` |
| Research Loop 区固定句 | `src/components/Research.tsx` |
| SEO | `index.html` |

---

*文档生成日期：2026-06-30 · 与当前代码同步*
