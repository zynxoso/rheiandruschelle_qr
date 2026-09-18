import {
  Zap,
  Layers,
  Terminal,
  Code2,
  Briefcase,
  Globe,
  Youtube,
  Cpu,
  Star,
  FileText,
  Github,
  Linkedin
} from 'lucide-react'

export type ProofLedgerMode = "outcome" | "architecture" | "implementation"

export type ProofLedgerProject = {
  id: string
  number: string
  name: string
  role: string
  statement: string
  stack: string[]
  image: string
  imageAlt: string
  url?: string
  modes: Record<ProofLedgerMode, {
    eyebrow: string
    headline: string
    body: string
    trace: string[]
  }>
  actions: Array<{
    kind: "case-study" | "external"
    label: string
    target: string
  }>
}

export const DATA = {
  name: "Jan Harry I. Madrona",
  title: "Web Developer & Designer | System Developer | AI Developer",
  location: "Philippines",
  phone: "0977 625 5563",
  email: "Janharrymadrona1000@gmail.com",
  objective: "I build web applications, admin dashboards, and custom management systems using Laravel, React, and Python. I like turning manual, paper-based workflows into fast, straightforward web tools with clean UI designs.",
  homepage: {
    eyebrow: "Web development / AI workflows / Philippines",
    headline: "I build web tools that replace paperwork and repetitive admin work.",
    lede: "I'm Jan, a developer and designer working with Laravel, React, Next.js, and Python. Most of my projects start with a task that takes too long or asks people to enter the same information more than once. I build a simpler way to handle it.",
    ledger: [
      {
        id: "aira",
        number: "01",
        name: "AIRA",
        role: "Service request system",
        statement: "Paper requests become records staff can review and track.",
        stack: ["Laravel 12", "React 19", "Inertia 2", "Gemini AI", "MySQL"],
        image: "/gallery/ict_login.png",
        imageAlt: "CLSU ICT Service Request System interface",
        url: "https://github.com/zynxoso/CLSU_AIRA-LOGIX",
        modes: {
          outcome: {
            eyebrow: "Delivered workflow",
            headline: "One request stays visible from intake to follow-up.",
            body: "AIRA moves CLSU service requests online. Staff can upload a file, review the details Gemini extracts, and keep the request inside one trackable system.",
            trace: ["Submit request", "Extract details", "Review record", "Track status"],
          },
          architecture: {
            eyebrow: "System logic",
            headline: "AI handles extraction. Staff keep control of the record.",
            body: "Gemini sits at the input boundary instead of writing directly to the database. Laravel manages the application and data, while React and Inertia handle the staff workflow.",
            trace: ["Uploaded file", "Gemini extraction", "Human review", "MySQL record"],
          },
          implementation: {
            eyebrow: "Working stack",
            headline: "A conventional full-stack base with one focused AI step.",
            body: "The system uses Laravel 12, React 19, Inertia 2, and MySQL. The AI feature solves repeated transcription without turning the rest of the application into an opaque automation.",
            trace: ["Laravel 12", "React 19", "Inertia 2", "Gemini + MySQL"],
          },
        },
        actions: [
          { kind: "case-study", label: "Read case study", target: "aira" },
          { kind: "external", label: "View source", target: "https://github.com/zynxoso/CLSU_AIRA-LOGIX" },
        ],
      },
      {
        id: "scholarship",
        number: "02",
        name: "Scholarship Portal",
        role: "Application and review system",
        statement: "Graduate applications move from paper forms to one review path.",
        stack: ["TALL Stack", "Laravel", "Livewire", "Alpine.js", "Tailwind CSS", "Hostinger"],
        image: "/gallery/prism.png",
        imageAlt: "CLSU PRISM Scholarship Portal application interface",
        url: "https://clsu-erdt.com/",
        modes: {
          outcome: {
            eyebrow: "Delivered workflow",
            headline: "Applicants submit online. ABE staff review organized records.",
            body: "The portal gives master's and PhD applicants a digital submission path and gives administrators a structured place to inspect each application.",
            trace: ["Apply online", "Validate fields", "Review application", "Manage record"],
          },
          architecture: {
            eyebrow: "System logic",
            headline: "The public form and the review record share one workflow.",
            body: "Applicant information moves into a MySQL-backed record that administrators can review, search, and update without rebuilding the submission by hand.",
            trace: ["Public form", "Validation", "MySQL record", "Admin review"],
          },
          implementation: {
            eyebrow: "Working stack",
            headline: "Engineered with the TALL stack and deployed on Hostinger.",
            body: "Laravel and Livewire power the server-side reactivity and form handling, Alpine.js and Tailwind CSS drive the UI, and MySQL manages application records. The production portal is hosted on Hostinger for high reliability.",
            trace: ["Laravel", "Livewire + Alpine", "Tailwind CSS", "Hostinger Deploy"],
          },
        },
        actions: [
          { kind: "case-study", label: "Read case study", target: "scholarship" },
          { kind: "external", label: "Open live portal", target: "https://clsu-erdt.com/" },
        ],
      },
      {
        id: "aito",
        number: "03",
        name: "AITO",
        role: "AI video production tool",
        statement: "One idea becomes a structured pack for AI video production.",
        stack: ["React", "AI video", "Script builder", "Veo", "Tailwind CSS"],
        image: "/gallery/AI3DTO.png",
        imageAlt: "AITO AI 3D Talking Objects script creation studio",
        url: "https://ai-3-dto.vercel.app/",
        modes: {
          outcome: {
            eyebrow: "Delivered product",
            headline: "Creators move from an idea to production-ready guidance.",
            body: "AITO connects scripts, scene direction, character guidance, and thumbnail motion prompts so creators do not have to rebuild the production setup for every video.",
            trace: ["Choose format", "Generate script", "Package assets", "Move to production"],
          },
          architecture: {
            eyebrow: "Product logic",
            headline: "The workflow follows production stages instead of an open chat box.",
            body: "Each stage has a defined input and output. That structure keeps the creative direction connected as the idea moves from script to motion-ready assets.",
            trace: ["Creative brief", "Structured script", "Scene guidance", "Motion pack"],
          },
          implementation: {
            eyebrow: "Working stack",
            headline: "React keeps each production step focused and reusable.",
            body: "The interface separates content formats and generation stages while keeping their outputs connected for AI video and thumbnail motion tools.",
            trace: ["React", "Reusable stages", "AI outputs", "Veo workflow"],
          },
        },
        actions: [
          { kind: "case-study", label: "Read case study", target: "aito" },
          { kind: "external", label: "Open live product", target: "https://ai-3-dto.vercel.app/" },
        ],
      },
    ] satisfies ProofLedgerProject[],
    bio: [
      "I'm a BS Information Technology graduate from Central Luzon State University in Nueva Ecija. I became interested in system development after seeing how much time people lose to paper forms and filing cabinets. The same problem shows up in digital work when staff have to copy the same details between tools.",
      "I begin by following the work as it happens. I look at where the information comes from, who needs it next, and where the process slows down. Once I understand that, I can choose the right tool. It might be a Laravel application, a React dashboard, a database, or a Python script.",
      "I'm still early in my career. During my 480-hour internship at CLSU's Management Information Systems Office, I helped build AIRA and presented it to ICT directors. My other work includes a live scholarship system, local government record tools, independent dashboards, and AI-assisted software for video production.",
    ],
    principles: [
      "Learn how the work is done before choosing the tools.",
      "Explain tradeoffs in plain language.",
      "Design for the person who uses the system each day.",
      "Write code the next developer can follow.",
    ],
  },
  skills: {
    technical: [
      { name: "Web Dev", tag: "Core Stack", icon: <Globe className="w-3.5 h-3.5" /> },
      { name: "Web Design", tag: "UI / UX", icon: <Layers className="w-3.5 h-3.5" /> },
      { name: "Laravel", tag: "Full-Stack", icon: <Zap className="w-3.5 h-3.5" /> },
      { name: "React", tag: "Frontend", icon: <Code2 className="w-3.5 h-3.5" /> },
      { name: "Tailwind", tag: "Styling", icon: <Code2 className="w-3.5 h-3.5" /> },
      { name: "Python", tag: "Automation", icon: <Terminal className="w-3.5 h-3.5" /> },
      { name: "Databases", tag: "MySQL / SQL", icon: <Briefcase className="w-3.5 h-3.5" /> },
      { name: "Automation", tag: "AI Workflows", icon: <Cpu className="w-3.5 h-3.5" /> }
    ],
    soft: ["UI/UX Prototyping", "Creative Direction", "Technical Writing", "Brand Strategy"]
  },
  projects: [
    {
      name: "PulseOS",
      role: "Lead Developer",
      desc: "An operations console and admin dashboard for system monitoring, alerts, earnings tracking, and AI automation workflows.",
      icon: <Cpu className="w-5 h-5" />,
      url: "https://next-myapp-pi.vercel.app/dashboard",
      tags: ["Next.js", "React", "Tailwind CSS", "Dashboard"]
    },
    {
      name: "AITO (AI 3D Talking Objects)",
      role: "Lead Developer",
      desc: "A web platform that generates production-ready scripts for character videos, nursery rhymes, and thumbnail motion packs, featuring AI tools and integrations for automated video creation.",
      icon: <Cpu className="w-5 h-5" />,
      url: "https://ai-3-dto.vercel.app/",
      caseStudy: "aito",
      pinned: true,
      tags: ["React", "AI Video", "Script Builder", "Veo"]
    },
    {
      name: "AIRA (AI Reports Automation)",
      role: "Lead AI Developer | Intern Project",
      desc: "A web app I built during my internship to move CLSU's paper service requests online. It runs on Laravel 12, React 19, and Inertia.js. I added Gemini AI to read info directly from photos and documents so staff don't have to type it in manually.",
      icon: <Cpu className="w-5 h-5" />,
      url: "https://github.com/zynxoso/CLSU_AIRA-LOGIX",
      caseStudy: "aira",
      pinned: true,
      tags: ["Laravel 12", "React 19", "Gemini AI", "Inertia 2"]
    },
    {
      name: "Viral Content",
      role: "Content Automation Project",
      desc: "A Python script that helps me automate content creation. It handles things like researching topics, generating video drafts, and publishing to social media, which saves me hours of manual editing.",
      icon: <Youtube className="w-5 h-5" />,
      url: "https://github.com/zynxoso/viralcontent",
      tags: ["Python", "Automation", "Youtube API", "Asset Gen"]
    },
    {
      name: "Budget Planner",
      role: "Personal Finance Tool",
      desc: "A simple dashboard for tracking monthly income and spending. I kept it free of extra clutter, using just basic categories and charts so you can see where your money goes. Built with React and Tailwind.",
      icon: <Briefcase className="w-5 h-5" />,
      url: "https://github.com/zynxoso/BudgetPlanner",
      tags: ["React", "Tailwind CSS", "Finance", "Local Storage"]
    },
    {
      name: "Scholarship Portal",
      role: "Lead Developer",
      desc: "I built a scholarship portal for master’s and PhD applicants of CLSU ABE using the TALL stack (Tailwind CSS, Alpine.js, Laravel, Livewire) and MySQL, hosted on Hostinger. It replaced paper applications with an online submission and review workflow.",
      icon: <Terminal className="w-5 h-5" />,
      url: "https://clsu-erdt.com/",
      caseStudy: "scholarship",
      pinned: true,
      tags: ["TALL Stack", "Laravel", "Livewire", "Hostinger"]
    },
    {
      name: "Barangay System",
      role: "Lead Developer",
      desc: "A local database system for barangay records. I helped digitize their paper files so staff can search, edit, and update community details instantly instead of looking through filing cabinets.",
      icon: <Layers className="w-5 h-5" />,
      url: "https://github.com/zynxoso/BARANGAY-MANAGEMENT-SYSTEM-ACCESS",
      tags: ["Access DB", "Local Gov", "System Dev"]
    },
  ],
  education: [
    { school: "Central Luzon State University", period: "Class of 2026", level: "BSIT" },
  ],
  achievements: [
    { title: "IT Startup Winner", category: "1st Place (IoT Hardware)", icon: <Star className="w-4 h-4" /> },
    { title: "IRCITE Champion", category: "Video Editing", icon: <Youtube className="w-4 h-4" /> },
    { title: "TOPCIT Certified", category: "High Merit Participant", icon: <FileText className="w-4 h-4" /> },
    { title: "CS50 AI with Python", category: "HarvardX Certified", icon: <Cpu className="w-4 h-4" /> },
    { title: "Data Visualization", category: "Kaggle Professional", icon: <Globe className="w-4 h-4" /> },
    { title: "Pandas for Data Science", category: "Kaggle Advanced", icon: <Terminal className="w-4 h-4" /> },
    { title: "IT Specialist (Web)", category: "Pearson VUE Certified", icon: <Code2 className="w-4 h-4" /> },
    { title: "TOPCIT IT Competency", category: "IITP International", icon: <FileText className="w-4 h-4" /> }
  ],
  links: [
    { name: "GitHub", desc: "Where I host my repositories and automation scripts.", url: "https://github.com/zynxoso", icon: <Github className="w-4 h-4" /> },
    { name: "LinkedIn", desc: "My professional network page.", url: "https://www.linkedin.com/in/jan-harry-madrona-212108402", icon: <Linkedin className="w-4 h-4" /> },
    { name: "TikTok", desc: "Where I post short videos about coding and developer tips.", url: "https://www.tiktok.com/@zynxoso82?_r=1&_t=ZS-93m74k6DkZg", icon: <Youtube className="w-4 h-4" /> }
  ],
  digitalProducts: [
    {
      name: "Laravel Developer Playbook",
      desc: "A personal collection of database designs, coding patterns, and tips I use for Laravel projects.",
      tag: "PLAYBOOK",
      url: "https://madronajane.gumroad.com/l/yrzirk",
      cta: "I want this",
      icon: <FileText className="w-4 h-4" />
    },
    {
      name: "SMS Laravel Tutorial",
      desc: "A guide on setting up SMS alerts and message queues in Laravel.",
      tag: "TUTORIAL",
      url: "https://www.notion.so/313b98734365803f8906db614451dacc?v=313b98734365804bb69c000cf0323e78&source=copy_link",
      cta: "Access Notion",
      icon: <FileText className="w-4 h-4" />
    }
  ],
  designTemplates: [
    {
      name: "Sleek Flyer with Textured Off-White Background",
      category: "Canva Template",
      desc: "A bold marketing flyer with textured off-white paper, black display type, and red growth graphics.",
      preview: "/canva_design_templates/sleek-flyer-textured-off-white-background.jpg",
      format: "Canva Link",
      canvaUrl: "https://canva.link/mnt0i9c7h0q1tkl",
      tools: ["Canva", "Template", "Editable"]
    },
    {
      name: "Flyer - TURN ATTENTION INTO REVENUE",
      category: "Canva Template",
      desc: "A tall grayscale growth flyer with editorial panels, chart visuals, and a bold revenue-focused headline.",
      preview: "/canva_design_templates/flyer-turn-attention-into-revenue.jpg",
      format: "Canva Link",
      canvaUrl: "https://canva.link/3howurew25mpsum",
      tools: ["Canva", "Template", "Editable"]
    },
    {
      name: "Tactile Print Layout for Meridian Works",
      category: "Canva Template",
      desc: "A textured print-style growth layout with bold typography, red package blocks, and strategy diagram details.",
      preview: "/canva_design_templates/tactile-print-layout-for-meridian-works.jpg",
      format: "Canva Link",
      canvaUrl: "https://canva.link/lb5prgvbyaeqry3",
      tools: ["Canva", "Template", "Editable"]
    },
    {
      name: "Structured Editorial Brochure Layout 2",
      category: "Canva Template",
      desc: "A structured editorial brochure with grid-based metrics, paper texture, and sparse technical linework.",
      preview: "/canva_design_templates/structured-editorial-brochure-layout-2.jpg",
      format: "Canva Link",
      canvaUrl: "https://canva.link/sqgzz3z4g6f0spm",
      tools: ["Canva", "Template", "Editable"]
    },
    {
      name: "Premium Strategy Studio Brochure Design",
      category: "Canva Template",
      desc: "A premium studio brochure concept with editorial text blocks, soft paper tone, and orange strategy charts.",
      preview: "/canva_design_templates/premium-strategy-studio-brochure-design.jpg",
      format: "Canva Link",
      canvaUrl: "https://canva.link/6d9vi2k2pmj0bvp",
      tools: ["Canva", "Template", "Editable"]
    },
    {
      name: "Premium Craft Beverage Mockup of Northline Cold Brew",
      category: "Canva Template",
      desc: "A premium cold brew product mockup with bottle packaging, warm studio light, and refined label styling.",
      preview: "/canva_design_templates/premium-craft-beverage-mockup-of-northline-cold-brew.jpg",
      format: "Canva Link",
      canvaUrl: "https://canva.link/eiu8sxz7www2amz",
      tools: ["Canva", "Mockup", "Beverage"]
    },
    {
      name: "Northline Cold Brew Concentrate Editorial Mockup",
      category: "Canva Template",
      desc: "An editorial cold brew concentrate scene with layered bottles, packaging shadows, and promo card detail.",
      preview: "/canva_design_templates/northline-cold-brew-concentrate-editorial-mockup.jpg",
      format: "Canva Link",
      canvaUrl: "https://canva.link/kq6w5cedcg1fyo3",
      tools: ["Canva", "Mockup", "Editorial"]
    },
    {
      name: "Instagram Post - Discover the Richness of Northline Cold Brew Concentrate",
      category: "Canva Template",
      desc: "A square social post for Northline Cold Brew with product photography and a large editorial headline.",
      preview: "/canva_design_templates/instagram-post-discover-the-richness-of-northline-cold-brew-concentrate.jpg",
      format: "Canva Link",
      canvaUrl: "https://canva.link/p74dynvihojdywn",
      tools: ["Canva", "Instagram", "Beverage"]
    }
  ],
  resume: "/JanHarryMadrona_RESUME-JULY2026.pdf",
  gallery: [
    {
      title: "PulseOS Dashboard",
      category: "Web Development",
      img: "/gallery/PulseOS.png",
      desc: "An operations console and admin dashboard for system monitoring, alerts, earnings tracking, and AI automation workflows.",
      date: "Feb 2026",
      tech: ["Next.js", "React", "Tailwind CSS", "Dashboard"],
      verified: true
    },
    {
      title: "AITO (AI 3D Talking Objects)",
      category: "Web Development",
      img: "/gallery/AI3DTO.png",
      desc: "A production-ready script building studio for character videos, nursery rhymes, and image-to-video thumbnail animations.",
      date: "Feb 2026",
      tech: ["React", "AI Video", "Script Builder", "Veo"],
      verified: true
    },
    {
      title: "Internship Certificate of Completion",
      category: "Achievement",
      img: "/gallery/cert_of_completion_intern.jpg",
      desc: "My certificate for finishing a 480-hour internship at CLSU's Management Information Systems Office.",
      date: "Jan 2026",
      tech: ["Internship", "CLSU MISO", "System Dev"],
      verified: true
    },
    {
      title: "OJT Final Presentation",
      category: "System Development",
      img: "/gallery/ojt_grad_presentation.jpg",
      desc: "Presenting the AIRA-LOGIX app to the ICT directors at the end of our internship.",
      date: "Jan 2026",
      tech: ["Presentation", "Laravel", "React", "Inertia"],
      verified: true
    },
    {
      title: "Graduation Portrait (Toga)",
      category: "Achievement",
      img: "/gallery/graduation_pic_toga.png",
      desc: "My graduation photo celebrating my BS in IT degree from CLSU.",
      date: "May 2026",
      tech: ["Academic", "CLSU", "BS IT"],
      verified: true
    },
    {
      title: "Graduation Portrait",
      category: "Achievement",
      img: "/gallery/Graduation_pic.png",
      desc: "Yearbook portrait photo.",
      date: "May 2026",
      tech: ["Academic", "CLSU", "BS IT"],
      verified: true
    },
    {
      title: "Graduation Portrait (Barong)",
      category: "Achievement",
      img: "/gallery/graduationpic_barong.png",
      desc: "Graduation portrait in traditional Barong Tagalog.",
      date: "May 2026",
      tech: ["Academic", "CLSU", "BS IT"],
      verified: true
    },
    {
      title: "Career Seminar: Gender Equality",
      category: "Achievement",
      img: "/gallery/career_seminar.png",
      desc: "Certificate for attending a seminar on workplace diversity and ethics in tech.",
      date: "Nov 2025",
      tech: ["Seminar", "Ethics", "Professional"],
      verified: true
    },
    {
      title: "TOPCIT Competency Certificate",
      category: "Achievement",
      img: "/gallery/TOPCIT.png",
      desc: "My TOPCIT exam certificate, showing software engineering competency.",
      date: "Nov 2025",
      tech: ["TOPCIT", "IITP", "Software Eng"],
      verified: true
    },
    {
      title: "PRISM Scholarship Portal",
      category: "Web Development",
      img: "/gallery/prism.png",
      desc: "Live interface designs for the CLSU PRISM scholarship project built with the TALL stack on Hostinger.",
      date: "Oct 2025",
      tech: ["TALL Stack", "Laravel", "Livewire", "Hostinger"],
      verified: true
    },
    {
      title: "CLSU ICT Login",
      category: "System Development",
      img: "/gallery/ict_login.png",
      desc: "Redesigning the login page for CLSU's main ICT portal.",
      date: "Sep 2025",
      tech: ["System Dev", "Authentication", "Tailwind"],
      verified: true
    },
    {
      title: "TOPCIT Competency Certified",
      category: "Achievement",
      img: "/gallery/certificate_topcit.png",
      desc: "Score report from the TOPCIT exam.",
      date: "Nov 2025",
      tech: ["TOPCIT", "IITP", "Exam"],
      verified: true
    },
    {
      title: "Harvard CS50 Certification",
      category: "Achievement",
      img: "/gallery/certificate_harvardCs50.jpg",
      desc: "Certificate for completing Harvard's CS50 AI with Python course.",
      date: "Aug 2025",
      tech: ["HarvardX", "Python", "AI/ML"],
      verified: true
    },
    {
      title: "Data Visualization Specialist",
      category: "Achievement",
      img: "/gallery/JAN HARRY MADRONA - Data Visualization.png",
      desc: "Kaggle certificate for data visualization in Python.",
      date: "Jul 2025",
      tech: ["Kaggle", "Data Science", "Python"],
      verified: true
    },
    {
      title: "Pandas for Data Science",
      category: "Achievement",
      img: "/gallery/JAN HARRY MADRONA - Pandas.png",
      desc: "Kaggle certificate for data analysis using Pandas.",
      date: "Jul 2025",
      tech: ["Kaggle", "Pandas", "Python"],
      verified: true
    },
    {
      title: "Career Seminar Participation",
      category: "Achievement",
      img: "/gallery/certificate_participation.jpg",
      desc: "Certificate for a seminar on career prep and job hunting.",
      date: "Oct 2025",
      tech: ["Seminar", "Career Readiness"],
      verified: true
    }
  ]
}
