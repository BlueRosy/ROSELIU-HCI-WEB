/**
 * Single source of truth for all site content.
 * Edit copy here without touching components.
 *
 * TODO(assets) markers indicate items Rose still needs to provide.
 */

export const profile = {
  name: "Yanqing Liu",
  // TODO(assets): confirm current role / affiliation line
  role: "Research Fellow, HII Lab, Duke Kunshan University",
  email: "yanqing.liu2@dukekunshan.edu.cn",
  photo: "/Rose-PersonalImage/Rose1.jpg",
  heroPhoto: "/Rose-PersonalImage/Rose3.jpg",
  heroArt: "/Rose-PersonalImage/Rose-3D.png",
  aboutPhoto: "/Rose-PersonalImage/rose-columbia1.jpg",
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
  seekingPhd: false,
} as const;

export const hero = {
  headline: "From Signals to Support",
  headlineSub:
    "Building Data-Driven Human-Centered Systems for Everyday Mental Wellbeing",
  intro:
    "I study how users\u2019 digital signals, such as conversations and behavior, reveal emotional needs, and I build closed-loop systems that turn those signals into human-centered mental health support.",
  researchInterest: "",
  tags: ["Digital Wellbeing", "Conversational Support"],
} as const;

export const signalFlow = {
  pipeline: ["Signals", "States", "Support"] as const,
  stages: [
    {
      label: "Signals",
      items: [
        "Conversational logs",
        "Behavioral traces",
        "Micro-interactions",
        "Self-reports",
      ],
    },
    {
      label: "States",
      items: [
        "Psychological states",
        "Needs & readiness",
        "Resistance",
        "Self-disclosure",
      ],
    },
    {
      label: "Support",
      items: [
        "Reflection-to-action",
        "Adaptive intervention",
        "Empathic support",
        "Safety boundaries",
      ],
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
    "Data-driven human-centered systems for everyday wellbeing, reflection, and supportive behavior change, grounded in conversational, behavioral, self-report, and emerging multimodal signals.",
  vision: [
    "I build and study closed-loop systems that sense everyday psychological states and needs from conversational, behavioral, self-report, and contextual signals; interpret the mechanisms behind those signals; and translate them into timely, safe, and sustainable support.",
    "My longer-term direction is to explore multimodal signal integration for everyday wellbeing \u2014 combining digital traces with lightweight contextual and physiological cues to better understand when people need support, what kind of support is appropriate, and how to preserve autonomy over time. Rather than treating empathic AI as a one-time response generator, I am interested in how supportive systems can become long-term, safety-aware, and action-oriented.",
  ],
  themes: [
    {
      index: "01",
      title: "Adaptive Support Systems with Safety Boundaries",
      body: "I design and evaluate support systems within a sensing\u2013interpretation\u2013intervention\u2013maintenance loop. My work treats safety, autonomy, and long-term sustainability as design constraints that shape when, how, and how much support should be provided.",
    },
    {
      index: "02",
      title: "Multimodal Interaction Signals for Mechanism-Aware Support",
      body: "I study how conversational patterns, behavioral traces, lightweight self-reports, and contextual cues reveal users\u2019 states, needs, readiness, resistance, and decision mechanisms \u2014 and how these signals can guide personalized, low-burden, and controllable support strategies.",
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
    short: "Capture everyday signal streams",
    body: "Capture everyday signals from conversations, micro-interactions, self-reports, and emerging multimodal/contextual cues.",
    items: [
      "Conversational logs",
      "Behavioral traces",
      "Self-reports",
      "Contextual cues",
    ],
  },
  {
    key: "interpretation",
    label: "Interpretation",
    short: "From signals to mechanisms",
    body: "Model states, needs, readiness, and mechanisms across signal streams, while keeping explanations human-interpretable.",
    items: [
      "Psychological states",
      "Needs",
      "Resistance",
      "Readiness",
    ],
  },
  {
    key: "intervention",
    label: "Intervention Selection",
    short: "Choose adaptive support",
    body: "Select passive or active support strategies based on users\u2019 goals, risks, and readiness for action.",
    items: ["Passive vs. active support", "Timing", "Personalization"],
    current: true,
  },
  {
    key: "action",
    label: "Action",
    short: "Translate support into action",
    body: "Translate support into low-burden, trackable, and achievable everyday actions for reflection and self-regulation.",
    items: ["Low-burden steps", "Reflection-to-action", "Behavioral translation"],
  },
  {
    key: "sustainability",
    label: "Sustainability & Safety",
    short: "Maintain outcomes and boundaries",
    body: "Evaluate retention, wellbeing outcomes, autonomy, dependency risks, and adaptive safety boundaries over time.",
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
      "How can short-form video micro-interactions and evening self-reflection dialogues \u2014 as everyday digital signals \u2014 reveal wellbeing states, self-regulation patterns, and support needs, including stress and anxiety, and how should those signals shape safe, reflective interventions?",
    contribution:
      "A three-stage line: (1) evening Juanjuan dialogue logs \u2192 reflective behavioral-signal dataset and modeling pipeline for an LLM-assisted self-reflection assistant; (2) SFV-specific micro-interactions as everyday wellbeing-state signals, with stress and anxiety as key outcomes; (3) combine both into a self-reflection intervention for healthier SFV use. This project is a first step toward multimodal everyday wellbeing sensing, starting with micro-interactions and evening reflection dialogues \u2014 with a future direction of richer contextual and multimodal signals.",
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
    image: "/Mindful-Scroll/cover.jpg",
    gallery: [
      {
        src: "/Mindful-Scroll/gallery-study.jpg",
        alt: "Mindful Scroll study flow collage: consent, morning diary, and feed",
        caption: "Study day · consent to feed",
      },
      {
        src: "/Mindful-Scroll/gallery-support.jpg",
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
    status: "Study completed \u00b7 preparing next venue submission",
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
    context:
      "Pervasive HCI Group, Tsinghua University \u00b7 Huawei HarmonyOS Developer Forum \u00b7 exploratory, Jul 2026\u2013",
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
    image: "/websites/rose-stats-studio/cover.jpg",
    gallery: [
      {
        src: "/websites/rose-stats-studio/gallery-correlation.jpg",
        alt: "Correlation heatmap and bivariate scatter with regression",
        caption: "Correlation · heatmap & scatter",
      },
      {
        src: "/websites/rose-stats-studio/gallery-histogram.jpg",
        alt: "Histogram visualization with bin controls",
        caption: "Visualization · histogram",
      },
      {
        src: "/websites/rose-stats-studio/gallery-category.jpg",
        alt: "Category cross-tabulation with heatmap and stacked bars",
        caption: "Category · cross-tab analysis",
      },
      {
        src: "/websites/rose-stats-studio/gallery-regression.jpg",
        alt: "Regression model comparison and predicted vs actual plot",
        caption: "Regression · model comparison",
      },
      {
        src: "/websites/rose-stats-studio/gallery-scatter.jpg",
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
    image: "/websites/rose-research-world/cover.jpg",
    gallery: [
      {
        src: "/websites/rose-research-world/gallery-scholars.jpg",
        alt: "Scholar search and interest-to-advisor matching landing",
        caption: "Scholars · find & match",
      },
      {
        src: "/websites/rose-research-world/gallery-results.jpg",
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
    image: "/websites/meal-right/cover.jpg",
    gallery: [
      {
        src: "/websites/meal-right/gallery-onboarding.jpg",
        alt: "Meal Right onboarding collage: welcome, sign up, and log in",
        caption: "Onboarding · welcome to login",
      },
      {
        src: "/websites/meal-right/gallery-daily.jpg",
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
    venue: "Digital Mental Health International Conference (DMH), Hong Kong — Jun 2026",
    year: "2026",
    status: "Presentation",
    highlight: true,
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
  emerging: ["Multimodal everyday sensing"] as const,
  emergingNote:
    "As a longer-term direction, I hope to integrate conversational, behavioral, self-report, contextual, and lightweight physiological signals for more holistic, low-burden understanding of everyday wellbeing.",
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
    "I study how users\u2019 digital signals, such as conversations and behavior, reveal emotional needs, and I build closed-loop systems that turn those signals into human-centered mental health support.",
  /** Mobile About only — warm greeting under the formal name. */
  mobileGreeting: "Hi, I\u2019m Rose.",
  /** Mobile About only — closes the intro without repeating the desktop pullquote. */
  mobileGoal:
    "My goal is to create data-driven, human-centered systems for everyday mental wellbeing \u2014 timely, adaptive, and safety-aware.",
  lookingForward:
    "From current dialogue and behavioral signals, I want to move toward multimodal everyday sensing, adding contextual and lightweight physiological cues for adaptive, safety-aware support.",
  /** Kept for compatibility; homepage no longer renders a second interest paragraph. */
  researchInterest: "",
  /** Kept for compatibility; About no longer renders Focus chips. */
  researchAreas: ["Digital Wellbeing", "Conversational Support"] as const,
  phdAreas: "Digital Wellbeing · Multimodal Sensing · Conversational Support",
  methods: [
    "Conversational log analysis",
    "Behavioral modeling",
    "System prototyping",
    "Multimodal interaction sensing",
  ] as const,
  seekingLine: "HCI Researcher",
  researchWorldLink: {
    label: "Explore Research World",
    hint: "Scroll through an immersive trail from interaction signals to adaptive support",
    description:
      "Walk a rose-garden research trail from everyday signals to adaptive support.",
    tags: "Signals · States · Support",
    href: "/rose-research-world",
  },
} as const;

/** Top-nav Studio dropdown — quick jumps to built sites (not a full Projects story). */
export type StudioHubItem = {
  id: string;
  title: string;
  hint: string;
  href: string;
  external?: boolean;
  /** Hide in phone nav — 3D world is desktop-only. */
  desktopOnly?: boolean;
};

export const studioHub = {
  label: "Studio",
  items: [
    {
      id: "research-world",
      title: "Research World",
      hint: "3D trail · desktop only",
      href: "/rose-research-world",
      desktopOnly: true,
    },
    {
      id: "rose-stats-studio",
      title: "Rose Stats Studio",
      hint: "Browser-local stats & modeling",
      href: "https://rose-data-analysis.vercel.app/",
      external: true,
    },
    {
      id: "rose-literature",
      title: "Rose's Literature",
      hint: "Papers & scholar discovery",
      href: "https://rose-liternature-search.vercel.app/",
      external: true,
    },
    {
      id: "meal-right",
      title: "Meal Right",
      hint: "Calorie-tracking interface",
      href: "https://mealright.vercel.app/",
      external: true,
    },
  ] satisfies StudioHubItem[],
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
    subtitle:
      "Building data-driven human-centered systems for everyday mental wellbeing.",
    body: "Explore how everyday interaction traces become interpretable states, mechanisms, and safe adaptive support — toward multimodal everyday sensing.",
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
        title: "Everyday interaction traces",
        body: "I study conversational logs, self-reports, and micro-interactions as signals of states, needs, and everyday wellbeing — a foundation for emerging multimodal sensing.",
      },
    },
    {
      id: "states",
      label: "States",
      color: "#7A8A9A",
      satellites: [
        "Psychological states",
        "Needs & readiness",
        "Resistance",
        "Decision mechanisms",
      ],
      narrative: {
        index: "02",
        title: "Interpreting states and mechanisms",
        body: "These signals become meaningful when interpreted as needs, readiness, resistance, and decision mechanisms — with stress and anxiety as key wellbeing outcomes.",
      },
    },
    {
      id: "support",
      label: "Support",
      color: "#B9786F",
      satellites: [
        "Reflection prompts",
        "Adaptive interventions",
        "Low-burden actions",
        "Safety boundaries",
      ],
      narrative: {
        index: "03",
        title: "Designing safe, adaptive support",
        body: "The goal is to help people reflect, self-regulate, and receive support — including supportive online behavior — without increasing dependency or burden.",
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
    "Scroll through a rose-garden research trail — from everyday interaction signals to states, mechanisms, and safe adaptive support.",
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
      body: "A visual journey through how I connect sensing, interpretation, and adaptive support in everyday mental wellbeing research.",
    },
    {
      id: "signals",
      label: "Signals Garden",
      title: "Everyday traces",
      body: "Signals are the everyday traces people already leave behind — micro-interactions, conversational patterns, and lightweight self-reports — that become inputs for mechanism-aware support.",
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
          body: "EMA and check-ins where stress and anxiety appear as key wellbeing outcomes among broader state cues.",
        },
      ],
    },
    {
      id: "states",
      label: "States Observatory",
      title: "States & mechanisms",
      body: "I study how these signals can reveal states, needs, readiness, resistance, and decision mechanisms — not only prediction, but interpretable pathways to support.",
      projectIds: ["mindful-scroll", "misinfo-sharing"],
      focusCards: [
        {
          title: "Wellbeing outcomes",
          body: "Stress and anxiety as key outcomes within everyday, subclinical wellbeing contexts.",
        },
        {
          title: "Decision mechanisms",
          body: "How people share, skip, report, or act in online and conversational settings.",
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
      title: "Adaptive support",
      body: "The goal is not only prediction, but support for reflection, self-regulation, and supportive online behavior — safely and sustainably.",
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
          title: "Supportive interaction",
          body: "Empathic but not over-attached conversational and platform support.",
        },
      ],
    },
    {
      id: "loop",
      label: "Closed-loop Core",
      title: "Sustaining support",
      body: "Signals, states, and support continuously feed back through one system — sensing, interpreting, intervening, and sustaining safe adaptive support over time.",
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
      "Leading Mindful-Scroll in three stages: dialogue-derived wellbeing signals and modeling pipeline, SFV micro-interaction wellbeing-state modeling, then self-reflection intervention design — a first step toward multimodal everyday sensing.",
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
    date: "2027 Target",
    title: "Targeting CHI 2027",
    text: "Mindful-Scroll self-reflection intervention plus Misinformation Sharing behavioral experiment (data collection underway).",
    tag: "Manuscript",
    featured: true,
  },
  {
    date: "Aug 2026",
    title: "Writing DMH Book chapter",
    text: "SFV micro-interaction signals for everyday wellbeing-state modeling, with stress and anxiety as key outcomes — Springer conference book deadline August 31.",
    tag: "Manuscript",
    featured: true,
  },
  {
    date: "Jul 2026",
    title: "Submitting to IP&MC",
    text: "Mindful-Scroll evening dialogue logs, reflective-signal dataset, and modeling pipeline — targeting the July 31 deadline.",
    tag: "Manuscript",
    featured: true,
  },
  {
    date: "Jul 2026",
    title: "Started HarmonyOS forum study",
    text: "Exploratory crawl of Huawei HarmonyOS developer forum posts and comments with topic modeling to select research-ready themes around help-seeking and tooling (Tsinghua Pervasive HCI Group).",
    tag: "Role",
  },
  {
    date: "Jun 2026",
    title: "Joined Ray LC lab",
    text: "Summer Research Intern at CityU Studio for Narrative Spaces — Misinformation Sharing project (study platform, stimulus design, and data collection).",
    tag: "Role",
    featured: true,
  },
  {
    date: "Jun 2026",
    title: "Presented Mindful-Scroll at DMH",
    text: "Talk at the Digital Mental Health International Conference in Hong Kong.",
    tag: "Talk",
  },
  {
    date: "Feb 2026",
    title: "Joined HII Lab",
    text: "Started as a full-time Research Fellow at Duke Kunshan University, advised by Prof. Yucheng Jin.",
    tag: "Role",
  },
  {
    date: "Dec 2025",
    title: "Joined Tsinghua Pervasive HCI",
    text: "Research Intern in the Pervasive HCI Group at Tsinghua University.",
    tag: "Role",
  },
  {
    date: "2025",
    title: "Received UNSW award",
    text: "Australia's Global University Award at UNSW.",
    tag: "Award",
  },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "news", label: "News" },
  { id: "research", label: "Vision" },
  { id: "projects", label: "Projects" },
  { id: "publications", label: "Publications" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;
