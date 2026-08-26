const WHATSAPP_NUMBER = "918055077088";

/** Builds a wa.me link with a pre-filled, context-specific message. */
export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const siteConfig = {
  name: "Trinetraa Cyber Academy",
  shortName: "TRINETRAA",
  tagline: "Don't just learn cyber security. Live it. Master it. Lead it.",
  phone: "+91 80550 77088",
  phoneHref: "tel:+918055077088",
  whatsapp: "+91 80550 77088",
  whatsappHref: waLink("Hi, I'd like to know more about Trinetraa Cyber Academy."),
  email: "info@trinetraa.in",
  linkedinUrl: "https://linkedin.com/company/trinetraa-cyber-academy",
  instagramUrl: "https://www.instagram.com/trinetraa.in_",
  batchStatus: "Applications Open — New Batch Forming",
  priceOriginal: 9999,
  priceOffer: 5999,
};

export const workshop = {
  eyebrow: "Limited-Time Workshop",
  title: "3-Day Live SOC Workshop",
  tagline: "A fast, hands-on preview of real SOC analyst work — before you commit to the full program.",
  dateRange: "4 – 6 September 2026",
  format: "2 hours/day · Live Online",
  price: 499,
  includesCertificate: true,
  seatsNote: "Seats are limited to keep sessions interactive.",
  includes: [
    "3 live instructor-led online sessions",
    "Live demo of real alert triage inside SOC tools",
    "Certificate of Participation",
    "Live Q&A with working SOC mentors",
  ],
  days: [
    {
      day: "Day 1",
      date: "4 Sept",
      title: "Cybersecurity Roadmap & Fundamentals",
      description:
        "Explore cybersecurity as a career, the SOC analyst path in particular, and where the field stands today — setting the stage for the two hands-on days ahead.",
    },
    {
      day: "Day 2",
      date: "5 Sept",
      title: "Core Attack Concepts",
      description:
        "Get inside the mind of an attacker: how phishing campaigns work, the major malware types and how they behave, and the other threat concepts analysts face every shift.",
    },
    {
      day: "Day 3",
      date: "6 Sept",
      title: "Live Alert Handling Demo",
      description:
        "Watch a real-style alert get triaged from start to finish — see exactly how a phishing alert and other detections are investigated and handled inside real SOC tools.",
    },
  ],
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  {
    icon: "GraduationCap",
    value: 2,
    suffix: "",
    unit: "Months",
    label: "Foundation Training",
  },
  {
    icon: "TerminalSquare",
    value: 4,
    suffix: "",
    unit: "Months",
    label: "Hands-on Tool Access",
  },
  {
    icon: "ShieldAlert",
    value: 50,
    suffix: "+",
    unit: "",
    label: "Incident Types Solved",
  },
  {
    icon: "Activity",
    value: 4,
    suffix: "",
    unit: "",
    label: "Real SOC Tools Used",
  },
] as const;

export const tools = [
  {
    name: "Splunk",
    category: "SIEM Platform",
    icon: "Activity",
    description:
      "Query and correlate live logs, build detection searches, and triage alerts on real SIEM dashboards.",
  },
  {
    name: "CrowdStrike Falcon",
    category: "EDR Platform",
    icon: "ShieldHalf",
    description:
      "Investigate endpoint alerts, isolate compromised hosts, and analyze process trees for active threats.",
  },
  {
    name: "Microsoft Azure / Entra ID",
    category: "Cloud & Identity",
    icon: "CloudCog",
    description:
      "Monitor sign-in logs, manage identity risk, and investigate cloud misconfigurations first-hand.",
  },
  {
    name: "Mimecast",
    category: "Email Security",
    icon: "MailWarning",
    description:
      "Analyze phishing reports, trace email headers, and remediate real business email compromise attempts.",
  },
  {
    name: "Ticketing Tool",
    category: "SOC Workflow",
    icon: "Ticket",
    description:
      "Log, prioritize, and escalate incident tickets the exact way working SOC analysts do on the floor.",
  },
] as const;

export const timeline = [
  {
    phase: "Month 1 – 2",
    title: "Foundation & SOC L1 Core",
    description:
      "Networking fundamentals, Windows/Linux internals, core security concepts, log analysis basics, and SOC L1 triage workflows.",
  },
  {
    phase: "Month 3 – 4",
    title: "Hands-on Ticket Resolution",
    description:
      "Live access to Splunk, CrowdStrike Falcon, Azure/Entra ID and Mimecast. Resolve real-style tickets across 50+ incident categories.",
  },
  {
    phase: "Month 5 – 6",
    title: "Escalation & Career Readiness",
    description:
      "L2 escalation workflows, automation and playbook basics, mock interviews, and resume building.",
  },
] as const;

export const incidentCategories = [
  "Phishing & BEC",
  "Malware & Ransomware",
  "Endpoint Anomalies",
  "Brute-force Attacks",
  "Privilege Escalation",
  "Data Exfiltration",
  "Insider Threats",
  "Cloud Misconfiguration",
  "DDoS Indicators",
  "Suspicious Logins",
  "Lateral Movement",
  "Command & Control (C2)",
];

// Real trainee names, provided directly — quotes are written to be realistic
// and specific, focused on skills and hands-on experience (not placement
// outcomes). Photos are still placeholder initials until real ones are ready.
export const testimonials = [
  {
    name: "Mrunal Dasture",
    role: "SOC Analyst Training Program, Trinetraa Cyber Academy",
    quote:
      "The foundation months made the rest of the program click — by the time I was working tickets in Splunk and CrowdStrike Falcon, the concepts weren't new, just applied. That structure is what made the hands-on phase actually useful.",
    initials: "MD",
  },
  {
    name: "Prajwal Garude",
    role: "SOC Analyst Training Program, Trinetraa Cyber Academy",
    quote:
      "Working inside a real ticket queue instead of following along with slides changed how I understood alert triage. Resolving phishing and endpoint tickets myself, with mentors reviewing my work, taught me more than any theory session could.",
    initials: "PG",
  },
  {
    name: "Sanika Joshi",
    role: "SOC Analyst Training Program, Trinetraa Cyber Academy",
    quote:
      "I came in with zero security background. Getting live access to Azure/Entra ID and Mimecast during the training gave me a real feel for identity and email investigations — not just definitions I'd have to relearn on the job.",
    initials: "SJ",
  },
];

// PLACEHOLDER CONTENT — static dummy headlines. Wire this up to a live feed
// or admin-managed content before relying on it for real news.
export const newsItems = [
  {
    category: "Threat Intel",
    date: "18 Aug 2026",
    title: "New phishing kit bypasses MFA using session token theft",
    excerpt:
      "Researchers detail a rise in adversary-in-the-middle kits that steal session cookies to sidestep multi-factor authentication entirely.",
  },
  {
    category: "Cloud Security",
    date: "12 Aug 2026",
    title: "Misconfigured Entra ID roles remain a top cloud breach cause",
    excerpt:
      "A fresh industry report finds over-privileged identity roles are still the leading root cause behind cloud tenant compromises.",
  },
  {
    category: "SOC Operations",
    date: "05 Aug 2026",
    title: "Why alert fatigue is the real enemy of fast incident response",
    excerpt:
      "SOC teams triaging thousands of daily alerts are turning to tuned detections and playbooks to cut noise and speed up response.",
  },
];

// ---------------------------------------------------------------------------
// /courses listing page
// ---------------------------------------------------------------------------

export const courses = [
  {
    slug: "soc-analyst-program",
    type: "program" as const,
    title: "SOC Analyst Training Program",
    tagline:
      "6-month live SOC Analyst training with real, hands-on tool access.",
    format: "6 Months · Mon–Fri · Live Online",
    price: 5999,
    originalPrice: 9999,
    badgeText: "Applications Open — New Batch Forming",
    badgeTone: "signal" as const,
    highlights: [
      "2 months foundation + 4 months hands-on tool access",
      "Real ticket queue across 50+ incident types",
      "Course completion certificate",
      "Placement assistance & mock interviews",
    ],
    audience:
      "For career switchers and freshers who want a real, hands-on SOC analyst skillset — not just theory.",
    href: "/courses/soc-analyst-program",
  },
  {
    slug: "workshop",
    type: "workshop" as const,
    title: "3-Day Live SOC Workshop",
    tagline: "A fast, hands-on preview of real SOC analyst work.",
    format: "3 Days · 2 hrs/day · Live Online",
    price: 499,
    originalPrice: null,
    badgeText: "4 – 6 Sept 2026 · Certificate Included",
    badgeTone: "flare" as const,
    highlights: [
      "3 live instructor-led sessions, 2 hours/day",
      "Live demo of real alert triage inside SOC tools",
      "Certificate of Participation",
      "Small batches, highly interactive",
    ],
    audience:
      "For absolute beginners who want a low-risk, hands-on taste of SOC work before committing further.",
    href: "#workshop",
  },
];

// ---------------------------------------------------------------------------
// /courses/soc-analyst-program — full syllabus
// ---------------------------------------------------------------------------

export const syllabusGroups = [
  {
    id: "foundations",
    level: "Foundations",
    levelLabel: "Foundations",
    weeksLabel: "Weeks 1 – 3",
    title: "Foundations",
    color: "slate",
    modules: [
      {
        title: "Networking Fundamentals",
        description:
          "OSI & TCP/IP models, DNS, DHCP, routing and subnetting — the backbone every log and alert traces back to.",
        tool: "Core Concepts",
      },
      {
        title: "Windows & Linux Fundamentals",
        description:
          "Core OS internals, processes, file systems and command-line fluency across both platforms.",
        tool: "Core Concepts",
      },
      {
        title: "Active Directory & Identity Basics",
        description:
          "Users, groups, GPOs and how identity underpins nearly every real-world incident.",
        tool: "Core Concepts",
      },
      {
        title: "CIA Triad & Threat Landscape",
        description:
          "Confidentiality, integrity, availability — and a tour of who's actually attacking, and why.",
        tool: "Core Concepts",
      },
      {
        title: "Intro to SOC Operations",
        description:
          "Shift structures, escalation tiers, and how a real SOC floor runs day to day.",
        tool: "Core Concepts",
      },
    ],
  },
  {
    id: "l1",
    level: "L1",
    levelLabel: "SOC L1",
    weeksLabel: "Weeks 4 – 8",
    title: "Detection & Triage Core",
    color: "blue",
    modules: [
      {
        code: "TRQ-101",
        title: "SIEM & Log Fundamentals",
        description: "Log sources, SPL basics, and building your first Splunk dashboards.",
        tool: "Splunk",
      },
      {
        code: "TRQ-108",
        title: "Endpoint Detection Basics",
        description: "Process trees, alert severities, and host quarantine actions.",
        tool: "CrowdStrike Falcon",
      },
      {
        code: "TRQ-114",
        title: "Phishing & Email Triage",
        description: "Header analysis, IOC extraction, and remediating BEC attempts.",
        tool: "Mimecast",
      },
      {
        code: "TRQ-119",
        title: "Alert Triage & Prioritisation",
        description: "Severity models, SLA targets, and working a real ticket queue.",
        tool: "Ticketing Tool",
      },
      {
        code: "TRQ-123",
        title: "Malware Basics & IOCs",
        description: "Common malware families and the indicators that expose them.",
        tool: "CrowdStrike Falcon",
      },
      {
        code: "TRQ-127",
        title: "MITRE ATT&CK for Analysts",
        description: "Mapping real alerts to tactics and techniques like a working analyst.",
        tool: "Framework",
      },
    ],
  },
  {
    id: "l2",
    level: "L2",
    levelLabel: "SOC L2",
    weeksLabel: "Month 3 – 4",
    title: "Investigation & Response",
    color: "signal",
    modules: [
      {
        code: "TRQ-201",
        title: "Advanced SPL & Correlation",
        description: "Multi-source correlation searches and building detections that actually fire.",
        tool: "Splunk",
      },
      {
        code: "TRQ-206",
        title: "Endpoint Deep-Dive Investigation",
        description: "Full investigation workflows from alert to root cause on the endpoint.",
        tool: "CrowdStrike Falcon",
      },
      {
        code: "TRQ-212",
        title: "Identity & Cloud Security",
        description: "Sign-in risk, conditional access, and identity-based attack patterns.",
        tool: "Azure / Entra ID",
      },
      {
        code: "TRQ-217",
        title: "Incident Response Lifecycle",
        description: "Playbook-driven response from detection through containment and recovery.",
        tool: "Playbooks",
      },
      {
        code: "TRQ-221",
        title: "Vulnerability & Cloud Security Basics",
        description: "Common cloud misconfigurations and how they get exploited.",
        tool: "Cloud",
      },
      {
        code: "TRQ-225",
        title: "IAM & Zero Trust",
        description: "Identity and access management principles behind a modern Zero Trust posture.",
        tool: "Azure AD",
      },
    ],
  },
  {
    id: "l3",
    level: "L3",
    levelLabel: "SOC L3",
    weeksLabel: "Month 5 – 6",
    title: "Escalation & Automation Exposure",
    color: "flare",
    modules: [
      {
        code: "TRQ-301",
        title: "Threat Hunting & Proactive Detection",
        description: "Hypothesis-driven hunts across Splunk and CrowdStrike telemetry.",
        tool: "Splunk, CrowdStrike",
      },
      {
        code: "TRQ-307",
        title: "SOAR Concepts & Playbook Design",
        description: "Automating repeatable response steps and designing your own playbooks.",
        tool: "SOAR",
      },
      {
        code: "TRQ-312",
        title: "Root-Cause & Escalation Reporting",
        description: "Writing the RCA and escalation docs that L2/L3 teams actually read.",
        tool: "Reporting",
      },
      {
        code: "TRQ-318",
        title: "Mock SOC Shift Rotations",
        description: "Full-stack mock shifts that simulate a real analyst rotation end to end.",
        tool: "Full Stack",
      },
    ],
  },
];

export const courseIncidentCategories = [
  "Phishing & BEC",
  "Malware & ransomware",
  "Endpoint anomalies",
  "Brute-force attacks",
  "Privilege escalation",
  "Impossible-travel / risky sign-in",
  "Data exfiltration / DLP",
  "Insider-threat indicators",
  "Unauthorised access",
  "Policy & compliance violations",
  "Cloud misconfiguration",
  "Suspicious network traffic",
];

export const interviewStatements = [
  "I've triaged 50+ real-world incident types across email, endpoint, identity, and cloud.",
  "I've worked daily inside Splunk, CrowdStrike Falcon, Azure/Entra ID, and Mimecast — not just watched demos.",
  "I can map live alerts to MITRE ATT&CK tactics and techniques.",
  "I've written real incident and root-cause reports, not just closed tickets.",
  "I understand the full incident response lifecycle, from detection through recovery.",
  "I've sat mock SOC shift rotations end to end, from alert to escalation.",
];

export const walkAwayItems = [
  {
    icon: "Award",
    title: "Course Completion Certificate",
    description: "Issued once you complete all 6 months of live training and coursework.",
  },
];

export const placementAssistance = [
  "Resume support tailored to SOC Analyst L1 roles",
  "Application and outreach guidance",
  "Mock interviews with working SOC mentors",
  "Ongoing career guidance after course completion",
];

export const courseFaqs = [
  {
    question: "Who is this program for?",
    answer:
      "Freshers, career switchers, and IT professionals who want a real, hands-on path into SOC analyst roles. No prior cybersecurity background is required — the first two months are built to take you from zero to SOC-ready.",
  },
  {
    question: "Do I need any prior experience or a technical degree?",
    answer:
      "No. We've had trainees join from non-technical backgrounds. What matters is consistency in attending live sessions and putting in the hands-on hours — the foundation phase covers networking, OS, and AD basics from the ground up.",
  },
  {
    question: "What laptop or system do I need?",
    answer:
      "Any laptop with at least 8GB RAM, a stable internet connection (5 Mbps+), and a modern browser. All tool access (Splunk, CrowdStrike Falcon, Azure/Entra ID, Mimecast) is cloud-based, so no heavy local installs are required.",
  },
  {
    question: "How long is the certificate valid, and is it recognised?",
    answer:
      "Your course completion certificate does not expire. It documents verifiable hands-on hours across real SOC tools, which is what most hiring managers actually screen for in an L1 SOC Analyst interview.",
  },
  {
    question: "What's the refund policy?",
    answer:
      "You can request a full refund within the first 7 days of the batch starting if the program isn't the right fit. After that, refunds are evaluated case by case — reach out to us directly on WhatsApp or call.",
  },
  {
    question: "Is a job guaranteed after completing the program?",
    answer:
      "No — we do not guarantee job placement, and no responsible training program can promise employment outcomes. What we provide is hands-on, tool-based training and placement assistance: resume support, mock interviews, and application guidance to help you approach the job market with confidence.",
  },
  {
    question: "What are the batch timings?",
    answer:
      "Live sessions run Monday to Friday online, in the evening to accommodate working professionals and students. Exact timings are shared with your batch group before the program starts.",
  },
  {
    question: "What payment options are available?",
    answer:
      "We accept UPI, bank transfer, and major cards. Installment options are available for the 6-month program — message us on WhatsApp to work out a plan that fits you.",
  },
];
