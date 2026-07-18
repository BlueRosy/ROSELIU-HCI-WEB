/**
 * Single source of truth for all site content.
 * Edit copy here without touching components.
 *
 * TODO(assets) markers indicate items Rose still needs to provide.
 */

export const profile = {
  name: "Yanqing (Rose) Liu",
  nameZh: "刘艳青",
  // TODO(assets): confirm current role / affiliation line
  role: "HCI Researcher · Research Fellow, HII Lab, Duke Kunshan University",
  email: "yanqing.liu2@dukekunshan.edu.cn",
  photo: "/Rose-PersonalImage/Rose1.jpg",
  heroPhoto: "/Rose-PersonalImage/Rose3.jpg",
  heroArt: "/Rose-PersonalImage/Rose-3D.png",
  aboutPhoto: "/Rose-PersonalImage/Rose.2.jpg",
  heroMode: "illustration" as const,
  heroIllustration: "/Rose-PersonalImage/h5.png",
  avatar3d: "/Rose-PersonalImage/chibi-reading.glb",
  heroParallax: "/Rose-PersonalImage/h1.png",
  cv: "/Yanqing_Liu_CV.pdf",
  socials: {
    github: "https://github.com/BlueRosy",
    linkedin: "https://www.linkedin.com/in/yanqing-liu-rose",
  },
  // Toggle the "seeking PhD opportunities" line in About
  seekingPhd: true,
} as const;

export const hero = {
  headline: "From Signals to Support",
  headlineSub: "Building Human-Centered Systems for Everyday Mental Wellbeing",
  intro:
    "I'm Rose — an HCI researcher and Research Fellow at Duke Kunshan University's HII Lab. I study how conversational and behavioral patterns reveal everyday stress and emotional states, and how these signals can inform safe, long-term, empathic interventions.",
  researchInterest:
    "Closed-loop systems for everyday mental wellbeing: sensing stress from conversational and behavioral signals, interpreting mechanisms, selecting support strategies, and helping users translate reflection into sustainable action.",
  tags: [
    "HCI",
    "Human-Centered AI",
    "Digital Wellbeing",
    "Conversational Support",
    "Emotional & Social Computing",
  ],
} as const;

export const signalFlow = {
  pipeline: ["Signals", "States", "Support"] as const,
  stages: [
    {
      label: "Signals",
      items: ["Conversational logs", "Behavioral traces", "Micro-interactions"],
    },
    {
      label: "States",
      items: ["Stress", "Emotional shifts", "Resistance", "Self-disclosure"],
    },
    {
      label: "Support",
      items: ["Empathic intervention", "Reflection-to-action", "Safety boundaries"],
    },
  ],
} as const;

export const interests = [
  "Singing",
  "Sports & Fitness",
  "Travel",
  "Photography",
  "Building personal tools & sites",
] as const;

export const research = {
  focus:
    "Data-driven wellbeing intervention systems for everyday and subclinical stress and emotional support, with conversational support as a key modality.",
  vision: [
    "My research vision is to build closed-loop systems for everyday mental wellbeing. These systems sense stress and emotional states from conversational and behavioral signals, interpret the mechanisms behind these patterns, select appropriate support strategies, and help users translate reflection into sustainable action.",
    "Rather than treating empathic AI as a one-time response generator, I am interested in how conversational support can become long-term, safety-aware, and action-oriented — understanding when to intervene, what support to provide, how to preserve user autonomy, and how to evaluate emotional outcomes, retention, and dependency risks over time.",
  ],
  themes: [
    {
      index: "01",
      title: "Empathic Wellbeing Intervention Systems with Safety Boundaries",
      body: "I design and evaluate sustainable empathic support systems within a sensing–interpretation–intervention–maintenance loop, with conversational support as a key modality. I treat safety and ethical boundaries as design constraints that shape when, how, and how much support should be provided.",
    },
    {
      index: "02",
      title: "Subclinical Stress & Emotion Sensing for Mechanism-Aware Intervention",
      body: "I study how everyday stress, emotional shifts, resistance, and self-disclosure can be inferred from conversational and behavioral patterns, and how these patterns can guide mechanism-aware intervention strategies that remain controllable, low-burden, and sustainable.",
    },
  ],
  grounding:
    "This work is grounded in HCI, human-centered AI, emotional & social computing, and digital mental wellbeing.",
} as const;

export type LoopNode = {
  key: string;
  label: string;
  short: string;
  body: string;
  items: string[];
  current?: boolean;
};

export const loop: LoopNode[] = [
  {
    key: "sensing",
    label: "Sensing",
    short: "Identify state cues from signals",
    body: "Identify stress, emotional shifts, resistance, and self-disclosure from conversational and behavioral signals.",
    items: ["Conversational logs", "Behavioral traces", "Micro-interactions"],
  },
  {
    key: "interpretation",
    label: "Interpretation",
    short: "From what happened to why",
    body: "Move from \u201Cwhat happened\u201D to \u201Cwhy it happened\u201D by examining triggers, relationship dynamics, and individual differences.",
    items: ["Stress", "Emotional shifts", "Resistance", "Readiness"],
  },
  {
    key: "intervention",
    label: "Intervention Selection",
    short: "Choose passive or active support",
    body: "Select passive or active support strategies based on users\u2019 goals, risks, and readiness for action.",
    items: ["Passive vs. active support", "Timing", "Personalization"],
    current: true,
  },
  {
    key: "action",
    label: "Action",
    short: "Translate support into action",
    body: "Translate empathic support into low-burden, trackable, and achievable everyday actions.",
    items: ["Low-burden steps", "Reflection-to-action", "Behavioral translation"],
  },
  {
    key: "sustainability",
    label: "Sustainability & Safety",
    short: "Maintain outcomes and boundaries",
    body: "Evaluate retention, emotional outcomes, autonomy, dependency risks, and adaptive safety boundaries over time.",
    items: ["Autonomy", "Dependency risk", "Long-term outcomes"],
  },
];

export type AccessType = "public" | "demo" | "private";

export type ProjectLink = {
  label: string;
  href?: string; // omit for "upon request" style chips
};

export type ProjectType =
  | "Study"
  | "System"
  | "Prototype"
  | "Tool"
  | "Design Research";

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption?: string;
};

export type Project = {
  id: string;
  group: "research" | "tool";
  projectType: ProjectType;
  title: string;
  context: string;
  question: string;
  contribution: string;
  methods: string[];
  focus: string[];
  role?: string;
  status?: string;
  accessType: AccessType;
  image?: string;
  /** cover = crop to 16:10; contain = letterbox single mobile UI (prefer collage covers instead). */
  imageFit?: "cover" | "contain";
  gallery?: ProjectScreenshot[];
  links: ProjectLink[];
};

const RESTRICTED_NOTE =
  "Live demo restricted due to ongoing research protocols. Screenshots and a sanitized walkthrough are available upon request.";

export const projects: Project[] = [
  {
    id: "mindful-scroll",
    group: "research",
    projectType: "System",
    title: "From Social Media Micro-Interactions to Mental State Cues",
    context: "Mindful Scroll · HII Lab, Duke Kunshan University",
    question:
      "How can short-form video micro-interactions and evening self-reflection dialogues reveal everyday stress and anxiety \u2014 and how should those signals shape a safe self-reflection intervention?",
    contribution:
      "A three-stage line: (1) evening Juanjuan dialogue logs \u2192 reflective behavioral-signal dataset and modeling pipeline (topic modeling, classifiers, between-/within-group longitudinal models) for an LLM-assisted self-reflection assistant; (2) SFV-specific micro-interactions as everyday stress/anxiety signals; (3) combine both signal findings into a self-reflection intervention for healthier SFV use under high stress or anxiety.",
    methods: [
      "Conversational log analysis",
      "Topic modeling",
      "Predictive / longitudinal modeling",
      "Micro-interaction sensing",
      "Intervention design",
    ],
    focus: [
      "Dialogue signals",
      "Micro-interactions",
      "Mental-state modeling",
      "Self-reflection intervention",
    ],
    role: "Independently designed & built the simulated platform (React/JS, Dockerized); led the pilot study (N=32) and analysis pipelines across dialogue and micro-interaction tracks.",
    status:
      "DMH 2026 presented · IP&MC dataset/pipeline in prep (ddl Jul 31) · Conference Book planned (ddl Aug 31) · intervention design Sep 2026 · targeting CHI 2027 (intervention)",
    accessType: "private",
    image: "/Mindful-Scroll/cover.png",
    gallery: [
      {
        src: "/Mindful-Scroll/gallery-study.png",
        alt: "Mindful Scroll study flow collage: consent, morning diary, and feed",
        caption: "Study day · consent to feed",
      },
      {
        src: "/Mindful-Scroll/gallery-support.png",
        alt: "Mindful Scroll support collage: EMA diary, evening reflection, and chat",
        caption: "Support · EMA to chat",
      },
    ],
    links: [{ label: "Demo available upon request" }],
  },
  {
    id: "cosim",
    group: "research",
    projectType: "Study",
    title: "Conversational Patterns in Counselor\u2013Student Support Simulations",
    context: "CoSim · Pervasive HCI Group, Tsinghua University",
    question:
      "How do emotional cues, resistance, and self-disclosure emerge in simulated counselor\u2013student conversations, and how can these patterns inform better support strategies?",
    contribution:
      "Identifies facilitative vs. hindering communication patterns in simulated peer support, informing conversational intervention design.",
    methods: [
      "Dialogue annotation",
      "Thematic analysis",
      "Conversational pattern analysis",
      "Strategy mapping",
    ],
    focus: [
      "Conversational support",
      "Reflection",
      "Readiness",
      "Intervention design",
    ],
    role: "Built a trajectory\u2013thematic pipeline across 10 supporters / 19 sessions; identified facilitative vs. hindering patterns.",
    status: "Short paper under review at UIST 2026",
    accessType: "private",
    image: "/projects/cosim.svg",
    links: [{ label: "Sanitized walkthrough upon request" }],
  },
  {
    id: "misinfo-sharing",
    group: "research",
    projectType: "Design Research",
    title: "Designing Social Platforms to Reduce Misinformation Sharing",
    context:
      "Studio for Narrative Spaces · CityU · Ray LC (Summer Research Intern, from Jun 2026)",
    question:
      "Do treatment vs. control comment conditions change how people react to authentic and misleading-but-funny posts \u2014 via repost, share, report, or skip \u2014 and what mechanisms drive those shifts?",
    contribution:
      "A/B behavioral experiment on a simulated social platform: treatment and control each with ~20 posts (~10 true / ~10 false-but-funny), with differing comment conditions; measures repost, share, report, and skip to inform responsible platform intervention design.",
    methods: [
      "Behavioral experiment design",
      "Treatment / control comparison",
      "Simulated platform development",
      "Stimulus curation",
      "Interaction response analysis",
    ],
    focus: [
      "Misinformation",
      "Comment interventions",
      "Platform design",
      "Behavioral response",
    ],
    role: "Lead study-web layout and front-end development; contribute in meetings and in selecting posts and comments; may join later analysis and paper writing.",
    status: "Data collection in progress \u00b7 targeting CHI 2027",
    accessType: "private",
    image: "/projects/misinfo-sharing.svg",
    links: [{ label: "Demo available upon request" }],
  },
  {
    id: "harmony-forum",
    group: "research",
    projectType: "Study",
    title: "Help-Seeking in an Open-Source Developer Community",
    context: "Huawei HarmonyOS Developer Forum \u00b7 exploratory, Jul 2026\u2013",
    question:
      "How do developers seek help, debug, and share tooling in a large open-source community forum \u2014 and which discourse topics are research-ready for deeper HCI analysis?",
    contribution:
      "Crawl posts and comments from the Huawei HarmonyOS developer Q&A forum, run topic modeling with explicit topic mapping, then focus candidates such as help-seeking, tooling/bots, IoT, and automotive \u2014 informed by open-source developer and support/tool community literature, without claiming those prior papers as my own.",
    methods: [
      "Web scraping",
      "Topic modeling",
      "Community discourse analysis",
      "Related-work synthesis",
    ],
    focus: [
      "Help-seeking",
      "Developer communities",
      "Topic modeling",
      "Open-source tooling",
    ],
    role: "Designing the crawl + topic-modeling pipeline and selecting which topics can sustain a paper narrative (including agent-related angles).",
    status: "Exploratory \u00b7 topic selection underway",
    accessType: "private",
    image: "/projects/harmony-forum.svg",
    links: [
      {
        label: "HarmonyOS developer forum",
        href: "https://developer.huawei.com/consumer/cn/forum/",
      },
    ],
  },
  {
    id: "rose-stats-studio",
    group: "tool",
    projectType: "Tool",
    title: "Rose Stats Studio",
    context: "Browser-local statistics & modeling workbench",
    question:
      "A research-focused, Tableau-like workbench that runs entirely in the browser \u2014 statistics, correlation, and regression with data that never leaves the device.",
    contribution:
      "Demonstrates browser-local data analysis and visualization for privacy-sensitive research workflows.",
    methods: ["DuckDB-WASM", "React + TypeScript", "ECharts", "Statistical modeling"],
    focus: ["Data analysis", "Visualization", "Regression / model comparison"],
    accessType: "public",
    image: "/websites/rose-stats-studio/cover.png",
    gallery: [
      {
        src: "/websites/rose-stats-studio/gallery-correlation.png",
        alt: "Correlation heatmap and bivariate scatter with regression",
        caption: "Correlation · heatmap & scatter",
      },
      {
        src: "/websites/rose-stats-studio/gallery-histogram.png",
        alt: "Histogram visualization with bin controls",
        caption: "Visualization · histogram",
      },
      {
        src: "/websites/rose-stats-studio/gallery-category.png",
        alt: "Category cross-tabulation with heatmap and stacked bars",
        caption: "Category · cross-tab analysis",
      },
      {
        src: "/websites/rose-stats-studio/gallery-regression.png",
        alt: "Regression model comparison and predicted vs actual plot",
        caption: "Regression · model comparison",
      },
      {
        src: "/websites/rose-stats-studio/gallery-scatter.png",
        alt: "Bivariate scatter plot with correlation statistics",
        caption: "Bivariate · fit & significance",
      },
    ],
    links: [{ label: "Open live app", href: "https://rose-data-analysis.vercel.app/" }],
  },
  {
    id: "rose-literature",
    group: "tool",
    projectType: "Tool",
    title: "Rose's Literature",
    context: "Literature & scholar discovery for HCI researchers",
    question:
      "Google Scholar finds everything; this finds the right thread \u2014 and the right person. OpenAlex- and DBLP-backed search with method-aware filters, then LLM-assisted matching between your research interests and a scholar's profile before you reach out.",
    contribution:
      "Unifies thematic literature search, method-focused filtering, scholar profiling, and interest-to-advisor match into one personal research workflow \u2014 built first for my own PhD exploration.",
    methods: ["OpenAlex", "DBLP", "LLM-assisted matching", "React"],
    focus: [
      "Literature search",
      "Scholar discovery",
      "Interest matching",
      "Research workflow",
    ],
    accessType: "public",
    image: "/websites/rose-research-world/cover.png",
    gallery: [
      {
        src: "/websites/rose-research-world/gallery-scholars.png",
        alt: "Scholar search and interest-to-advisor matching landing",
        caption: "Scholars · find & match",
      },
      {
        src: "/websites/rose-research-world/gallery-results.png",
        alt: "Literature search results with citation formats and deep-read actions",
        caption: "Results · cite & deep-read",
      },
    ],
    links: [
      {
        label: "Open live app",
        href: "https://rose-liternature-search.vercel.app/",
      },
    ],
  },
  {
    id: "meal-right",
    group: "tool",
    projectType: "Prototype",
    title: "Meal Right",
    context: "Daily calorie-tracking interface",
    question:
      "A calorie-tracking app emphasizing information hierarchy, visual feedback, and low cognitive load during everyday meal logging.",
    contribution:
      "Explores low cognitive load and clear information hierarchy in everyday health-tracking interfaces.",
    methods: ["React", "HCI design patterns", "Responsive UI"],
    focus: ["Information hierarchy", "Visual feedback", "Accessibility"],
    accessType: "public",
    image: "/websites/meal-right/cover.png",
    gallery: [
      {
        src: "/websites/meal-right/gallery-onboarding.png",
        alt: "Meal Right onboarding collage: welcome, sign up, and log in",
        caption: "Onboarding · welcome to login",
      },
      {
        src: "/websites/meal-right/gallery-daily.png",
        alt: "Meal Right daily flow collage: food bag, add food, and calorie diary",
        caption: "Daily flow · bag to diary",
      },
    ],
    links: [
      { label: "Open live app", href: "https://mealright.vercel.app/" },
      { label: "Code", href: "https://github.com/BlueRosy/Meal-Right" },
    ],
  },
];

export const restrictedNote = RESTRICTED_NOTE;

export type PubStatus =
  | "Presentation"
  | "Under Review"
  | "In Preparation"
  | "Target Venue";

export type Publication = {
  authors: string;
  title: string;
  venue: string;
  year: string;
  status: PubStatus;
  highlight?: boolean;
};

export const publications: Publication[] = [
  {
    authors: "Liu, Y.",
    title:
      "Mindful-Scroll: Linking Interaction Logs to Self-Reported Mental Health and Well-Being, and In-App Interventions.",
    venue: "Digital Mental Health International Conference (DMH), Hong Kong",
    year: "2026",
    status: "Presentation",
    highlight: true,
  },
  {
    authors: "Deng, W., Liu, Y., Chen, Y., Zhang, H., Li, Y., Mi, H., & Yu, C.",
    title:
      "CoSim: Identifying Communication Patterns and Skill Development for Fudaoyuan in Chinese Universities.",
    venue: "UIST (Short Paper)",
    year: "2026",
    status: "Under Review",
  },
  {
    authors: "Liu, Y., Zhu, Y., & Jin, Y.",
    title:
      "Evening Self-Reflection Dialogues on Short-Form Video Use: A Dataset and Modeling Pipeline for Stress and Anxiety Signals.",
    venue:
      "Information Processing & Management Conference (IP&MC), Dataset & Full Paper — targeting Jul 31, 2026",
    year: "2026",
    status: "In Preparation",
  },
  {
    authors: "Liu, Y., Zhu, Y., & Jin, Y.",
    title:
      "Short-Form Video Micro-Interactions as Everyday Stress and Anxiety Signals: Modeling Behavioral Traces for Digital Mental Health.",
    venue:
      "DMH Conference Book — Maximising the Real-World Potential of Digital Mental Health (Springer Nature) — targeting Aug 31, 2026",
    year: "2026",
    status: "In Preparation",
  },
  {
    authors: "Liu, Y., Zhu, Y., & Jin, Y.",
    title:
      "Designing Self-Reflection Interventions for Healthier Short-Form Video Use Under High Stress and Anxiety.",
    venue: "CHI (Full Paper) — targeting 2027",
    year: "2027",
    status: "Target Venue",
  },
  {
    authors: "Liu, Y., & LC, R.",
    title:
      "Comment Conditions and Behavioral Responses to Authentic vs. Misleading Posts on a Simulated Social Platform.",
    venue: "CHI (Full Paper) — targeting 2027",
    year: "2027",
    status: "Target Venue",
  },
];

export const methods = {
  subtitle: "How I connect data, design, and evaluation",
  groups: [
    {
      title: "Data & Trace Analysis",
      items: [
        "Conversational log analysis",
        "Behavioral trace analysis",
        "Interaction log analysis",
      ],
    },
    {
      title: "Human-Centered Research",
      items: [
        "Mixed-methods research",
        "Interview / survey design",
        "Thematic analysis",
      ],
    },
    {
      title: "System Prototyping",
      items: [
        "Lightweight prototyping",
        "Interface design",
        "Interactive dashboards",
      ],
    },
    {
      title: "Evaluation",
      items: [
        "Intervention evaluation",
        "User study design",
        "Longitudinal outcome thinking",
      ],
    },
  ],
  emerging: ["Multimodal analysis"] as const,
  emergingNote:
    "As a future methodological extension, I hope to integrate language, interaction traces, self-reports, and contextual signals to better interpret everyday stress and emotional states.",
  technical: [
    "Python",
    "R",
    "JavaScript / TypeScript",
    "React / Next.js",
    "Data visualization",
    "Lightweight prototyping",
    "LLM-assisted analysis workflows",
  ],
} as const;

export const currentLens = [
  "Emotionally attuned",
  "Behaviorally grounded",
  "Autonomy-preserving",
  "Safety-aware over time",
] as const;

export const about = {
  intro:
    "I am an HCI researcher studying how conversational patterns, behavioral traces, and lightweight self-reports can reveal everyday stress and emotional states — and how these signals can inform safe, long-term, empathic interventions.",
  researchInterest:
    "My current focus is closed-loop wellbeing systems: sensing everyday signals, interpreting mechanisms, selecting support strategies, and helping people translate reflection into sustainable action while preserving autonomy and safety.",
  researchAreas: [
    "HCI",
    "Human-Centered AI",
    "Digital Wellbeing",
    "Conversational Support",
    "Emotional & Social Computing",
  ] as const,
  phdAreas:
    "HCI · Human-Centered AI · Digital Wellbeing · Emotional Computing",
  methods: [
    "Conversational log analysis",
    "Behavioral trace analysis",
    "Mixed-methods research",
    "Lightweight system prototyping",
  ] as const,
  seekingLine: "Seeking PhD opportunities",
  researchWorldLink: {
    label: "Explore Research World",
    hint: "Scroll through an immersive research trail from signals to support",
    description:
      "Walk a rose-garden research trail — Signals Garden, States Observatory, Support Sanctuary, and Closed-loop Center.",
    tags: "Signals · States · Support · Closed-loop",
    href: "/rose-research-world",
  },
} as const;

export const researchAtlas = {
  researchQuestion:
    "How can everyday conversational and behavioral signals become safe, sustainable support?",
  openingLine:
    "An interactive map of my research on everyday mental wellbeing.",
  projectEvidence: [
    {
      projectId: "mindful-scroll",
      mapping: "Signals + States",
      zones: ["signals", "states"] as const,
    },
    {
      projectId: "cosim",
      mapping: "States + Support",
      zones: ["states", "support"] as const,
    },
    {
      projectId: "misinfo-sharing",
      mapping: "Responsible platform design",
      zones: ["states"] as const,
    },
    {
      projectId: "harmony-forum",
      mapping: "Community discourse signals",
      zones: ["signals"] as const,
    },
  ],
  zoneMethods: {
    signals: [
      "Interaction log analysis",
      "Conversational log analysis",
      "EMA & self-report design",
    ],
    states: [
      "Mixed-methods research",
      "Behavioral trace analysis",
      "Thematic analysis",
    ],
    support: [
      "Intervention design",
      "Qualitative evaluation",
      "Safety boundary design",
    ],
  },
} as const;

export type UniverseNodeId = "signals" | "states" | "support" | "safety";

export type UniverseNode = {
  id: UniverseNodeId;
  label: string;
  color: string;
  satellites: readonly string[];
  narrative: {
    index: string;
    title: string;
    body: string;
  };
};

export const researchUniverse = {
  subtitle: "A 3D Research Universe",
  hero: {
    title: "From Signals to Support",
    subtitle: "Building human-centered systems for everyday mental wellbeing.",
    body: "Explore how everyday traces become emotional understanding and safe support.",
  },
  nodes: [
    {
      id: "signals",
      label: "Signals",
      color: "#8A9275",
      satellites: [
        "Conversational logs",
        "Self-reports",
        "Micro-interactions",
        "Behavioral traces",
      ],
      narrative: {
        index: "01",
        title: "Everyday traces of emotion and behavior",
        body: "I study conversational logs, self-reports, and micro-interactions as signals of stress, mood shifts, and daily wellbeing.",
      },
    },
    {
      id: "states",
      label: "States",
      color: "#7A8A9A",
      satellites: ["Stress", "Mood shifts", "Readiness", "Self-disclosure"],
      narrative: {
        index: "02",
        title: "Interpreting emotional and behavioral states",
        body: "These signals become meaningful when interpreted as states such as stress, anxiety, readiness, and self-disclosure.",
      },
    },
    {
      id: "support",
      label: "Support",
      color: "#B9786F",
      satellites: [
        "Reflection prompts",
        "Empathic responses",
        "Low-burden actions",
        "Safety boundaries",
      ],
      narrative: {
        index: "03",
        title: "Designing low-burden, empathic support",
        body: "The goal is to help people reflect, act, and receive support without increasing dependency or burden.",
      },
    },
    {
      id: "safety",
      label: "Safety",
      color: "#D4A59E",
      satellites: [
        "Autonomy",
        "Long-term wellbeing",
        "Responsible AI",
        "Boundaries",
      ],
      narrative: {
        index: "04",
        title: "Closed-loop safety over time",
        body: "Support systems must be sustainable, autonomy-preserving, and safe over time — evaluating retention, dependency risks, and adaptive boundaries.",
      },
    },
  ] as const satisfies readonly UniverseNode[],
  projectsSection: {
    index: "05",
    title: "Projects as evidence",
    body: "Each project supports a part of the signals-to-support pipeline — not a standalone demo.",
  },
} as const;

export type FocusCard = {
  title: string;
  body: string;
};

export type ResearchWorldZone = {
  id: string;
  label: string;
  title: string;
  body: string;
  projectIds?: string[];
  focusCards?: FocusCard[];
};

export const researchWorldAssets = {
  land: "/research-world-elements/rose-land/rose-land.png",
  tree: "/research-world-elements/rose-tree-milestone/rose-tree-compressed.glb",
  vine: "/research-world-elements/rose-vines/rose-vine-compressed.glb",
  figureWalk:
    "/research-world-elements/Rose_Girl_Rigged_biped/rose-figure-walk-compressed.glb",
  /** Optional P0 GLBs — procedural fallback when missing */
  entryPavilion:
    "/research-world-elements/entry-pavilion/entry-pavilion-compressed.glb",
  closedLoopCore:
    "/research-world-elements/closed-loop-core/loop-glow-ring-compressed.glb",
  loopRelief:
    "/research-world-elements/closed-loop-core/closed-loop-core-compressed.glb",
  observatoryPlatform:
    "/research-world-elements/observatory-platform/observatory-platform-compressed.glb",
  /** Optional P1 GLBs */
  signalsGardenBed:
    "/research-world-elements/signals-garden-bed/signals-garden-bed-compressed.glb",
  supportSanctuary:
    "/research-world-elements/support-sanctuary/support-sanctuary-compressed.glb",
  pathStone: "/research-world-elements/path-stone/path-stone-compressed.glb",
  explorerCloak:
    "/research-world-elements/explorer-cloak/explorer-cloak-compressed.glb",
  signalNodeIcon:
    "/research-world-elements/signal-node-icon/signal-node-icon-compressed.glb",
  /** Distinct zone landmarks (Meshy, Draco + webp + simplified) */
  moonGatePortal:
    "/research-world-elements/new-landmarks/moon-gate-portal.glb",
  roseCompassPlaza:
    "/research-world-elements/new-landmarks/rose-compass-plaza.glb",
  signalBeacon: "/research-world-elements/new-landmarks/signal-beacon.glb",
  signalBeaconOrb:
    "/research-world-elements/new-landmarks/signal-beacon-orb.glb",
  scholarGazebo: "/research-world-elements/new-landmarks/scholar-gazebo.glb",
  gardenDoor: "/research-world-elements/new-landmarks/garden-door.glb",
  loopGlowRing: "/research-world-elements/new-landmarks/loop-glow-ring-v2.glb",
  emotionPrismTower:
    "/research-world-elements/new-landmarks/emotion-prism-tower.glb",
  reflectionPond: "/research-world-elements/new-landmarks/reflection-pond.glb",
  gazebo: "/research-world-elements/new-landmarks/gazebo.glb",
  researchLanternTower:
    "/research-world-elements/new-landmarks/research-lantern-tower.glb",
  entryLanternTower:
    "/research-world-elements/new-landmarks/compressed/entry-lantern-tower.glb",
  thesisArchive: "/research-world-elements/new-landmarks/thesis-archive.glb",
  trellisArch: "/research-world-elements/new-landmarks/trellis-arch.glb",
  petalBench: "/research-world-elements/new-landmarks/petal-bench.glb",
  roseFountain: "/research-world-elements/new-landmarks/rose-fountain.glb",
  wildflowerMeadow:
    "/research-world-elements/new-landmarks/wildflower-meadow.glb",
  /** Sky-city set (Draco + webp compressed from Meshy) */
  pinkMoon: "/research-world-elements/new-landmarks/pink-moon.glb",
  roseAirship: "/research-world-elements/new-landmarks/rose-airship.glb",
  skyCastle: "/research-world-elements/new-landmarks/sky-castle.glb",
  /** v2 design landmarks (Draco compressed) */
  designLandmarks: {
    signalsGarden:
      "/research-world-elements/new-design-landmarks/compressed/ai-signal-garden.glb",
    statesObservatory:
      "/research-world-elements/new-design-landmarks/compressed/state-observatory.glb",
    supportSanctuary:
      "/research-world-elements/new-design-landmarks/compressed/intervention-sanctuary.glb",
    closedLoop:
      "/research-world-elements/new-design-landmarks/compressed/closed-loop.glb",
  },
  zonePlazas: {
    signals: "/research-world-elements/zone-plazas/signals-plaza.png",
    states: "/research-world-elements/zone-plazas/states-plaza.png",
    support: "/research-world-elements/zone-plazas/support-plaza.png",
  },
} as const;

export const researchWorld = {
  title: "Signals to Support",
  subtitle: "An Immersive Research World",
  intro:
    "Scroll through a rose-garden research trail — from everyday signals to emotional understanding and safe support.",
  entryBody:
    "Follow the path through Signals Garden, States Observatory, Support Sanctuary, and the Closed-loop Center.",
  entryCta: "Begin the journey",
  backLabel: "Back to Home",
  conventionalCta: "Want the conventional version?",
  zones: [
    {
      id: "entry",
      label: "Entry",
      title: "From Signals to Support",
      body: "A visual journey through how I connect sensing, interpretation, and empathic intervention in everyday mental wellbeing research.",
    },
    {
      id: "signals",
      label: "Signals Garden",
      title: "Everyday traces",
      body: "Signals are the everyday traces people already leave behind: micro-interactions, conversational patterns, and lightweight self-reports.",
      projectIds: ["mindful-scroll", "cosim", "harmony-forum"],
      focusCards: [
        {
          title: "Micro-interactions",
          body: "Swipe, pause, replay, scroll speed, and comment actions on short-form platforms.",
        },
        {
          title: "Conversational logs",
          body: "Support dialogues, disclosure cues, and emotional language in conversation.",
        },
        {
          title: "Daily self-reports",
          body: "EMA, stress, anxiety, sleep, and mood check-ins.",
        },
      ],
    },
    {
      id: "states",
      label: "States Observatory",
      title: "Emotional understanding",
      body: "I study how these signals can reveal stress, anxiety, emotional shifts, readiness, resistance, and self-disclosure.",
      projectIds: ["mindful-scroll", "misinfo-sharing"],
      focusCards: [
        {
          title: "Stress & anxiety",
          body: "Everyday, subclinical emotional burden across contexts.",
        },
        {
          title: "Mood shifts",
          body: "Short-term emotional changes and contextual triggers.",
        },
        {
          title: "Readiness & resistance",
          body: "When people are — or are not — ready for support.",
        },
        {
          title: "Self-disclosure",
          body: "How people reveal needs in conversation.",
        },
      ],
    },
    {
      id: "support",
      label: "Support Sanctuary",
      title: "Safe intervention",
      body: "The goal is not only prediction, but support: helping people translate reflection into safe, sustainable action.",
      projectIds: ["mindful-scroll", "cosim"],
      focusCards: [
        {
          title: "Reflection prompts",
          body: "Helping users notice patterns without cognitive overload.",
        },
        {
          title: "Low-burden actions",
          body: "Small achievable steps grounded in daily life.",
        },
        {
          title: "Safety boundaries",
          body: "Autonomy, dependency risk, and long-term wellbeing.",
        },
        {
          title: "Conversational support",
          body: "Empathic but not over-attached interaction.",
        },
      ],
    },
    {
      id: "loop",
      label: "Closed-loop Core",
      title: "Sustaining wellbeing",
      body: "Signals, states, and support continuously feed back through one system — sensing, interpreting, intervening, and sustaining everyday mental wellbeing over time.",
    },
  ] as ResearchWorldZone[],
} as const;

export type JourneyStop = {
  place: string;
  period: string;
  title: string;
  detail: string;
};

export const journey: JourneyStop[] = [
  {
    place: "Hefei, Anhui, China",
    period: "Roots",
    title: "Born in Hefei, Anhui",
    detail:
      "Where my curiosity about people, behavior, and the everyday systems that shape wellbeing first took root.",
  },
  {
    place: "Macau, China",
    period: "2016 – 2020",
    title: "B.Sc. in Applied Economics, MUST",
    detail: "Ranked 2/882 in the School of Business; foundations in statistics, behavioral economics, and game theory.",
  },
  {
    place: "New York, USA",
    period: "2021 – 2023",
    title: "M.S. in Applied Analytics, Columbia University",
    detail: "Research design, storytelling with data, and applied text & NLP analytics.",
  },
  {
    place: "Shanghai, China",
    period: "2023 – 2024",
    title: "Data Engineer, CIB Fintech",
    detail:
      "Full-time data engineer on enterprise big-data architecture projects, coordinating the overall organization and delivery of large-scale data-platform initiatives.",
  },
  {
    place: "Beijing, China",
    period: "2024",
    title: "Frontend Developer Intern",
    detail: "Led frontend of a RAG workflow platform; cut workflow creation time from 2 hours to 30 minutes.",
  },
  {
    place: "Sydney, Australia",
    period: "2025 – 2026",
    title: "M.S. in Information Technology, UNSW",
    detail: "Interactive design and web front-end programming. WAM 90.3 / High Distinction.",
  },
  {
    place: "Kunshan, China",
    period: "2026 – 2027",
    title: "Research Fellow, HII Lab, Duke Kunshan University",
    detail:
      "Leading Mindful-Scroll in three stages: dialogue-derived mental-state signals and modeling pipeline, SFV micro-interaction wellbeing modeling, then self-reflection intervention design for high-stress / high-anxiety use.",
  },
  {
    place: "Hong Kong, China",
    period: "Jun – Aug 2026",
    title:
      "Summer Research Intern, Studio for Narrative Spaces, CityU (Ray LC)",
    detail:
      "Joined Ray LC\u2019s group on a misinformation-sharing experiment: study-web layout and stimulus selection (posts / comments); data collection in progress, targeting CHI 2027.",
  },
];

export type NewsItem = {
  date: string;
  title?: string;
  text: string;
  tag?: "Talk" | "Paper" | "Role" | "Award" | "Manuscript";
  featured?: boolean;
};

export const news: NewsItem[] = [
  {
    date: "Aug 2026",
    title: "DMH Conference Book",
    text: "Planning a full paper on SFV micro-interaction signals for everyday stress and anxiety modeling — Springer conference book deadline August 31.",
    tag: "Manuscript",
  },
  {
    date: "Jul 2026",
    title: "HarmonyOS Forum Study",
    text: "Started an exploratory study of the Huawei HarmonyOS developer forum: crawl posts and comments, run topic modeling, and select research-ready themes around help-seeking and tooling.",
    tag: "Role",
  },
  {
    date: "Jul 2026",
    title: "IP&MC 2026",
    text: "Preparing a Mindful-Scroll manuscript on evening dialogue logs, a reflective-signal dataset, and the modeling pipeline — targeting the July 31 deadline.",
    tag: "Manuscript",
  },
  {
    date: "Jun 2026",
    title: "Summer Research Intern",
    text: "Joined Studio for Narrative Spaces at CityU under Ray LC and began the Misinformation Sharing project (study platform, stimulus design, and data collection).",
    tag: "Role",
    featured: true,
  },
  {
    date: "Jun 2026",
    title: "DMH 2026",
    text: "Presenting Mindful-Scroll at the Digital Mental Health International Conference in Hong Kong.",
    tag: "Talk",
    featured: true,
  },
  {
    date: "2026",
    title: "UIST 2026",
    text: "CoSim short paper (with the Tsinghua Pervasive HCI Group) is under review.",
    tag: "Paper",
    featured: true,
  },
  {
    date: "Feb 2026",
    title: "HII Lab",
    text: "Started as a full-time Research Fellow at Duke Kunshan University, advised by Prof. Yucheng Jin.",
    tag: "Role",
    featured: true,
  },
  {
    date: "Dec 2025",
    text: "Joined Tsinghua University's Pervasive HCI Group as a Research Intern.",
    tag: "Role",
  },
  {
    date: "2025",
    text: "Received Australia's Global University Award at UNSW.",
    tag: "Award",
  },
  {
    date: "2027 Target",
    text: "Targeting CHI 2027 with a Mindful-Scroll self-reflection intervention paper and a Misinformation Sharing behavioral experiment (data collection underway).",
    tag: "Manuscript",
  },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "news", label: "News" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "publications", label: "Publications" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;
