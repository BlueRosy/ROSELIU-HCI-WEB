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
  cv: "/Yanqing_Liu_CV.pdf",
  // TODO(assets): confirm social links
  socials: {
    github: "https://github.com/", // TODO
    linkedin: "https://www.linkedin.com/", // TODO
    scholar: "https://scholar.google.com/", // TODO
  },
  // Toggle the "seeking PhD opportunities" line in About
  seekingPhd: true,
} as const;

export const hero = {
  headline: "From Signals to Support",
  headlineSub: "Building Human-Centered Systems for Everyday Mental Wellbeing",
  intro:
    "I'm Rose — an HCI researcher and Research Fellow at Duke Kunshan University's HII Lab. I study how conversational and behavioral patterns reveal stress and emotional states, and how these signals can inform safe, long-term, empathic interventions.",
  researchInterest:
    "Closed-loop systems for everyday mental wellbeing: sensing stress from conversational and behavioral signals, interpreting mechanisms, selecting support strategies, and helping users translate reflection into sustainable action.",
  subheadline:
    "I study how conversational and behavioral patterns reveal stress and emotional states, and how these signals can inform safe, long-term, empathic interventions.",
  tags: [
    "Human-Centered AI",
    "Digital Wellbeing",
    "Conversational Support",
    "HCI",
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
  current?: boolean;
};

export const loop: LoopNode[] = [
  {
    key: "sensing",
    label: "Sensing",
    short: "Identify state cues from signals",
    body: "Identify stress, emotional shifts, resistance, and self-disclosure from conversational and behavioral signals.",
  },
  {
    key: "interpretation",
    label: "Interpretation",
    short: "From what happened to why",
    body: "Move from \u201Cwhat happened\u201D to \u201Cwhy it happened\u201D by examining triggers, relationship dynamics, and individual differences.",
  },
  {
    key: "intervention",
    label: "Intervention Selection",
    short: "Choose passive or active support",
    body: "Select passive or active support strategies based on users\u2019 goals, risks, and readiness for action.",
    current: true,
  },
  {
    key: "action",
    label: "Action",
    short: "Translate support into action",
    body: "Translate empathic support into low-burden, trackable, and achievable everyday actions.",
  },
  {
    key: "sustainability",
    label: "Sustainability & Safety",
    short: "Maintain outcomes and boundaries",
    body: "Evaluate retention, emotional outcomes, autonomy, dependency risks, and adaptive safety boundaries over time.",
  },
];

export type AccessType = "public" | "demo" | "private";

export type ProjectLink = {
  label: string;
  href?: string; // omit for "upon request" style chips
};

export type Project = {
  id: string;
  group: "research" | "tool";
  title: string;
  context: string;
  question: string;
  methods: string[];
  focus: string[];
  role?: string;
  status?: string;
  accessType: AccessType;
  // TODO(assets): place sanitized screenshots at public/projects/<image>
  image?: string;
  links: ProjectLink[];
};

const RESTRICTED_NOTE =
  "Live demo restricted due to ongoing research protocols. Screenshots and a sanitized walkthrough are available upon request.";

export const projects: Project[] = [
  {
    id: "mindful-scroll",
    group: "research",
    title: "From Social Media Micro-Interactions to Mental State Cues",
    context: "Mindful Scroll · HII Lab, Duke Kunshan University",
    question:
      "How can subtle interaction behaviors on social platforms reveal users\u2019 psychological states and inform timely wellbeing interventions?",
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
    image: "/projects/mindful-scroll.svg",
    links: [{ label: "Demo available upon request" }],
  },
  {
    id: "cosim",
    group: "research",
    title: "Conversational Patterns in Counselor\u2013Student Support Simulations",
    context: "CoSim · Pervasive HCI Group, Tsinghua University",
    question:
      "How do emotional cues, resistance, and self-disclosure emerge in simulated counselor\u2013student conversations, and how can these patterns inform better support strategies?",
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
    title: "Risk Communication & AI Literacy in GenAI-Supported Parenting",
    context: "Caregiver AI-Literacy Study · Tsinghua University",
    question:
      "How can interactive GenAI tools improve parents\u2019 AI literacy and reduce moral disengagement in everyday parenting contexts?",
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
    title: "Designing Social Platforms to Reduce Misinformation Sharing",
    context: "Studio for Narrative Spaces, City University of Hong Kong",
    question:
      "How do people respond differently to authentic versus misleading posts on social platforms, and how might platform design interrupt or reduce the sharing of misinformation?",
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
    title: "Rose Stats Studio",
    context: "Browser-local statistics & modeling workbench",
    question:
      "A research-focused, Tableau-like workbench that runs entirely in the browser \u2014 statistics, correlation, and regression with data that never leaves the device.",
    methods: ["DuckDB-WASM", "React + TypeScript", "ECharts", "Statistical modeling"],
    focus: ["Data analysis", "Visualization", "Regression / model comparison"],
    accessType: "public",
    image: "/projects/rose-stats-studio.svg",
    links: [
      // TODO(assets): add live URL + GitHub
      { label: "Open live app", href: "#" },
      { label: "Code", href: "#" },
    ],
  },
  {
    id: "meal-right",
    group: "tool",
    title: "Meal Right",
    context: "Daily calorie-tracking interface",
    question:
      "A calorie-tracking app emphasizing information hierarchy, visual feedback, and low cognitive load during everyday meal logging.",
    methods: ["React", "HCI design patterns", "Responsive UI"],
    focus: ["Information hierarchy", "Visual feedback", "Accessibility"],
    accessType: "public",
    image: "/projects/meal-right.svg",
    links: [
      // TODO(assets): add live URL + GitHub
      { label: "Open live app", href: "#" },
      { label: "Code", href: "#" },
    ],
  },
];

export const restrictedNote = RESTRICTED_NOTE;

export type PubStatus =
  | "Presentation"
  | "Under Review"
  | "In Preparation";

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
    venue: "CHI (Full Paper)",
    year: "2027",
    status: "In Preparation",
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
  methods: [
    "Conversational log analysis",
    "Behavioral trace analysis",
    "Thematic analysis",
    "Survey design & pre\u2013post evaluation",
    "Regression (OLS / logistic)",
    "Topic modeling",
    "Mixed-methods research",
    "Intervention design & evaluation",
  ],
  // Rendered with an "emerging" badge; never claimed as a mature capability.
  emerging: [
    "Multimodal analysis",
  ],
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
  areas: [
    "HCI",
    "Human-centered AI",
    "Emotional & social computing",
    "Digital wellbeing",
    "Conversational support",
    "Responsible AI",
  ],
} as const;

export const about = {
  bio: [
    "I am an HCI researcher interested in data-driven digital systems for everyday mental wellbeing. My work examines how conversational and behavioral patterns can reveal stress, emotional shifts, resistance, and self-disclosure, and how these signals can inform safe, sustainable, and empathic interventions.",
    "Methodologically, I combine conversational log analysis, behavioral trace analysis, mixed-methods research, and lightweight system prototyping. I am particularly interested in reflection-to-action mechanisms: how digital support can help people move from emotional awareness to concrete, low-burden actions while preserving autonomy and safety.",
  ],
  seekingLine:
    "I am currently seeking PhD opportunities in HCI, human-centered AI, and digital mental health / wellbeing.",
} as const;

export type JourneyStop = {
  place: string;
  period: string;
  title: string;
  detail: string;
};

export const journey: JourneyStop[] = [
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
  text: string;
  tag?: "Talk" | "Paper" | "Role" | "Award";
};

export const news: NewsItem[] = [
  {
    date: "Jun 2026",
    text: "Presenting Mindful-Scroll at the Digital Mental Health International Conference (DMH 2026) in Hong Kong.",
    tag: "Talk",
  },
  {
    date: "2026",
    text: "CoSim short paper (with the Tsinghua Pervasive HCI Group) is under review at UIST 2026.",
    tag: "Paper",
  },
  {
    date: "Feb 2026",
    text: "Started as a full-time Research Fellow at Duke Kunshan University's HII Lab, advised by Prof. Yucheng Jin.",
    tag: "Role",
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
    date: "2027",
    text: "Two CHI 2027 manuscripts on short-form video wellbeing and caregiver AI literacy in preparation.",
    tag: "Paper",
  },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "news", label: "News" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "publications", label: "Publications" },
  { id: "cv", label: "CV" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;
