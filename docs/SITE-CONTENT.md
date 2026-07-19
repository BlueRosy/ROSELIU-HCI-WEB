# Rose Profile — 全站内容编辑文档

> **怎么用：** 直接在本文件里改文案。改好后把文档发给我，我会同步到网站代码（主要是 `src/content/site.ts`，以及少数写在组件里的标题）。
>
> **不要改：** 以 `<!-- 固定 -->` 或 `路径:` 标注的技术字段（图片路径、链接 id 等），除非你明确要换资源。
>
> **当前结构：** 首页以 **About** 为首屏（无 Hero）；**3D Research Universe** 在子页 **`/signals-to-support`**。

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
| Vision | research（锚点 id 不变） |
| Studio（下拉，非锚点） | `studioHub` → Research World + Stats Studio + Literature + Meal Right |
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
| researchInterest | about.researchInterest（closed-loop **support** systems + interaction signals） |
| researchAreas | HCI · HCAI · Digital Wellbeing · Multimodal Interaction Sensing · Conversational Support |
| CTA | View Vision · Download CV |

**About intro（两段）：** everyday digital interactions → signals for support（conversation / behavior / self-report / prototyping）；Looking forward → multimodal everyday sensing（contextual + lightweight physiological）。

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

**interests（Beyond research chips）：**

- Singing
- Sports & Fitness
- Travel
- Photography
- Building personal tools & sites

---

## 4. 3D Research Universe 子页 `/signals-to-support`

**文件：** `src/content/site.ts` → `researchUniverse` + `researchAtlas` + `researchWorld` + `projects`  
**组件：** `src/components/research-universe/`（`ResearchUniverseView` · `ResearchUniverseCanvas` · `ScrollNarrative` · `FloatingProjectCards` · `ProjectDetailPanel`）  
**配置：** `universeConfig.ts`（节点 3D 坐标、镜头关键帧）  
**布局壳：** `RWLayout`  
**依赖：** `gsap` + ScrollTrigger（滚动驱动镜头）

> Mario 式 WASD 3D 探索（`RWExplorationView`）已弃用。移动端 / reduced-motion 回退到 2D `ResearchAtlasView`。

### 4.1 页面结构（桌面 3D）

1. **固定全屏 Canvas** — 发光闭环 + 粒子流 + 四玻璃节点 + 3D 漂浮项目卡  
2. **滚动叙事层** — 6 段 HTML overlay（Hero → Signals → States → Support → Safety → Projects）  
3. **GSAP ScrollTrigger** — scrub 镜头路径，无需键盘操作  
4. **项目侧栏** — 点击 3D 项目卡打开 `ProjectDetailPanel`

### 4.2 四主节点（researchUniverse.nodes）

Signals → States → Support → Safety（闭环）

每节点含 `satellites` + `narrative`（滚动段文案）

### 4.3 Fallback（2D Atlas）

`useEnable3D()` 为 false 时渲染 `research-atlas/ResearchAtlasView`

### 4.4 About 入口文案

`about.researchWorldLink` → **Explore Research Universe** · tags: Signals · States · Support · Safety · Closed-loop

### 4.5 signalFlow 标签（2D fallback 仍使用）

- Signals: Conversational logs · Behavioral traces · Micro-interactions
- States: Stress · Emotional shifts · Resistance · Self-disclosure
- Support: Empathic intervention · Reflection-to-action · Safety boundaries

### 4.6 遗留资产

`public/research-world-elements/` GLB/贴图保留，当前 Universe 页面未使用。

## 5. News

**文件：** `src/content/site.ts` → `news`

### 5.1 Section 标题（组件里）

| 字段 | 当前内容 |
|------|----------|
| eyebrow | News & Updates |
| title | What I've been building, writing, and presenting |
| intro | Recent talks, papers, roles, and milestones. |

### 5.2 排序与折叠

- Timeline / featured：**降序**（latest 在上），见 `src/lib/contentDate.ts`
- Full timeline：系统本月 + 下月默认展开；其余折叠（限高滚动 + Show earlier timeline）

### 5.3 新闻条目（逻辑顺序：新→旧）

| date | title | text | tag | featured |
|------|-------|------|-----|----------|
| 2027 Target | Targeting CHI 2027 | Mindful-Scroll self-reflection intervention plus Misinformation Sharing… | Manuscript | ✓ |
| Aug 2026 | Writing DMH Book chapter | SFV micro-interaction signals… ddl Aug 31 | Manuscript | ✓ |
| Jul 2026 | Submitting to IP&MC | Evening dialogue dataset/pipeline… ddl Jul 31 | Manuscript | ✓ |
| Jul 2026 | Started HarmonyOS forum study | Crawl + topic modeling（Tsinghua Pervasive HCI） | Role | |
| Jun 2026 | Joined Ray LC lab | CityU summer · Misinfo data collection | Role | ✓ |
| Jun 2026 | Presented Mindful-Scroll at DMH | Talk in Hong Kong | Talk | |
| Feb 2026 | Joined HII Lab | Research Fellow @ DKU | Role | |
| Dec 2025 | Joined Tsinghua Pervasive HCI | Research Intern | Role | |
| 2025 | Received UNSW award | Global University Award | Award | |

> 已删除 UIST / CoSim under-review 新闻卡。

---

## 6. Research

**文件：** `src/content/site.ts` → `research` + `loop`

### 6.1 Section 标题（组件里）

| 字段 | 当前内容 |
|------|----------|
| eyebrow | Research Vision |
| title | Closed-loop systems for everyday mental wellbeing |
| intro | closed-loop systems from conversational/behavioral/self-report/contextual signals → adaptive support；Looking forward → multimodal everyday sensing |

### 6.2 Research Focus 卡片

Data-driven human-centered systems for everyday wellbeing, reflection, and supportive behavior change, grounded in conversational, behavioral, self-report, and emerging multimodal signals.

### 6.3 Vision 长文

Sense everyday psychological states and needs from conversational, behavioral, self-report, and contextual signals… Longer-term: multimodal signal integration (contextual + lightweight physiological). Supportive systems that are long-term, safety-aware, and action-oriented.

### 6.4 两大主题 themes

**01 — Adaptive Support Systems with Safety Boundaries**  
Sensing–interpretation–intervention–maintenance loop；safety, autonomy, sustainability as design constraints.

**02 — Multimodal Interaction Signals for Mechanism-Aware Support**  
Conversational / behavioral / self-report / contextual cues → states, needs, readiness, resistance, decision mechanisms → personalized low-burden support.（不夸大已完成 multimodal pipeline）

### 6.5 The Loop

**Sensing** — conversations, micro-interactions, self-reports, emerging multimodal/contextual cues.  
**Interpretation** — states, needs, readiness, mechanisms across streams.  
**Intervention / Action / Safety** — adaptive support, reflection-to-action, autonomy & dependency.

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
| question | How can short-form video micro-interactions and evening self-reflection dialogues reveal everyday stress and anxiety — and how should those signals shape a safe self-reflection intervention? |
| contribution | Three-stage line: (1) evening Juanjuan dialogue logs → reflective-signal dataset + modeling pipeline (IP&MC); (2) SFV micro-interactions as stress/anxiety signals (DMH Conference Book); (3) combine into self-reflection intervention for healthier SFV use (Sep → CHI 2027). |
| methods | Conversational log analysis · Topic modeling · Predictive / longitudinal modeling · Micro-interaction sensing · Intervention design |
| focus | Dialogue signals · Micro-interactions · Mental-state modeling · Self-reflection intervention |
| role | Independently designed & built the simulated platform (React/JS, Dockerized); led the pilot study (N=32) and analysis pipelines across dialogue and micro-interaction tracks. |
| status | DMH 2026 presented · IP&MC dataset/pipeline in prep (ddl Jul 31) · Conference Book planned (ddl Aug 31) · intervention design Sep 2026 · targeting CHI 2027 (intervention) |
| access | private |
| image | `/Mindful-Scroll/cover.png`（16:10 三屏拼贴：feed + morning diary + chat） |
| gallery | study 拼贴 · support 拼贴（源竖屏在 `public/Mindful-Scroll/originals/`） |
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
| status | Study completed · preparing next venue submission |
| access | private |
| links | Sanitized walkthrough upon request |

---

### 项目 C — misinfo-sharing

| 字段 | 内容 |
|------|------|
| type | Design Research · research |
| title | Designing Social Platforms to Reduce Misinformation Sharing |
| context | Studio for Narrative Spaces · CityU · Ray LC (Summer Research Intern, from Jun 2026) |
| question | Do treatment vs. control comment conditions change how people react to authentic and misleading-but-funny posts — via repost, share, report, or skip — and what mechanisms drive those shifts? |
| contribution | A/B experiment: treatment/control each ~20 posts (~10 true / ~10 false-but-funny), differing comments; measures repost, share, report, skip for responsible platform design. |
| methods | Behavioral experiment design · Treatment / control comparison · Simulated platform development · Stimulus curation · Interaction response analysis |
| focus | Misinformation · Comment interventions · Platform design · Behavioral response |
| role | Lead study-web layout and front-end; meetings; post/comment selection; may join later analysis and writing. |
| status | Data collection in progress · targeting CHI 2027 |
| access | private |
| links | Demo available upon request |

---

### 项目 D — harmony-forum

| 字段 | 内容 |
|------|------|
| type | Study · research |
| title | Help-Seeking in an Open-Source Developer Community |
| context | Pervasive HCI Group, Tsinghua University · Huawei HarmonyOS Developer Forum · exploratory, Jul 2026– |
| question | How do developers seek help, debug, and share tooling in a large open-source community forum — and which discourse topics are research-ready? |
| contribution | Crawl forum posts/comments → topic modeling with mapping → focus help-seeking, tooling/bots, IoT, automotive; informed by open-source developer literature (not claimed as own papers). |
| methods | Web scraping · Topic modeling · Community discourse analysis · Related-work synthesis |
| focus | Help-seeking · Developer communities · Topic modeling · Open-source tooling |
| role | Crawl + topic-modeling pipeline; topic selection for paper narrative. |
| status | Exploratory · topic selection underway |
| access | private |
| image | `/projects/harmony-forum.svg`（Crawl → Topic model → Focus pipeline 图） |
| links | HarmonyOS developer forum → https://developer.huawei.com/consumer/cn/forum/ |

> Caregiver / AI parenting 与 UIST 叙事已从站点下架；CoSim 项目保留，不写拒稿。

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
| image | `/websites/rose-stats-studio/cover.png`（相关矩阵 + 散点全屏，卡片封面） |
| gallery | Correlation → Histogram → Category → Regression → Bivariate scatter（见 `public/websites/rose-stats-studio/`） |
| links | Open live app → https://rose-data-analysis.vercel.app/（私有仓库，无 Code 链接） |

---

### 项目 F — rose-literature（公开工具）

| 字段 | 内容 |
|------|------|
| type | Tool · tool |
| title | Rose's Literature |
| context | Literature & scholar discovery for HCI researchers |
| question | Google Scholar finds everything; this finds the right thread — and the right person. OpenAlex- and DBLP-backed search with method-aware filters, then LLM-assisted matching between your research interests and a scholar's profile before you reach out. |
| contribution | Unifies thematic literature search, method-focused filtering, scholar profiling, and interest-to-advisor match into one personal research workflow — built first for my own PhD exploration. |
| methods | OpenAlex · DBLP · LLM-assisted matching · React |
| focus | Literature search · Scholar discovery · Interest matching · Research workflow |
| access | public |
| image | `/websites/rose-research-world/cover.png` |
| gallery | Scholars → Results（见 `public/websites/rose-research-world/`） |
| links | Open live app → https://rose-liternature-search.vercel.app/ |

---

### 项目 G — meal-right（公开工具）

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
| image | `/websites/meal-right/cover.png`（16:10 三屏拼贴：welcome + food bag + add food） |
| gallery | onboarding 拼贴 · daily 拼贴（源竖屏在 `public/websites/meal-right/originals/`） |
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

### 8.2 排序

组件内按 `publicationSortKey` **升序**（oldest 在上，latest 在下）。

### 8.3 条目列表（渲染顺序）

| year | authors | title | venue | status | highlight |
|------|---------|-------|-------|--------|-----------|
| 2026 | Liu, Y. | Mindful-Scroll… | DMH Hong Kong — Jun 2026 | Presentation | ✓ |
| 2026 | Liu, Y., Zhu, Y., & Jin, Y. | Evening Self-Reflection Dialogues… | IP&MC — targeting Jul 31, 2026 | In Preparation | |
| 2026 | Liu, Y., Zhu, Y., & Jin, Y. | Short-Form Video Micro-Interactions… | DMH Conference Book — targeting Aug 31, 2026 | In Preparation | |
| 2027 | Liu, Y., Zhu, Y., & Jin, Y. | Designing Self-Reflection Interventions… | CHI — targeting 2027 | Target Venue | |
| 2027 | Liu, Y., & LC, R. | Comment Conditions and Behavioral Responses… | CHI — targeting 2027 | Target Venue | |

> 已删除 CoSim / UIST Under Review 条目。

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
| 2023 – 2024 | Shanghai, China | Data Engineer, CIB Fintech | Full-time data engineer on enterprise big-data architecture projects… |
| 2024 | Beijing, China | Frontend Developer Intern | Led frontend of a RAG workflow platform; cut workflow creation time from 2 hours to 30 minutes. |
| 2025 – 2026 | Sydney, Australia | M.S. in Information Technology, UNSW | Interactive design and web front-end programming. WAM 90.3 / High Distinction. |
| 2026 – 2027 | Kunshan, China | Research Fellow, HII Lab, Duke Kunshan University | Leading Mindful-Scroll in three stages: dialogue-derived mental-state signals and modeling pipeline, SFV micro-interaction wellbeing modeling, then self-reflection intervention design for high-stress / high-anxiety use. |
| Jun – Aug 2026 | Hong Kong, China | Summer Research Intern, Studio for Narrative Spaces, CityU (Ray LC) | Joined Ray LC’s group on a misinformation-sharing experiment: study-web layout and stimulus selection (posts / comments); data collection in progress, targeting CHI 2027. |

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
Research Fellow @ DKU HII Lab · Research Intern @ Tsinghua Pervasive HCI · Summer Research Intern @ CityU Studio for Narrative Spaces (Ray LC)

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
