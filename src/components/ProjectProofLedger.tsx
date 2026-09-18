import { useState } from 'react'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import type { ProofLedgerMode, ProofLedgerProject } from '../data'
import { trackPortfolioEvent } from '../analytics'

type ProjectProofLedgerProps = {
  projects: ProofLedgerProject[]
  onOpenCaseStudy: (caseStudyId: string) => void
}

const MODES: Array<{ id: ProofLedgerMode; label: string }> = [
  { id: 'outcome', label: 'Outcome' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'implementation', label: 'Implementation' },
]

export function ProjectProofLedger({
  projects,
  onOpenCaseStudy,
}: ProjectProofLedgerProps) {
  const [projectModes, setProjectModes] = useState<Record<string, ProofLedgerMode>>({})

  const getMode = (projectId: string): ProofLedgerMode => {
    return projectModes[projectId] ?? 'outcome'
  }

  const setMode = (projectId: string, mode: ProofLedgerMode) => {
    setProjectModes((prev) => ({ ...prev, [projectId]: mode }))
  }

  return (
    <div className="showcase-stack" aria-label="Featured technical projects">
      {projects.map((project) => {
        const activeMode = getMode(project.id)
        const activeContent = project.modes[activeMode]
        const externalAction = project.actions.find((action) => action.kind === 'external')
        const caseStudyAction = project.actions.find((action) => action.kind === 'case-study')

        return (
          <article key={project.id} className="showcase-card" aria-labelledby={`project-heading-${project.id}`}>
            {/* Card Header */}
            <header className="showcase-card-head">
              <div className="showcase-card-title-group">
                <span className="showcase-card-number">{project.number}</span>
                <div>
                  <div className="showcase-card-meta">
                    <span className="showcase-card-role">{project.role}</span>
                  </div>
                  <h3 id={`project-heading-${project.id}`}>{project.name}</h3>
                </div>
              </div>
              <p className="showcase-card-statement">{project.statement}</p>
              <div className="showcase-card-stack" aria-label={`${project.name} stack`}>
                {project.stack.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </header>

            {/* Split Body: Visual Browser Window + Deep Technical Proof */}
            <div className="showcase-card-body">
              {/* Visual Browser Mockup */}
              <div className="showcase-visual-column">
                <div className="browser-frame">
                  <div className="browser-frame-bar">
                    <div className="browser-frame-dots">
                      <span className="dot dot-red" />
                      <span className="dot dot-yellow" />
                      <span className="dot dot-green" />
                    </div>
                    <div className="browser-frame-address">
                      <span>{project.url ? project.url.replace(/^https?:\/\//, '') : `${project.id}.system`}</span>
                    </div>
                    {externalAction && (
                      <a
                        href={externalAction.target}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="browser-frame-external"
                        aria-label={`Open ${project.name} live link`}
                        onClick={() =>
                          trackPortfolioEvent('live_project_opened', {
                            project: project.id,
                            location: 'showcase_browser_bar',
                          })
                        }
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <div
                    className="browser-frame-screen cursor-pointer"
                    onClick={() => {
                      if (caseStudyAction) {
                        trackPortfolioEvent('case_study_opened', {
                          project: caseStudyAction.target,
                          location: 'showcase_image_click',
                        })
                        onOpenCaseStudy(caseStudyAction.target)
                      }
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.imageAlt}
                      className="browser-frame-img"
                      loading="lazy"
                    />
                    <div className="browser-frame-overlay">
                      <span className="overlay-pill">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5 inline" />
                        Inspect Case Study
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Proof Column with 3-Mode Selector */}
              <div className="showcase-proof-column">
                <div className="proof-ledger-modes" role="group" aria-label={`${project.name} proof view`}>
                  {MODES.map((mode) => {
                    const isSelected = mode.id === activeMode

                    return (
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        className={isSelected ? 'is-active' : undefined}
                        key={mode.id}
                        onClick={() => setMode(project.id, mode.id)}
                      >
                        {mode.label}
                      </button>
                    )
                  })}
                </div>

                <div className="showcase-panel" key={`${project.id}-${activeMode}`}>
                  <p className="proof-ledger-eyebrow">{activeContent.eyebrow}</p>
                  <h4>{activeContent.headline}</h4>
                  <p className="proof-ledger-body">{activeContent.body}</p>

                  <ol className="proof-ledger-trace" aria-label={`${project.name} sequence`}>
                    {activeContent.trace.map((step, index) => (
                      <li key={step}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <footer className="showcase-card-actions">
              {caseStudyAction && (
                <button
                  type="button"
                  className="showcase-action-primary"
                  onClick={() => {
                    trackPortfolioEvent('case_study_opened', {
                      project: caseStudyAction.target,
                      location: 'showcase_footer',
                    })
                    onOpenCaseStudy(caseStudyAction.target)
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
                  <span>{caseStudyAction.label}</span>
                </button>
              )}

              {externalAction && (
                <a
                  href={externalAction.target}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="showcase-action-secondary"
                  onClick={() =>
                    trackPortfolioEvent('live_project_opened', {
                      project: project.id,
                      location: 'showcase_footer',
                    })
                  }
                >
                  <span>{externalAction.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                </a>
              )}
            </footer>
          </article>
        )
      })}
    </div>
  )
}
