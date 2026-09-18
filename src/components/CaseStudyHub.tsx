import { ArrowUpRight, BookOpen, Layers } from 'lucide-react'
import { trackPortfolioEvent } from '../analytics'

type CaseStudySummary = {
  id: string
  number: string
  kicker: string
  title: string
  role: string
  context: string
  summary: string
  stack: string[]
  image: string
  imageAlt: string
  link: string
  linkLabel: string
  impact: string[]
}

const CASE_STUDY_CATALOG: CaseStudySummary[] = [
  {
    id: 'aira',
    number: '01',
    kicker: 'System development case study',
    title: 'AIRA: AI-assisted service request workflow.',
    role: 'Lead AI Developer',
    context: 'CLSU MISO • 480h Internship',
    summary:
      'Replaced a fragmented paper-based service request process at CLSU with an online intake and management system. Gemini AI handles document and image transcription at the input boundary before administrative review.',
    stack: ['Laravel 12', 'React 19', 'Inertia 2', 'Gemini AI', 'MySQL'],
    image: '/gallery/ict_login.png',
    imageAlt: 'CLSU ICT Service Request System login and interface',
    link: 'https://github.com/zynxoso/CLSU_AIRA-LOGIX',
    linkLabel: 'View source',
    impact: ['Paper to digital intake', 'AI document extraction', 'Single source of truth'],
  },
  {
    id: 'scholarship',
    number: '02',
    kicker: 'Public service case study',
    title: 'CLSU ABE Scholarship Portal (ERDT PRISM).',
    role: 'Lead Developer',
    context: 'CLSU ABE • University Portal',
    summary:
      'Digitized graduate scholarship intake and staff evaluation for CLSU ABE. Applicants submit documentation online while staff review, track, and manage applications in a centralized database.',
    stack: ['PHP', 'MySQL', 'Responsive UI', 'Form Validation'],
    image: '/gallery/prism.png',
    imageAlt: 'CLSU PRISM Scholarship Portal live interface at clsu-erdt.com',
    link: 'https://clsu-erdt.com/',
    linkLabel: 'Open live portal',
    impact: ['Web-based application path', 'Structured staff review', 'Searchable applicant records'],
  },
  {
    id: 'aito',
    number: '03',
    kicker: 'AI product case study',
    title: 'AITO: Structured AI video creation studio.',
    role: 'Lead Developer',
    context: 'Independent Product',
    summary:
      'Organizes fragmented AI video generation into repeatable production stages. Converts creator concepts into connected scripts, scene directions, character consistency, and thumbnail motion packs.',
    stack: ['React', 'AI Video', 'Script Builder', 'Veo', 'Tailwind CSS'],
    image: '/gallery/AI3DTO.png',
    imageAlt: 'AITO AI 3D Talking Objects script creation studio',
    link: 'https://ai-3-dto.vercel.app/',
    linkLabel: 'Open live product',
    impact: ['End-to-end production flow', 'Reusable format presets', 'Direct export to video tools'],
  },
]

type CaseStudyHubProps = {
  onSelectCaseStudy: (id: string) => void
}

export function CaseStudyHub({ onSelectCaseStudy }: CaseStudyHubProps) {
  return (
    <section className="case-study-hub" aria-labelledby="hub-heading">
      <header className="case-study-hub-header">
        <div className="case-study-hub-badge">
          <Layers className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Case Studies & Architecture Reviews</span>
        </div>
        <h1 id="hub-heading">Detailed breakdowns of systems I engineered.</h1>
        <p className="case-study-hub-lede">
          Explore complete case studies covering workflow analysis, technical decisions, trade-offs, and real-world outcomes. Select any project below to inspect the full design and implementation story.
        </p>
      </header>

      <div className="case-study-hub-grid">
        {CASE_STUDY_CATALOG.map((item) => (
          <article key={item.id} className="case-study-card">
            <div className="browser-frame case-study-card-frame">
              <div className="browser-frame-bar">
                <div className="browser-frame-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="browser-frame-address">
                  <span>{item.link.replace(/^https?:\/\//, '')}</span>
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="browser-frame-external"
                  aria-label={`Open ${item.title} external link`}
                  onClick={() =>
                    trackPortfolioEvent('live_project_opened', {
                      project: item.id,
                      location: 'case_study_hub_card',
                    })
                  }
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div
                className="browser-frame-screen cursor-pointer"
                onClick={() => {
                  trackPortfolioEvent('case_study_opened', {
                    project: item.id,
                    location: 'case_study_hub_preview',
                  })
                  onSelectCaseStudy(item.id)
                }}
              >
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="browser-frame-img"
                  loading="lazy"
                />
                <div className="browser-frame-overlay">
                  <span className="overlay-pill">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5 inline" />
                    Read Case Study
                  </span>
                </div>
              </div>
            </div>

            <div className="case-study-card-content">
              <div className="case-study-card-meta">
                <span className="case-study-card-number">{item.number}</span>
                <span className="case-study-card-kicker">{item.kicker}</span>
                <span className="case-study-card-context">{item.context}</span>
              </div>

              <h2 className="case-study-card-title">{item.title}</h2>
              <p className="case-study-card-summary">{item.summary}</p>

              <ul className="case-study-card-impact" aria-label="Key delivery points">
                {item.impact.map((point) => (
                  <li key={point}>
                    <span className="impact-bullet" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="case-study-card-stack" aria-label="Tech stack">
                {item.stack.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="case-study-card-actions">
                <button
                  type="button"
                  className="case-study-primary-btn"
                  onClick={() => {
                    trackPortfolioEvent('case_study_opened', {
                      project: item.id,
                      location: 'case_study_hub_action',
                    })
                    onSelectCaseStudy(item.id)
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Read case study</span>
                </button>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-study-secondary-btn"
                  onClick={() =>
                    trackPortfolioEvent('live_project_opened', {
                      project: item.id,
                      location: 'case_study_hub_action',
                    })
                  }
                >
                  <span>{item.linkLabel}</span>
                  <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
