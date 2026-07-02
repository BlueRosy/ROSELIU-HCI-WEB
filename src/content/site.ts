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
  /** cover = crop to frame; contain = show full mobile UI (Mindful Scroll). */
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
      "How can subtle interaction behaviors on social platforms reveal users\u2019 psychological states and inform timely wellbeing interventions?",
    contribution:
      "Links fine-grained interaction logs to self-reported wellbeing signals in a simulated short-form video platform, informing closed-loop intervention design.",
    methods: [
      "Behavioral log analysis",
      "Pattern mining",
      "Feature interpretation",
      "Intervention opportunity mapping",
    ],
    focus: ["Sensing", "Timing", "Low-burden intervention"],
    role: "Independently designed & built the simulated platform (React/JS, Dockerized); led the pilot study (N=32) and analysis pipeline.",
    status: "Presentation at DMH 2026 · CHI 2027 manuscript in preparation",
    accessType: "private",
    image: "/Mindful-Scroll/feed.png",
    imageFit: "contain",
    gallery: [
      {
        src: "/Mindful-Scroll/consent.png",
        alt: "Study consent and onboarding",
        caption: "Consent flow · once",
      },
      {
        src: "/Mindful-Scroll/startday-diary-daily.png",
        alt: "Morning wellbeing diary",
        caption: "Morning diary",
      },
      {
        src: "/Mindful-Scroll/feed.png",
        alt: "Simulated short-form video feed with interaction logging",
        caption: "Feed · micro-interactions",
      },
      {
        src: "/Mindful-Scroll/ema-diary.png",
        alt: "EMA diary check-in interface",
        caption: "EMA · state signals",
      },
      {
        src: "/Mindful-Scroll/endday-reflection.png",
        alt: "End-of-day reflection prompt",
        caption: "Evening reflection",
      },
      {
        src: "/Mindful-Scroll/chatbot-juanjuan-conversation.png",
        alt: "In-app conversational support chat",
        caption: "Conversational support",
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
    id: "caregiver",
    group: "research",
    projectType: "Study",
    title: "Risk Communication & AI Literacy in GenAI-Supported Parenting",
    context: "Caregiver AI-Literacy Study · Tsinghua University",
    question:
      "How can interactive GenAI tools improve parents\u2019 AI literacy and reduce moral disengagement in everyday parenting contexts?",
    contribution:
      "Links caregiving question themes in parent\u2013AI interactions to AI literacy and self-awareness, informing responsible caregiver-support design.",
    methods: [
      "Pre\u2013post survey",
      "Conversational log analysis",
      "OLS modeling",
      "Qualitative analysis",
    ],
    focus: ["AI literacy", "Moral disengagement", "Risk awareness", "Responsible AI"],
    role: "Developed an LLM-assisted topic-coding workflow with human correction; linked themes to participant profiles.",
    status: "CHI 2027 manuscript in preparation",
    accessType: "private",
    image: "/projects/caregiver.svg",
    links: [{ label: "Demo available upon request" }],
  },
  {
    id: "misinfo-sharing",
    group: "research",
    projectType: "Design Research",
    title: "Designing Social Platforms to Reduce Misinformation Sharing",
    context: "Studio for Narrative Spaces, City University of Hong Kong",
    question:
      "How do people respond differently to authentic versus misleading posts on social platforms, and how might platform design interrupt or reduce the sharing of misinformation?",
    contribution:
      "Compares behavioral responses to authentic vs. misleading posts across treatment conditions, informing responsible platform intervention design.",
    methods: [
      "Behavioral experiment design",
      "Treatment / control comparison",
      "Simulated platform development",
      "Interaction response analysis",
    ],
    focus: ["Misinformation", "Responsible AI", "Platform design", "Behavioral response"],
    role: "Building the simulated X / Instagram-style study platform and leading later analysis of how participants react to authentic versus misleading posts across treatment and control conditions. A longer-term goal is to explore LLM-based interventions that mitigate misinformation sharing.",
    status: "Early stage \u2014 study platform in development",
    accessType: "private",
    image: "/projects/misinfo-sharing.svg",
    links: [{ label: "Demo available upon request" }],
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
    image: "/rose-stats-studio/cover.png",
    gallery: [
      {
        src: "/rose-stats-studio/gallery-correlation.png",
        alt: "Correlation heatmap and bivariate scatter with regression",
        caption: "Correlation · heatmap & scatter",
      },
      {
        src: "/rose-stats-studio/gallery-histogram.png",
        alt: "Histogram visualization with bin controls",
        caption: "Visualization · histogram",
      },
      {
        src: "/rose-stats-studio/gallery-category.png",
        alt: "Category cross-tabulation with heatmap and stacked bars",
        caption: "Category · cross-tab analysis",
      },
      {
        src: "/rose-stats-studio/gallery-regression.png",
        alt: "Regression model comparison and predicted vs actual plot",
        caption: "Regression · model comparison",
      },
      {
        src: "/rose-stats-studio/gallery-scatter.png",
        alt: "Bivariate scatter plot with correlation statistics",
        caption: "Bivariate · fit & significance",
      },
    ],
    links: [{ label: "Open live app", href: "https://rose-data-analysis.vercel.app/" }],
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
    image: "/meal-right/cover.png",
    imageFit: "contain",
    gallery: [
      {
        src: "/meal-right/gallery-welcome.png",
        alt: "Meal Right welcome landing page",
        caption: "Welcome · brand entry",
      },
      {
        src: "/meal-right/gallery-signup.png",
        alt: "Sign-up form with hand-drawn characters",
        caption: "Sign up · onboarding",
      },
      {
        src: "/meal-right/gallery-login.png",
        alt: "Login screen with character illustration",
        caption: "Log in · return visit",
      },
      {
        src: "/meal-right/gallery-food-bag.png",
        alt: "Food bag dashboard with cooking illustration",
        caption: "Food bag · daily summary",
      },
      {
        src: "/meal-right/gallery-add-food.png",
        alt: "Search for meals to add to food bag",
        caption: "Add food · meal search",
      },
      {
        src: "/meal-right/gallery-diary.png",
        alt: "Calorie diary empty state",
        caption: "Cal diary · save foodbag",
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
      "Simulated Douyin-Style Short Video: Linking Interaction Logs to Self-Reported Mental Health and Well-Being, and In-App Interventions.",
    venue: "CHI (Full Paper) — targeting 2027",
    year: "2027",
    status: "Target Venue",
  },
  {
    authors: "Liu, Y., Zhu, Y., & Jin, Y.",
    title:
      "A Conversational AI Agent for Short-Form Video Use: Dialogue-Derived Features for Improving Stress and Anxiety Prediction.",
    venue: "Information Processing & Management Conference (IP&MC), Dataset & Full Paper",
    year: "2026",
    status: "In Preparation",
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
    label: "Explore Research Universe",
    hint: "A cinematic 3D atlas of my research from signals to support",
    description:
      "A scroll-driven 3D research universe mapping everyday signals to empathic, safety-aware support.",
    tags: "Signals · States · Support · Safety · Closed-loop",
    href: "/signals-to-support",
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
      projectId: "caregiver",
      mapping: "Support + Safety",
      zones: ["support"] as const,
    },
    {
      projectId: "misinfo-sharing",
      mapping: "Responsible platform design",
      zones: [] as const,
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
  zonePlazas: {
    signals: "/research-world-elements/zone-plazas/signals-plaza.png",
    states: "/research-world-elements/zone-plazas/states-plaza.png",
    support: "/research-world-elements/zone-plazas/support-plaza.png",
  },
} as const;

export const researchWorld = {
  title: "Signals to Support",
  subtitle: "A 3D Research Universe",
  intro:
    "A visual atlas of how my work connects everyday digital traces, emotional states, and safe empathic support.",
  entryBody:
    "Click through the research pipeline — from signals to states to support — and see how projects evidence a closed-loop agenda.",
  entryCta: "Explore the atlas",
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
      projectIds: ["mindful-scroll", "cosim", "caregiver"],
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
      projectIds: ["mindful-scroll", "cosim", "caregiver"],
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
      label: "Closed-loop Bridge",
      title: "Sustaining wellbeing",
      body: "Across my work, I ask how human-centered systems can sense, interpret, support, and sustain everyday mental wellbeing over time.",
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
    title: "Data Engineer, CIB Fintech (兴业数金)",
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
    detail: "Leading a two-phase study on short-form video behavior, mental wellbeing signals, and in-app interventions.",
  },
  {
    place: "Hong Kong, China",
    period: "Jun – Aug 2026",
    title: "Summer Research Assistant, Studio for Narrative Spaces, CityU",
    detail: "Built a simulated social media study platform to compare how participants respond to authentic versus misleading posts across treatment and control conditions; supporting platform development and subsequent behavioral analysis.",
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
    text: "Preparing two manuscripts targeting CHI 2027 on short-form video wellbeing and caregiver AI literacy.",
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
