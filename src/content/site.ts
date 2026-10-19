/**
 * Single source of truth for all site content.
 * Edit copy here without touching components.
 *
 * TODO(assets) markers indicate items Rose still needs to provide.
 */

export const profile = {
  name: "Yanqing Liu",
  shortName: "Rose",
  role: "Research Fellow, Hybrid Interactive Intelligence (HII) Lab, Duke Kunshan University",
  roleShort: "Research Fellow · HII Lab · Duke Kunshan University",
  email: "yanqing.liu2@dukekunshan.edu.cn",
  photo: "/Rose-PersonalImage/Rose1.jpg",
  heroPhoto: "/Rose-PersonalImage/Rose3.jpg",
  heroArt: "/Rose-PersonalImage/Rose-3D.png",
  aboutPhoto: "/Rose-PersonalImage/rose-columbia3.jpg",
  heroMode: "illustration" as const,
  heroIllustration: "/Rose-PersonalImage/h5.png",
  avatar3d: "/Rose-PersonalImage/chibi-reading.glb",
  heroParallax: "/Rose-PersonalImage/h1.png",
  cv: "/Yanqing_Liu_CV.pdf",
  socials: {
    github: "https://github.com/BlueRosy",
    linkedin: "https://www.linkedin.com/in/yanqing-liu-rose",
  },
  seekingPhd: true,
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
  | "Design Research"
  | "Review";

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
  /** Shorter title for compact About rows. */
  shortTitle?: string;
  context: string;
  question: string;
  contribution: string;
  /** 1–2 sentence summary for About / Side Project lists. */
  blurb: string;
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
    id: "sensing-adaptation",
    group: "research",
    projectType: "Review",
    title:
      "From Sensing to Adaptation: A Scoping Review of Physiological Indicators of Learner States for Adaptive Learning Support",
    shortTitle: "Physiological Sensing for Learner States & Adaptive Learning",
    context:
      "Research Collaborator · Singapore Management University · Prof. Fiona Fui-Hoon Nah",
    question:
      "How do physiological indicators relate to learner states, and how do studies move from sensing and validation to adaptive learning support and evaluation?",
    blurb:
      "Scoping review of physiological sensing for learner states and adaptive learning systems — from validation of state inference to whether adaptations use that signal.",
    contribution:
      "Maps how EEG, HRV, EDA, pupil size and related measures are used to infer learner states, how inferences are validated, and whether adaptations demonstrate the added value of physiological input (JBI / PRISMA-ScR; 5,211 unique Scopus records).",
    methods: [
      "Scoping review (JBI, PRISMA-ScR)",
      "Protocol design",
      "Scopus search & screening",
      "Evidence charting",
    ],
    focus: [
      "Physiological sensing",
      "Learner states",
      "Adaptive learning",
      "Evidence synthesis",
    ],
    role: "Lead author; designed protocol and iteratively tested Scopus search; ran a 200-record screening pilot.",
    status: "HCII 2027 accepted · full paper in preparation",
    accessType: "private",
    image: "/projects/sensing-adaptation.svg",
    gallery: [
      {
        src: "/projects/sensing-adaptation.svg",
        alt: "Scoping review pathway: physiological sensing to adaptive learning",
      },
    ],
    links: [],
  },
  {
    id: "mindful-scroll",
    group: "research",
    projectType: "System",
    title: "From Social Media Micro-Interactions to Mental State Cues",
    shortTitle: "Mindful Scroll",
    context: "Mindful Scroll · HII Lab, Duke Kunshan University · Prof. Yucheng Jin",
    question:
      "How can short-form video micro-interactions and evening self-reflection dialogues \u2014 as everyday digital signals \u2014 reveal wellbeing states, self-regulation patterns, and support needs, including stress and anxiety, and how should those signals shape safe, reflective interventions?",
    blurb:
      "Studies how short-form video micro-interactions and LLM-mediated reflection dialogues inform stress/anxiety signals and negotiable self-reflection design.",
    contribution:
      "Built a React/Docker SFV platform with logging, self-reports, and reflection dialogues; ran a 14-day field study (n=41; 44,420 views; 113,233 events) and interviews examining reflective demand, timing, and burden.",
    methods: [
      "Conversational log analysis",
      "Topic modeling",
      "Predictive / longitudinal modeling",
      "Micro-interaction sensing",
      "Field study & interviews",
    ],
    focus: [
      "Dialogue signals",
      "Micro-interactions",
      "Mental-state modeling",
      "Self-reflection intervention",
    ],
    role: "Independently designed & built the platform; led pilot (n=32), field study (n=41), analysis pipelines, and 12 participant interviews.",
    status: "DMH 2026 presented · CHI 2027 under review · journal in revision",
    accessType: "private",
    image: "/Mindful-Scroll/cover.jpg",
    imageFit: "cover",
    gallery: [
      {
        src: "/Mindful-Scroll/cover.jpg",
        alt: "Mindful Scroll prototype: feed, journal, and Juanjuan dialogue",
        caption: "Prototype · feed to reflection",
      },
      {
        src: "/Mindful-Scroll/gallery-study.jpg",
        alt: "Mindful Scroll study flow: consent, diary, and short-video feed",
        caption: "Study flow · consent to feed",
      },
      {
        src: "/Mindful-Scroll/gallery-support.jpg",
        alt: "Mindful Scroll support and reflection screens",
        caption: "Support · evening reflection",
      },
    ],
    links: [{ label: "Demo available upon request" }],
  },
  {
    id: "cosim",
    group: "research",
    projectType: "Study",
    title: "Conversational Patterns in Counselor\u2013Student Support Simulations",
    shortTitle: "CoSim",
    context: "CoSim · Pervasive HCI Group, Tsinghua University · Dr. Jie Cai",
    question:
      "How do emotional cues, resistance, and self-disclosure emerge in simulated counselor\u2013student conversations, and how can these patterns inform better support strategies?",
    blurb:
      "Analyzes simulated counselor–student dialogues to identify communication patterns that can inform conversational support design.",
    contribution:
      "Identifies facilitative vs. hindering communication patterns in simulated peer support, informing simulation-based feedback for university student supporters (Fudaoyuan).",
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
    role: "Built a trajectory–thematic pipeline across 10 supporters / 19 sessions; co-authoring CHI 2027 LBW.",
    status: "CHI 2027 LBW in preparation",
    accessType: "private",
    image: "/projects/cosim-flow.svg",
    gallery: [
      {
        src: "/projects/cosim-flow.svg",
        alt: "CoSim dialogue analysis flow",
      },
    ],
    links: [{ label: "Sanitized walkthrough upon request" }],
  },
  {
    id: "misinfo-sharing",
    group: "research",
    projectType: "Design Research",
    title: "Designing Social Platforms to Reduce Misinformation Sharing",
    shortTitle: "Misinformation Sharing",
    context:
      "Studio for Narrative Spaces · CityU · Ray LC & Fiona Nah (Summer Research Intern, Jun–Aug 2026)",
    question:
      "Do treatment vs. control comment conditions change how people react to authentic and misleading-but-funny posts \u2014 via repost, share, report, or skip \u2014 and what mechanisms drive those shifts?",
    blurb:
      "Examines how comment conditions on a simulated social platform shape credibility judgments and sharing behavior.",
    contribution:
      "Led front-end for a between-subjects feed experiment and GEE analysis of 1,200 post-level decisions (n=60); found believing a post false strongly raised reporting odds.",
    methods: [
      "Behavioral experiment design",
      "Treatment / control comparison",
      "Simulated platform development",
      "GEE modeling",
    ],
    focus: [
      "Misinformation",
      "Comment interventions",
      "Platform design",
      "Behavioral response",
    ],
    role: "Led front-end development and quantitative analysis; co-authoring CHI 2027 LBW.",
    status: "Analysis complete · CHI 2027 LBW in preparation",
    accessType: "private",
    image: "/projects/misinfo-flow.svg",
    gallery: [
      {
        src: "/projects/misinfo-flow.svg",
        alt: "Misinformation experiment flow",
      },
    ],
    links: [{ label: "Demo available upon request" }],
  },
  {
    id: "rose-stats-studio",
    group: "tool",
    projectType: "Tool",
    title: "Rose Stats Studio",
    shortTitle: "Rose Stats Studio",
    context: "Browser-local statistics & modeling workbench",
    question:
      "A research-focused, Tableau-like workbench that runs entirely in the browser \u2014 statistics, correlation, and regression with data that never leaves the device.",
    blurb:
      "Browser-local stats workbench for correlation, visualization, and regression — data never leaves the device.",
    contribution:
      "Demonstrates browser-local data analysis and visualization for privacy-sensitive research workflows.",
    methods: ["DuckDB-WASM", "React + TypeScript", "ECharts", "Statistical modeling"],
    focus: ["Data analysis", "Visualization", "Regression / model comparison"],
    accessType: "public",
    image: "/websites/rose-stats-studio/cover.jpg",
    imageFit: "cover",
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
    shortTitle: "Rose's Literature",
    context: "Literature & scholar discovery for HCI researchers",
    question:
      "Google Scholar finds everything; this finds the right thread \u2014 and the right person. OpenAlex- and DBLP-backed search with method-aware filters, then LLM-assisted matching between your research interests and a scholar's profile before you reach out.",
    blurb:
      "Literature and scholar discovery with method-aware filters and interest-to-advisor matching for HCI research workflows.",
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
    imageFit: "cover",
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
    shortTitle: "Meal Right",
    context: "Daily calorie-tracking interface",
    question:
      "A calorie-tracking app emphasizing information hierarchy, visual feedback, and low cognitive load during everyday meal logging.",
    blurb:
      "Calorie-tracking UI focused on clear hierarchy, visual feedback, and low cognitive load for everyday logging.",
    contribution:
      "Explores low cognitive load and clear information hierarchy in everyday health-tracking interfaces.",
    methods: ["React", "HCI design patterns", "Responsive UI"],
    focus: ["Information hierarchy", "Visual feedback", "Accessibility"],
    accessType: "public",
    image: "/websites/meal-right/cover.jpg",
    imageFit: "cover",
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
  | "Accepted"
  | "Under Review"
  | "In Preparation"
  | "In Revision"
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
      "From Sensing to Adaptation: A Scoping Review of Physiological Indicators of Learner States for Adaptive Learning Support.",
    venue: "HCI International 2027 (HCII 2027), Springer — accepted; full paper in preparation",
    year: "2027",
    status: "Accepted",
    highlight: true,
  },
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
    authors: "Liu, Y., Zhou, W., Zhu, Y., Zhao, X., & Jin, Y.",
    title:
      "Negotiating Reflective Demand: LLM-Mediated Reflection on Everyday Short-Form Video Use.",
    venue: "CHI 2027 — under review",
    year: "2027",
    status: "Under Review",
    highlight: true,
  },
  {
    authors: "Liu, Y., Zhu, Y., & Jin, Y.",
    title:
      "Exploring Candidate Signals of Perceived Stress and Anxiety in Short-Form Video Use: Scrolling Logs and Use-Specific Appraisals.",
    venue:
      "DMH Conference Book: Maximizing the Real-World Potential of Digital Mental Health, Springer Nature — under review",
    year: "2026",
    status: "Under Review",
  },
  {
    authors: "Liu, Y., Zhu, Y., & Jin, Y.",
    title:
      "Beyond Social-Media Posts: Conversational Reflection Signals of Daily Perceived Stress and Anxiety in Short-Form Video Use.",
    venue: "Journal manuscript — in revision for resubmission",
    year: "2026",
    status: "In Revision",
  },
  {
    authors: "Wang, Y., Liu, Y., & Ray, L. C.",
    title:
      "“Like Fire Alarm Promotes Waking Up”: How Humor Can Affect User Engagement with Misinformation on Social Media.",
    venue: "CHI 2027 Late-Breaking Work — in preparation",
    year: "2027",
    status: "In Preparation",
  },
  {
    authors: "Deng, W., Liu, Y., Chen, Y., Zhang, H., Li, Y., Mi, H., & Yu, C.",
    title:
      "LLM-Based Simulation to Support Student Academic and Life Supporters (Fudaoyuan) at Chinese Universities.",
    venue: "CHI 2027 Late-Breaking Work — in preparation",
    year: "2027",
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
  greeting: "Hi, I\u2019m Rose.",
  /** Kept for older mobile helpers. */
  mobileGreeting: "Hi, I\u2019m Rose.",
  /**
   * Compact bio for About (≈7s scan). Bold topics rendered via about.topics.
   * Paragraphs are short on purpose — PhD-application clarity over product narrative.
   */
  /** Narrow intro column (Anna-style short measure). */
  paragraphs: [
    "I am currently a Research Fellow in the Hybrid Interactive Intelligence (HII) Lab at Duke Kunshan University. My research lies at the intersection of human–AI interaction, multimodal sensing, and adaptive systems, focusing on how interaction, conversational, and physiological data can reveal users’ momentary cognitive and emotional states, and how AI systems can adapt to those states to support learning, work, decision-making, and well-being.",
    "Methodologically, I combine quantitative and computational approaches — survey and behavioral-log analysis, NLP, topic and predictive modeling, longitudinal analysis — with qualitative thematic analysis and the development of web-based research tools.",
  ],
  /** Wider Projects band intro — sensing/adaptation mainline + related work. */
  projectsIntro:
    "My current projects center on sensing and adapting to users’ momentary states — from short-form video logs and reflection dialogues that surface stress and self-regulation needs, to physiological learner-state indicators for adaptive learning, alongside related work on supportive counseling communication and misinformation sharing. Across these directions, I am interested in AI systems that respond more proactively to users’ needs and better support learning, well-being, and trust.",
  topics: [
    "human–AI interaction",
    "multimodal sensing",
    "adaptive systems",
    "learning, work, decision-making, and well-being",
  ] as const,
  seekingLine:
    "I am seeking PhD opportunities in HCI and related areas where computational methods and sensing are used to understand human states and design adaptive, supportive technologies.",
  /** @deprecated Removed from UI; kept briefly for legacy imports. */
  lookingForward: "",
  intro:
    "My research lies at the intersection of human–AI interaction, multimodal sensing, and adaptive systems.",
  mobileGoal: "",
  researchInterest: "",
  researchAreas: [
    "Human–AI interaction",
    "Multimodal sensing",
    "Adaptive systems",
    "Learning & well-being",
  ] as const,
  phdAreas:
    "HCI · Human–AI interaction · Multimodal sensing · Adaptive systems",
  methods: [
    "Survey & behavioral-log analysis",
    "NLP / topic & predictive modeling",
    "Longitudinal analysis",
    "Thematic analysis",
    "Scoping review",
    "Web-based research tools",
  ] as const,
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
      projectId: "sensing-adaptation",
      mapping: "Sensing → Adaptation",
      zones: ["signals", "states", "support"] as const,
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
      projectIds: ["mindful-scroll", "cosim", "sensing-adaptation"],
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
    place: "Beijing, China",
    period: "Aug – Dec 2024",
    title: "Frontend Developer Intern, Puppy Agent",
    detail:
      "Built an enterprise RAG workflow platform (ReactFlow + Monaco); cut workflow creation time from 2 hours to 30 minutes.",
  },
  {
    place: "Sydney, Australia",
    period: "2025 – 2026",
    title: "Graduate Certificate in IT, UNSW",
    detail:
      "Exit award from the Master of IT. Interactive design, data structures, and web front-end. GPA 90.3 / High Distinction.",
  },
  {
    place: "Beijing, China",
    period: "Sep 2025 – Present",
    title: "Research Collaborator, Pervasive HCI Group, Tsinghua",
    detail:
      "CoSim dialogue-log analysis for university student supporters (Fudaoyuan) with Dr. Jie Cai; co-authoring CHI 2027 LBW.",
  },
  {
    place: "Kunshan, China",
    period: "Feb 2026 – Present",
    title: "Research Fellow, HII Lab, Duke Kunshan University",
    detail:
      "Lead Mindful Scroll (Prof. Yucheng Jin): SFV platform, 14-day field study (n=41), LLM-mediated reflection, and stress/anxiety signal modeling toward CHI 2027.",
  },
  {
    place: "Hong Kong, China",
    period: "Jun – Aug 2026",
    title:
      "Summer Research Intern, Studio for Narrative Spaces, CityU",
    detail:
      "Advisors: Prof. Ray LC and Prof. Fiona Fui-Hoon Nah. Led front-end and GEE analysis for a misinformation comment experiment (n=60); CHI 2027 LBW in preparation.",
  },
  {
    place: "Singapore",
    period: "Sep 2026 – Present",
    title: "Research Collaborator, SMU (Prof. Fiona Nah)",
    detail:
      "Lead a scoping review of physiological learner-state indicators for adaptive learning support — HCII 2027 accepted; full paper in preparation.",
  },
];

export type NewsItem = {
  date: string;
  title?: string;
  text: string;
  tag?: "Talk" | "Paper" | "Role" | "Award" | "Manuscript" | "Planned";
  featured?: boolean;
  /** When true, skip CompactNews recent window (e.g. far book deadlines). */
  hideFromRecent?: boolean;
};

export const news: NewsItem[] = [
  {
    date: "Oct 2026",
    title: "HCII 2027 paper accepted",
    text: "Scoping review on physiological learner-state indicators for adaptive learning accepted at HCII 2027.",
    tag: "Paper",
    featured: true,
  },
  {
    date: "Sep 2026",
    title: "Joined SMU collaboration",
    text: "Research collaborator with Prof. Fiona Fui-Hoon Nah on sensing-to-adaptation review work.",
    tag: "Role",
    featured: true,
  },
  {
    date: "Sep 2026",
    title: "CHI 2027 paper under review",
    text: "Negotiating Reflective Demand: LLM-mediated reflection on everyday short-form video use.",
    tag: "Manuscript",
    featured: true,
  },
  {
    date: "Sep 2026",
    title: "DMH book chapter under review",
    text: "Scrolling logs and use-specific appraisals as candidate stress/anxiety signals.",
    tag: "Manuscript",
    featured: true,
  },
  {
    date: "Aug 2026",
    title: "Journal manuscript in revision",
    text: "Conversational reflection signals of daily perceived stress and anxiety in SFV use.",
    tag: "Manuscript",
    featured: true,
  },
  {
    date: "Aug 2026",
    title: "CityU misinfo analysis wrapped",
    text: "GEE analysis of 1,200 decisions (n=60); CHI 2027 LBW with Ray LC in preparation.",
    tag: "Manuscript",
    featured: true,
  },
  {
    date: "Jun 2026",
    title: "Presented Mindful Scroll at DMH",
    text: "Talk at the Digital Mental Health International Conference in Hong Kong.",
    tag: "Talk",
    featured: true,
  },
  {
    date: "Jun 2026",
    title: "CityU summer research intern",
    text: "Studio for Narrative Spaces with Prof. Ray LC and Prof. Fiona Nah.",
    tag: "Role",
    featured: true,
  },
  {
    date: "Feb 2026",
    title: "Joined HII Lab",
    text: "Research Fellow at Duke Kunshan University with Prof. Yucheng Jin.",
    tag: "Role",
  },
  {
    date: "Sep 2025",
    title: "Joined Tsinghua Pervasive HCI",
    text: "Research collaborator on CoSim with Dr. Jie Cai.",
    tag: "Role",
  },
  {
    date: "2025",
    title: "Received UNSW award",
    text: "Australia’s Global University Award at UNSW.",
    tag: "Award",
  },
];

/** Top-level page routes (multi-page IA for PhD clarity). */
export const nav = [
  { id: "about", label: "About", href: "/" },
  { id: "side-projects", label: "Side Project", href: "/side-projects" },
  { id: "cv", label: "CV", href: "/cv" },
  { id: "journey", label: "Journey", href: "/journey" },
] as const;
