import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Database,
  FileSearch,
  Layers3,
  Workflow,
} from 'lucide-react'

type ProjectCaseStudyProps = {
  onBack: () => void
  caseStudyId: string
}

const caseStudies = {
  aira: {
    kicker: 'System development case study',
    title: 'AIRA tracks every service request.',
    lede: 'An internship project for CLSU that combines full-stack workflow design with AI-assisted document extraction.',
    link: 'https://github.com/zynxoso/CLSU_AIRA-LOGIX',
    linkLabel: 'View source',
    meta: [
      ['Role', 'Lead AI Developer'],
      ['Context', '480-hour internship'],
      ['Organization', 'CLSU MISO'],
      ['Scope', 'End-to-end system'],
    ],
    impactSignals: [
      ['PAPER TO DIGITAL', 'Service request intake moved into one online workflow'],
      ['AI ASSISTED', 'Gemini extracts information from uploaded files and images'],
      ['FULL STACK', 'Laravel, React, Inertia, and MySQL delivered as one system'],
    ],
    disclosure: 'Impact is described qualitatively because production performance metrics were not available for this portfolio version.',
    problemTitle: 'Paper requests created invisible work.',
    problemCopy: 'Staff had to receive, read, retype, route, and track service information across a manual process. The work existed, but its status and ownership were difficult to see at a glance.',
    tension: 'Digitize the workflow without forcing staff to relearn the service process.',
    evidence: [
      { icon: <FileSearch aria-hidden="true" />, text: 'Repeated transcription from submitted files' },
      { icon: <Workflow aria-hidden="true" />, text: 'Request status spread across manual handoffs' },
      { icon: <Database aria-hidden="true" />, text: 'Records harder to search, update, and audit' },
    ],
    successTitle: 'Make every request legible.',
    success: [
      ['User outcome', 'Less repeated data entry', 'Extract useful information from submitted documents before staff review.'],
      ['Operational outcome', 'Visible request status', 'Give staff one place to follow a request from intake through completion.'],
      ['Technical outcome', 'Maintainable foundation', 'Build on a conventional full-stack architecture the team can extend.'],
    ],
    approachTitle: 'From workflow map to working system.',
    phases: [
      ['01', 'Discover', 'Mapped the paper-based request path, staff handoffs, repeated data entry, and the points where records became difficult to track.', 'Workflow map and functional requirements'],
      ['02', 'Define', 'Converted the manual process into clear request states, user roles, validation rules, and a shared administrative view.', 'System architecture and interface plan'],
      ['03', 'Build', 'Developed the application with Laravel 12, React 19, Inertia 2, MySQL, and Gemini-powered document extraction.', 'Working full-stack service request system'],
      ['04', 'Validate', 'Presented the system to ICT directors and checked the workflow against the day-to-day needs of the office.', 'Stakeholder review and iteration priorities'],
    ],
    heroImage: '/gallery/ict_login.png',
    heroImageAlt: 'CLSU ICT Service Request System sign-in and interface',
    heroImageLabel: 'System UI',
    heroImageCaption: 'CLSU MISO service request portal interface',
    image: '/gallery/ojt_grad_presentation.jpg',
    imageAlt: 'Jan Harry Madrona presenting the AIRA system to CLSU ICT directors',
    imageLabel: 'Stakeholder validation',
    imageCaption: 'Final system presentation at CLSU MISO',
    decisions: [
      ['01', 'Keep the workflow familiar', 'Staff already understood the paper process, but the handoffs were slow and difficult to trace.', 'Mirror the existing mental model while making status, ownership, and records visible in one interface.', 'Less novelty in exchange for faster adoption and lower training friction.'],
      ['02', 'Use AI at the input boundary', 'Repeated transcription from photos and documents created unnecessary manual work.', 'Use Gemini to extract information from uploaded files before staff review and submission.', 'AI output remains reviewable instead of being treated as an unquestioned source of truth.'],
    ],
    systemTitle: 'One continuous request loop.',
    flow: [
      ['01', 'Submit', 'User sends request details and supporting files.'],
      ['02', 'Extract', 'Gemini reads information from the uploaded material.'],
      ['03', 'Review', 'Staff verify the request and move it through defined states.'],
      ['04', 'Track', 'The record remains searchable and available for follow-up.'],
    ],
    stack: ['Laravel 12', 'React 19', 'Inertia 2', 'Gemini AI', 'MySQL'],
    finalImpact: 'AIRA replaced a fragmented paper workflow with one digital path for intake, extraction, review, and tracking.',
    keep: 'Ground automation in the workflow people already understand.',
    improve: 'Add production analytics to measure handling time, extraction accuracy, and completion rates.',
  },
  aito: {
    kicker: 'AI product case study',
    title: 'AITO structures AI video production.',
    lede: 'A focused creation studio for character videos, nursery rhymes, and thumbnail motion packs powered by reusable AI workflows.',
    link: 'https://ai-3-dto.vercel.app/',
    linkLabel: 'Open product',
    meta: [
      ['Role', 'Lead Developer'],
      ['Context', 'Independent product'],
      ['Product', 'AI creation studio'],
      ['Scope', 'Script to motion pack'],
    ],
    impactSignals: [
      ['ONE WORKFLOW', 'Research, scripting, and production prompts stay connected'],
      ['REUSABLE OUTPUT', 'Structured scripts reduce blank-page work for repeated formats'],
      ['VIDEO READY', 'Outputs are organized for AI video and thumbnail motion tools'],
    ],
    disclosure: 'Impact is stated as delivered product capability. Usage and production metrics are not claimed without verified analytics.',
    problemTitle: 'AI video creation was fragmented across prompts.',
    problemCopy: 'Creators had to move between idea generation, scripts, character direction, scene prompts, and thumbnail motion instructions. Each handoff introduced inconsistency and made successful formats difficult to repeat.',
    tension: 'Standardize the production path without flattening the creator’s voice or visual direction.',
    evidence: [
      { icon: <FileSearch aria-hidden="true" />, text: 'Ideas and scripts separated across tools' },
      { icon: <Workflow aria-hidden="true" />, text: 'Repeated prompt assembly for every video' },
      { icon: <Layers3 aria-hidden="true" />, text: 'Multiple output formats needed from one concept' },
    ],
    successTitle: 'Turn an idea into an actionable production pack.',
    success: [
      ['Creator outcome', 'Faster starting point', 'Guide creators from concept to structured scenes without rebuilding the process.'],
      ['Content outcome', 'Consistent format', 'Keep character, tone, and visual direction connected across outputs.'],
      ['Product outcome', 'Reusable workflow', 'Support recurring video formats through a repeatable generation path.'],
    ],
    approachTitle: 'Design the sequence before the interface.',
    phases: [
      ['01', 'Map', 'Separated the creator journey into concept, script, scene, character, thumbnail, and motion requirements.', 'Production-stage model'],
      ['02', 'Structure', 'Defined inputs and output formats for character stories, nursery rhymes, and thumbnail motion packs.', 'Reusable generation templates'],
      ['03', 'Build', 'Created the React interface and connected the product flow to AI video-oriented generation tools.', 'Working script creation studio'],
      ['04', 'Refine', 'Reviewed whether each output could move directly into the next production step with minimal rewriting.', 'Clearer prompts and output hierarchy'],
    ],
    heroImage: '/gallery/AI3DTO.png',
    heroImageAlt: 'AITO AI 3D Talking Objects product interface workspace',
    heroImageLabel: 'Creation Studio UI',
    heroImageCaption: 'AITO generation workspace and script engine interface',
    image: '/gallery/AI3DTO.png',
    imageAlt: 'AITO AI 3D Talking Objects product interface',
    imageLabel: 'Product interface',
    imageCaption: 'Structured AI video creation workspace',
    decisions: [
      ['01', 'Organize around production stages', 'A generic chat interface would hide the order and requirements of the video workflow.', 'Give each production stage a defined purpose and output instead of relying on one open prompt box.', 'More guided interaction in exchange for stronger output consistency.'],
      ['02', 'Generate a pack, not a paragraph', 'Creators need several connected assets before an idea is ready for video production.', 'Return structured scripts, scene direction, and motion-ready guidance as related outputs.', 'The system handles more structure, but creators do less manual prompt assembly.'],
    ],
    systemTitle: 'One concept, four production stages.',
    flow: [
      ['01', 'Choose', 'Select the content format and creative direction.'],
      ['02', 'Generate', 'Build the script, scenes, and character guidance.'],
      ['03', 'Package', 'Organize outputs for video and thumbnail motion tools.'],
      ['04', 'Produce', 'Move the structured pack into the creation pipeline.'],
    ],
    stack: ['React', 'AI Video', 'Script Builder', 'Veo', 'Tailwind CSS'],
    finalImpact: 'AITO converts an open-ended video idea into a connected production pack that is easier to review, reuse, and move into AI creation tools.',
    keep: 'Treat AI generation as a designed workflow, not a single prompt field.',
    improve: 'Measure completion time, output reuse, and the number of edits required before production.',
  },
  scholarship: {
    kicker: 'Public service case study',
    title: 'CLSU ABE scholarships, now digital.',
    lede: 'A focused application and review system for CLSU ABE master’s and PhD scholarships.',
    link: 'https://clsu-erdt.com/',
    linkLabel: 'Open portal',
    meta: [
      ['Role', 'Lead Developer'],
      ['Context', 'University system'],
      ['Users', 'Graduate applicants and ABE staff'],
      ['Scope', 'Application and review'],
    ],
    impactSignals: [
      ['APPLICATIONS ONLINE', 'Master’s and PhD applicants can submit scholarship information through a web form'],
      ['CENTRAL REVIEW', 'Administrators can evaluate applications in one system'],
      ['SEARCHABLE DATA', 'Applicant records move from paper files into a structured database'],
    ],
    disclosure: 'Impact is described through the delivered workflow. No unverified time-saving or adoption metrics are presented.',
    problemTitle: 'Paper applications slowed both sides of the process.',
    problemCopy: 'Master’s and PhD applicants depended on a physical submission path while CLSU ABE administrators had to organize and review applicant information manually. The process made status, completeness, and record retrieval harder than necessary.',
    tension: 'Simplify graduate scholarship intake while preserving the information ABE administrators need for responsible review.',
    evidence: [
      { icon: <FileSearch aria-hidden="true" />, text: 'Physical forms created access and handling friction' },
      { icon: <Workflow aria-hidden="true" />, text: 'Review depended on manual sorting and handoffs' },
      { icon: <Database aria-hidden="true" />, text: 'Applicant records were harder to search and update' },
    ],
    successTitle: 'Make graduate applications clear and review systematic.',
    success: [
      ['Applicant outcome', 'Accessible submission', 'Provide master’s and PhD applicants one clear form for scholarship information and requirements.'],
      ['ABE staff outcome', 'Organized review', 'Bring graduate applicant records into a consistent administrative workflow.'],
      ['System outcome', 'Structured records', 'Store applications in a searchable MySQL-backed system.'],
    ],
    approachTitle: 'Translate policy into a clear digital path.',
    phases: [
      ['01', 'Discover', 'Reviewed the information master’s and PhD applicants submit and the way ABE administrators inspect each application.', 'Application requirements map'],
      ['02', 'Define', 'Organized form fields, validation, applicant records, and the administrative review sequence.', 'Data model and user flow'],
      ['03', 'Build', 'Developed the public application experience and the supporting PHP and MySQL workflow.', 'Working scholarship portal'],
      ['04', 'Review', 'Checked the interface against real applicant information and staff review needs.', 'Refined submission and record views'],
    ],
    heroImage: '/gallery/prism.png',
    heroImageAlt: 'CLSU PRISM Scholarship Portal live interface at clsu-erdt.com',
    heroImageLabel: 'Portal Landing UI',
    heroImageCaption: 'CLSU ERDT PRISM public graduate scholarship portal',
    image: '/gallery/prism.png',
    imageAlt: 'CLSU PRISM Scholarship Portal interface',
    imageLabel: 'Portal interface',
    imageCaption: 'Graduate scholarship application and ABE review workflow',
    decisions: [
      ['01', 'Reduce the form to a clear sequence', 'Scholarship applications require detailed information, but presenting everything at once increases uncertainty.', 'Group related requirements and make the application path visually predictable.', 'More interface structure in exchange for lower submission friction.'],
      ['02', 'Design applicant and reviewer views together', 'A simple public form would only digitize intake while leaving administration fragmented.', 'Connect each graduate application directly to a structured ABE review record.', 'A broader system scope, but one complete workflow instead of two disconnected tools.'],
    ],
    systemTitle: 'One record from application to review.',
    flow: [
      ['01', 'Apply', 'Master’s or PhD applicant enters information and submits requirements online.'],
      ['02', 'Validate', 'The system checks required data before accepting the record.'],
      ['03', 'Review', 'Administrators inspect organized applicant information.'],
      ['04', 'Manage', 'Records remain available for search, updates, and decisions.'],
    ],
    stack: ['PHP', 'MySQL', 'Responsive UI', 'Form Validation', 'CLSU'],
    finalImpact: 'The Scholarship Portal connects master’s and PhD applications with CLSU ABE review in one searchable digital workflow.',
    keep: 'Design public forms around the questions users need answered at each step.',
    improve: 'Add verified analytics for submission completion, review time, and common validation errors.',
  },
}

export function ProjectCaseStudy({ onBack, caseStudyId }: ProjectCaseStudyProps) {
  const study = caseStudies[caseStudyId as keyof typeof caseStudies] ?? caseStudies.aira

  return (
    <article className="case-study" aria-labelledby="case-study-title">
      <div className="case-study-shell">
        <button type="button" onClick={onBack} className="case-study-back">
          <ArrowLeft aria-hidden="true" />
          <span>Back to case studies</span>
        </button>

        <header className="case-study-hero">
          <div className="case-study-hero-copy">
            <p className="case-study-kicker">{study.kicker}</p>
            <h1 id="case-study-title">{study.title}</h1>
            <p className="case-study-lede">{study.lede}</p>
            <a
              href={study.link}
              target="_blank"
              rel="noopener noreferrer"
              className="case-study-link"
            >
              {study.linkLabel}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>

          <dl className="case-study-meta">
            {study.meta.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {study.heroImage && (
          <div className="case-study-preview-frame">
            <div className="browser-frame">
              <div className="browser-frame-bar">
                <div className="browser-frame-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="browser-frame-address">
                  <span>{study.link.replace(/^https?:\/\//, '')}</span>
                </div>
                <a
                  href={study.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="browser-frame-external"
                  aria-label={`Open ${study.title} live link`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="browser-frame-screen">
                <img
                  src={study.heroImage}
                  alt={study.heroImageAlt}
                  className="browser-frame-img"
                  loading="eager"
                />
              </div>
            </div>
            <div className="browser-frame-caption">
              <span className="caption-label">{study.heroImageLabel}</span>
              <p>{study.heroImageCaption}</p>
            </div>
          </div>
        )}

        <section className="impact-block" aria-labelledby="impact-heading">
          <div className="impact-title-wrap">
            <p>Outcome first</p>
            <h2 id="impact-heading">PROJECT IMPACT</h2>
          </div>
          <div className="impact-grid">
            {study.impactSignals.map(([value, label]) => (
              <div className="impact-item" key={value}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="case-study-disclosure">
            {study.disclosure}
          </p>
        </section>

        <section className="case-study-section problem-layout" aria-labelledby="problem-heading">
          <div className="section-marker">
            <span>Problem</span>
            <strong>01</strong>
          </div>
          <div className="section-content">
            <h2 id="problem-heading">{study.problemTitle}</h2>
            <p className="section-intro">{study.problemCopy}</p>
            <div className="tension-line">
              <span>Critical tension</span>
              <p>{study.tension}</p>
            </div>
            <div className="evidence-list">
              {study.evidence.map((item) => (
                <div key={item.text}>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="case-study-section" aria-labelledby="success-heading">
          <div className="section-marker">
            <span>Success</span>
            <strong>02</strong>
          </div>
          <div className="section-content">
            <h2 id="success-heading">{study.successTitle}</h2>
            <div className="success-grid">
              {study.success.map(([label, title, copy]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="case-study-section" aria-labelledby="approach-heading">
          <div className="section-marker">
            <span>Approach</span>
            <strong>03</strong>
          </div>
          <div className="section-content">
            <h2 id="approach-heading">{study.approachTitle}</h2>
            <div className="phase-list">
              {study.phases.map(([number, title, copy, output]) => (
                <div className="phase-row" key={number}>
                  <span className="phase-number">{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                  <div className="phase-output">
                    <span>Output</span>
                    <strong>{output}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <figure className="case-study-figure">
          <img
            src={study.image}
            alt={study.imageAlt}
          />
          <figcaption>
            <span>{study.imageLabel}</span>
            {study.imageCaption}
          </figcaption>
        </figure>

        <section className="case-study-section" aria-labelledby="decision-heading">
          <div className="section-marker">
            <span>Decisions</span>
            <strong>04</strong>
          </div>
          <div className="section-content">
            <h2 id="decision-heading">The choices that shaped the result.</h2>
            <div className="decision-list">
              {study.decisions.map(([number, title, signal, decision, tradeoff]) => (
                <article className="decision-item" key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <dl>
                    <div>
                      <dt>Signal</dt>
                      <dd>{signal}</dd>
                    </div>
                    <div>
                      <dt>Decision</dt>
                      <dd>{decision}</dd>
                    </div>
                    <div>
                      <dt>Tradeoff</dt>
                      <dd>{tradeoff}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="system-panel" aria-labelledby="system-heading">
          <div className="system-heading">
            <div>
              <p>System view</p>
              <h2 id="system-heading">{study.systemTitle}</h2>
            </div>
            <Layers3 aria-hidden="true" />
          </div>
          <ol className="system-flow">
            {study.flow.map(([number, title, copy]) => (
              <li key={number}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
          <div className="stack-row">
            <Cpu aria-hidden="true" />
            {study.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className="impact-block impact-block-final" aria-labelledby="final-impact-heading">
          <div className="impact-title-wrap">
            <p>Delivered change</p>
            <h2 id="final-impact-heading">PROJECT IMPACT</h2>
          </div>
          <div className="final-impact-copy">
            <CheckCircle2 aria-hidden="true" />
            <p>
              {study.finalImpact}
            </p>
          </div>
          <div className="lessons">
            <div>
              <span>Keep</span>
              <p>{study.keep}</p>
            </div>
            <div>
              <span>Improve next</span>
              <p>{study.improve}</p>
            </div>
          </div>
        </section>

        <footer className="case-study-footer">
          <p>Need a similar system?</p>
          <a href="mailto:Janharrymadrona1000@gmail.com">
            Let&apos;s discuss the workflow
            <ArrowUpRight aria-hidden="true" />
          </a>
        </footer>
      </div>
    </article>
  )
}
