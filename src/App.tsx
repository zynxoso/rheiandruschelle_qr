import {
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Package,
  Menu,
  X,
  Moon,
  Sun,
  LayoutGrid,
  MapPin,
  Columns,
  List,
  Palette,
  Eye
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DATA } from './data'
import { ProjectCaseStudy } from './components/ProjectCaseStudy'
import { CaseStudyHub } from './components/CaseStudyHub'
import { ProjectProofLedger } from './components/ProjectProofLedger'
import { trackPortfolioEvent } from './analytics'

const PORTFOLIO_TABS = ['main', 'case-study', 'resume', 'digital', 'templates', 'gallery'] as const
type PortfolioTab = typeof PORTFOLIO_TABS[number]

function readNavigationState(): { tab: PortfolioTab; caseStudy: string | null } {
  const params = new URLSearchParams(window.location.search)
  const requestedTab = params.get('view')
  const tab = PORTFOLIO_TABS.includes(requestedTab as PortfolioTab)
    ? requestedTab as PortfolioTab
    : 'main'

  return {
    tab,
    caseStudy: params.get('project') || null,
  }
}

function getTabHref(tab: PortfolioTab, caseStudy: string | null = null) {
  const params = new URLSearchParams()

  if (tab !== 'main') params.set('view', tab)
  if (tab === 'case-study' && caseStudy) params.set('project', caseStudy)

  const query = params.toString()
  return query ? `${import.meta.env.BASE_URL}?${query}` : import.meta.env.BASE_URL
}

function App() {
  const [activeTab, setActiveTab] = useState<PortfolioTab>(() => readNavigationState().tab)
  const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(() => readNavigationState().caseStudy)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading] = useState(false)
  const [isIntroComplete] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check initial state from local storage or system preference
    try {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
    } catch {
      // LocalStorage blocked
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [resumeViewMode, setResumeViewMode] = useState<'interactive' | 'pdf'>('interactive')
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'certs' | 'projects'>('all')
  const [galleryViewMode, setGalleryViewMode] = useState<'masonry' | 'inspector'>('masonry')
  const [activeImage, setActiveImage] = useState<typeof DATA.gallery[number] | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveImage(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      const navigation = readNavigationState()
      setActiveTab(navigation.tab)
      setActiveCaseStudy(navigation.caseStudy)
      setIsMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])


  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    } catch {
      // LocalStorage blocked - fallback to updating classes without writing
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [isDarkMode])

  const toggleTab = (tab: PortfolioTab, caseStudyId: string | null = null) => {
    setActiveTab(tab)
    setActiveCaseStudy(tab === 'case-study' ? caseStudyId : null)
    setIsMenuOpen(false)
    window.history.pushState({}, '', getTabHref(tab, caseStudyId))
    window.scrollTo({ top: 0, behavior: 'auto' })
    trackPortfolioEvent('portfolio_view_opened', {
      view: tab,
      project: tab === 'case-study' ? caseStudyId : null,
    })
  }

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)
  const resumeUrl = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${DATA.resume.replace(/^\//, '')}`

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center select-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <motion.p
                className="text-3xl md:text-5xl font-black uppercase tracking-[0.4em] text-black pl-[0.4em] mb-4"
                initial={{ letterSpacing: "0.1em", opacity: 0 }}
                animate={{ letterSpacing: "0.4em", opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                ZYNXOSO
              </motion.p>
              <div className="w-24 h-[1px] bg-black/10 mx-auto relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.6, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row min-h-screen bg-white text-black text-[14px] selection:bg-black selection:text-white relative">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white rounded-sm font-black text-xs uppercase tracking-widest transition-all"
        >
          Skip to content
        </a>

        {/* Mobile Header - High visibility toggle */}
        <header className="lg:hidden flex justify-between items-center px-8 py-6 bg-white sticky top-0 z-40 border-b border-black/5">
          <p className="text-[11px] sm:text-sm font-black uppercase tracking-tighter leading-none max-w-[180px]">{DATA.name}</p>
          <div className="flex items-center space-x-4">
            <a
              href={resumeUrl}
              download="JanHarryMadrona_RESUME-JULY2026.pdf"
              className="mobile-resume-link"
              onClick={() => trackPortfolioEvent('resume_downloaded', { location: 'mobile_header' })}
            >
              CV
            </a>
            <button
              onClick={toggleDarkMode}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleDarkMode()
                }
              }}
              className="p-2 -mr-2 text-black/60 hover:text-black transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -mr-2"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay (Scrim) */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Sidebar - Professional Portfolio Aesthetic */}
        <aside className={`
        fixed inset-0 lg:sticky lg:top-0 lg:translate-x-0 lg:w-[300px] bg-white flex flex-col z-50 h-full lg:h-screen
        transition-transform duration-500 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
          <motion.div
            initial="hidden"
            animate={isIntroComplete ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.1
                }
              }
            }}
            className="flex flex-col h-full"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
              }}
              className="p-12 pb-8 text-left hidden lg:block"
            >
              <p className="text-lg font-black uppercase tracking-tighter mb-2 leading-none">{DATA.name}</p>
              <p className="text-[10px] text-black/60 uppercase tracking-[0.2em] font-bold">Systems & Content</p>
            </motion.div>

            <motion.nav
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.04
                  }
                }
              }}
              className="p-12 lg:p-6 space-y-2 flex-1 lg:flex-none"
            >
              {PORTFOLIO_TABS.map((tab) => {
                const labelMap: Record<string, string> = {
                  main: 'Portfolio',
                  'case-study': 'Case Study',
                  resume: 'My Resume',
                  digital: 'Digital Product',
                  templates: 'Design Templates',
                  gallery: 'Gallery'
                }
                const isActive = activeTab === tab
                return (
                  <motion.a
                    key={tab}
                    href={getTabHref(tab, null)}
                    aria-current={isActive ? 'page' : undefined}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } }
                    }}
                    onClick={(event) => {
                      if (
                        event.button !== 0
                        || event.metaKey
                        || event.ctrlKey
                        || event.shiftKey
                        || event.altKey
                      ) return

                      event.preventDefault()
                      if (tab === 'resume') {
                        trackPortfolioEvent('resume_viewed', { location: 'navigation' })
                      }
                      toggleTab(tab)
                    }}
                    className={`relative w-full flex items-center justify-between px-6 py-4 lg:py-3 transition-colors duration-300 z-10 select-none rounded-sm ${isActive ? 'text-black font-black' : 'text-black/60 hover:text-black'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBg"
                        className="absolute inset-0 bg-black/5 rounded-sm -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="uppercase text-[11px] lg:text-[11px] tracking-[0.2em]">{labelMap[tab]}</span>
                    {isActive ? (
                      <motion.div
                        layoutId="activeTabDot"
                        className="w-1.5 h-1.5 rounded-full bg-black"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                    )}
                  </motion.a>
                )
              })}
            </motion.nav>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.04
                  }
                }
              }}
              className="px-12 py-10 space-y-10"
            >
              <div className="hidden lg:block">
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-8 text-black/50">Academic Background</h2>
                <div className="space-y-8">
                  {DATA.education.map((edu, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
                      }}
                      className="group"
                    >
                      <p className="text-[11px] font-black uppercase tracking-tight leading-tight mb-2">{edu.school}</p>
                      <p className="text-[9px] text-black/60 font-bold uppercase tracking-widest">{edu.period} | {edu.level}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social Links Block */}
              <div className="pt-8 lg:pt-4 border-t border-black/5">
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-black/50">Featured Links</h2>
                <div className="flex items-center gap-3">
                  {DATA.links.map((link, idx) => (
                    <motion.a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-black/5 hover:bg-black/10 border border-black/5 hover:border-black/15 text-black/50 hover:text-black transition-all duration-300 rounded-sm flex items-center justify-center shrink-0"
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Visit my ${link.name} profile`}
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

          </motion.div>
        </aside>

        {/* Main Content - Minimalist Professional Portfolio */}
        <main id="main" className="flex-1 flex flex-col min-h-screen bg-white relative">
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="hidden lg:flex px-16 py-12 justify-between items-center bg-white"
          >
            <div className="flex items-center space-x-4">
              {/* Title Removed */}
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={toggleDarkMode}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleDarkMode()
                  }
                }}
                className="group flex items-center space-x-3 text-black/40 hover:text-black transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>
              <div className="flex items-center space-x-4 group">
                <div className="w-2 h-2 rounded-full bg-black"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open to Web & System Roles</span>
              </div>
            </div>
          </motion.header>

          <div className="flex-1 px-8 lg:px-16 pb-16 relative">
            <AnimatePresence mode="wait">
              {activeTab === 'main' && (
                <motion.article
                  key="main"
                  initial={{ opacity: 0, y: 14 }}
                  animate={isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="home-intro"
                >
                  <section className="home-hero" aria-labelledby="home-heading">
                    <div className="home-hero-copy">
                      <p className="home-eyebrow">{DATA.homepage.eyebrow}</p>
                      <h1 id="home-heading">{DATA.homepage.headline}</h1>
                    </div>

                    <div className="home-hero-detail">
                      <p>{DATA.homepage.lede}</p>
                      <div className="home-actions">
                        <a
                          href={resumeUrl}
                          download="JanHarryMadrona_RESUME-JULY2026.pdf"
                          className="home-action-primary"
                          onClick={() => trackPortfolioEvent('resume_downloaded', { location: 'hero' })}
                        >
                          Download resume
                          <Package aria-hidden="true" />
                        </a>
                        <a
                          className="home-action-text"
                          href={getTabHref('case-study', 'aira')}
                          onClick={(event) => {
                            if (
                              event.button !== 0
                              || event.metaKey
                              || event.ctrlKey
                              || event.shiftKey
                              || event.altKey
                            ) return

                            event.preventDefault()
                            trackPortfolioEvent('case_study_opened', { project: 'aira', location: 'hero' })
                            toggleTab('case-study', 'aira')
                          }}
                        >
                          Read AIRA case study
                          <ExternalLink aria-hidden="true" />
                        </a>
                        <a
                          className="home-action-text"
                          href={`mailto:${DATA.email}`}
                          onClick={() => trackPortfolioEvent('email_clicked', { location: 'hero' })}
                        >
                          Email me
                          <Mail aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </section>

                  <ul className="home-credential-strip" aria-label="Verified portfolio evidence">
                    <li>
                      <strong>480h</strong>
                      <span>CLSU MISO internship</span>
                    </li>
                    <li>
                      <strong>03</strong>
                      <span>Detailed case studies</span>
                    </li>
                    <li>
                      <strong>02</strong>
                      <span>Live systems to inspect</span>
                    </li>
                  </ul>

                  <section className="home-proof home-proof--ledger" aria-labelledby="proof-heading">
                    <div className="home-section-label">
                      <span>Technical proof</span>
                      <h2 id="proof-heading">Inspect the decisions behind the work.</h2>
                    </div>

                    <ProjectProofLedger
                      projects={DATA.homepage.ledger}
                      onOpenCaseStudy={(caseStudyId) => {
                        toggleTab('case-study', caseStudyId)
                      }}
                    />
                  </section>

                  <section className="home-bio" aria-labelledby="bio-heading">
                    <div className="home-section-label">
                      <span>About / 2026</span>
                      <h2 id="bio-heading">How I approach the work.</h2>
                    </div>

                    <div className="home-bio-copy">
                      {DATA.homepage.bio.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    <aside className="home-principles" aria-label="How I work">
                      <p>How I work</p>
                      <ol>
                        {DATA.homepage.principles.map((principle, index) => (
                          <li key={principle}>
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            {principle}
                          </li>
                        ))}
                      </ol>
                    </aside>
                  </section>

                  <section className="home-close" aria-labelledby="contact-heading">
                    <div>
                      <p className="home-eyebrow">Open to web and system development roles</p>
                      <h2 id="contact-heading">
                        If your team is stuck with a slow manual process, I can help make it easier to manage.
                      </h2>
                    </div>
                    <div className="home-close-actions">
                      <a
                        href={`mailto:${DATA.email}`}
                        onClick={() => trackPortfolioEvent('email_clicked', { location: 'closing_cta' })}
                      >
                        {DATA.email}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          trackPortfolioEvent('resume_viewed', { location: 'closing_cta' })
                          toggleTab('resume')
                        }}
                      >
                        Read my resume
                        <FileText aria-hidden="true" />
                      </button>
                    </div>
                  </section>
                </motion.article>
              )}

              {activeTab === 'case-study' && (
                <motion.div
                  key={activeCaseStudy ? `case-study-${activeCaseStudy}` : 'case-study-hub'}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full"
                >
                  {activeCaseStudy ? (
                    <ProjectCaseStudy
                      caseStudyId={activeCaseStudy}
                      onBack={() => toggleTab('case-study', null)}
                    />
                  ) : (
                    <CaseStudyHub
                      onSelectCaseStudy={(id) => toggleTab('case-study', id)}
                    />
                  )}
                </motion.div>
              )}

              {activeTab === 'resume' && (
                <motion.div
                  key="resume"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full flex flex-col lg:overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-6 lg:space-y-0 shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
                      <h1 className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center text-black/50">
                        <FileText className="w-4 h-4 mr-4 shrink-0" /> Resume
                      </h1>

                      {/* View Mode Toggle Pill */}
                      <div className="flex bg-black/5 rounded-full p-1 border border-black/5 self-start sm:self-auto select-none">
                        <button
                          onClick={() => setResumeViewMode('interactive')}
                          className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-full transition-all duration-300 ${resumeViewMode === 'interactive'
                            ? 'bg-black text-white shadow-sm'
                            : 'text-black/60 hover:text-black'
                            }`}
                        >
                          Interactive
                        </button>
                        <button
                          onClick={() => setResumeViewMode('pdf')}
                          className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-full transition-all duration-300 ${resumeViewMode === 'pdf'
                            ? 'bg-black text-white shadow-sm'
                            : 'text-black/60 hover:text-black'
                            }`}
                        >
                          PDF View
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackPortfolioEvent('resume_opened', { location: 'resume_tab' })}
                        className="bg-black/5 hover:bg-black/10 text-black px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 select-none rounded-sm border border-black/10"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open PDF</span>
                      </a>
                      <a
                        href={resumeUrl}
                        download="JanHarryMadrona_RESUME-JULY2026.pdf"
                        onClick={() => trackPortfolioEvent('resume_downloaded', { location: 'resume_tab' })}
                        className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center space-x-2 select-none rounded-sm"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    </div>
                  </div>

                  {/* PDF View Container */}
                  <div className={`flex-1 flex flex-col ${resumeViewMode === 'pdf' ? '' : 'hidden'}`}>
                    <div className="flex-1 bg-black/5 border border-black/5 overflow-hidden relative group rounded-sm min-h-[600px]">
                      {resumeViewMode === 'pdf' && (
                        <object
                          data={resumeUrl}
                          type="application/pdf"
                          className="w-full h-full min-h-[600px]"
                        >
                          <embed
                            src={resumeUrl}
                            type="application/pdf"
                            className="w-full h-full min-h-[600px]"
                          />
                          <iframe
                            src={resumeUrl}
                            className="w-full h-full border-none min-h-[600px]"
                            title="Resume Preview"
                          >
                            <p className="p-6 text-center text-xs">
                              Your browser does not support embedded PDF viewing.{' '}
                              <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline font-bold"
                              >
                                Click here to open the PDF directly in a new tab
                              </a>.
                            </p>
                          </iframe>
                        </object>
                      )}
                      <div className="absolute inset-0 pointer-events-none border border-black/5 group-hover:border-black/10 transition-colors"></div>
                    </div>
                    <span className="text-[10px] text-black/40 mt-2 select-none">
                      Note: If preview is blank, your browser or download manager (like IDM) may intercept PDFs. Click "Open PDF" above to view directly in a new tab.
                    </span>
                  </div>

                  {/* Interactive CV Render */}
                  {resumeViewMode === 'interactive' && (
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 lg:pr-6 pb-8">
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white border border-black/5 rounded-sm p-8 md:p-12 space-y-12 transition-all duration-300 hover:border-black/10"
                      >
                        {/* Header Block: Name and Avatar */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-black/5 pb-8">
                          <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none text-black">
                              Jan Harry I. Madrona
                            </h2>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
                              Web Developer & Designer / Software Engineer / AI Developer
                            </p>
                            <div className="text-[11px] text-black/60 leading-relaxed space-y-1 font-medium">
                              <p className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-2 shrink-0" /> San Agustin, Guimba, Nueva Ecija, Philippines</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
                                <a href="mailto:Janharrymadrona1000@gmail.com" className="hover:text-black hover:underline transition-colors flex items-center">
                                  <Mail className="w-3.5 h-3.5 mr-1.5 shrink-0" /> Janharrymadrona1000@gmail.com
                                </a>
                                <a href="tel:+639776255563" className="hover:text-black hover:underline transition-colors flex items-center">
                                  <Phone className="w-3.5 h-3.5 mr-1.5 shrink-0" /> +63 977 625 5563
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Image Box */}
                          <div className="relative group shrink-0 self-start">
                            <div className="w-24 h-24 md:w-28 md:h-28 overflow-hidden bg-black/5 border border-black/5 rounded-sm">
                              <img
                                src="/gallery/Graduation_pic.png"
                                alt="Jan Harry I. Madrona"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-105 hover:scale-100"
                              />
                            </div>
                            <div className="absolute inset-0 border border-black/5 pointer-events-none group-hover:border-black/20 transition-colors rounded-sm"></div>
                          </div>
                        </div>

                        {/* Summary Block */}
                        <div className="space-y-4">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Summary</h3>
                          <p className="text-[12px] md:text-[13px] leading-relaxed opacity-85 font-medium max-w-prose">
                            Full-stack web developer and designer building web applications with Laravel, React, and Next.js. Experience building custom management systems, administrative dashboards, and AI-assisted data workflows for academic institutions, local government, and independent projects. Focuses on clean interfaces, reliable code, and fast user experiences.
                          </p>
                        </div>

                        {/* 2-Column Split */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                          {/* Left Column (Span 7) - Experience & Projects */}
                          <div className="lg:col-span-7 space-y-12">

                            {/* Experience Section */}
                            <div className="space-y-6">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-2">Experience</h3>
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start gap-4">
                                    <h4 className="text-[13px] font-black uppercase tracking-tight">Management Information Systems Office (MISO)</h4>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-black/50 shrink-0">Internship</span>
                                  </div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-black/60">Intern / System Developer</p>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start gap-4">
                                    <h4 className="text-[13px] font-black uppercase tracking-tight">Freelance / Independent Projects</h4>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-black/50 shrink-0">Ongoing</span>
                                  </div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-black/60">Full-Stack and Laravel System Development</p>
                                </div>
                              </div>
                            </div>

                            {/* Projects Section */}
                            <div className="space-y-6">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-2">Projects</h3>
                              <div className="space-y-8">
                                <div className="space-y-2 group">
                                  <div className="flex justify-between items-center gap-4">
                                    <h4 className="text-[13px] font-black uppercase tracking-tight group-hover:text-black transition-colors flex items-center">
                                      Scholarship Portal (CLSU ERDT)
                                    </h4>
                                    <a href="https://clsu-erdt.com/" target="_blank" rel="noopener noreferrer" className="text-[9px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors flex items-center shrink-0" aria-label="Visit Scholarship Portal website">
                                      Website <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                    </a>
                                  </div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-black/60">Lead Developer • TALL Stack • Hostinger</p>
                                  <p className="text-[11px] leading-relaxed opacity-80 font-medium max-w-prose">
                                    I built CLSU's scholarship site with the TALL stack (Tailwind CSS, Alpine.js, Laravel, Livewire) hosted on Hostinger to handle online applications and student record reviews.
                                  </p>
                                </div>

                                <div className="space-y-2 group">
                                  <div className="flex justify-between items-center gap-4">
                                    <h4 className="text-[13px] font-black uppercase tracking-tight group-hover:text-black transition-colors flex items-center">
                                      Barangay Management System
                                    </h4>
                                    <a href="https://github.com/zynxoso/BARANGAY-MANAGEMENT-SYSTEM-ACCESS" target="_blank" rel="noopener noreferrer" className="text-[9px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors flex items-center shrink-0" aria-label="Visit Barangay Management System GitHub repository">
                                      GitHub <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                    </a>
                                  </div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-black/60">Lead Developer</p>
                                  <p className="text-[11px] leading-relaxed opacity-80 font-medium max-w-prose">
                                    A local database app that digitized community record-keeping for staff.
                                  </p>
                                </div>

                                <div className="space-y-2 group">
                                  <div className="flex justify-between items-center gap-4">
                                    <h4 className="text-[13px] font-black uppercase tracking-tight group-hover:text-black transition-colors flex items-center">
                                      AIRA-GEN (Reports AI)
                                    </h4>
                                    <a href="https://github.com/zynxoso/AIRA-GEN" target="_blank" rel="noopener noreferrer" className="text-[9px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors flex items-center shrink-0" aria-label="Visit AIRA-GEN GitHub repository">
                                      GitHub <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                    </a>
                                  </div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-black/60">Lead AI Developer</p>
                                  <p className="text-[11px] leading-relaxed opacity-80 font-medium max-w-prose">
                                    A Laravel and Livewire app that reads text from uploaded forms and pictures, saves it, and exports reports.
                                  </p>
                                </div>

                                <div className="space-y-2 group">
                                  <div className="flex justify-between items-center gap-4">
                                    <h4 className="text-[13px] font-black uppercase tracking-tight group-hover:text-black transition-colors flex items-center">
                                      AIRA-LOGIX
                                    </h4>
                                    <a href="https://github.com/zynxoso/AIRA-LOGIX" target="_blank" rel="noopener noreferrer" className="text-[9px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors flex items-center shrink-0" aria-label="Visit AIRA-LOGIX GitHub repository">
                                      GitHub <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                    </a>
                                  </div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-black/60">Internship Project Contributor</p>
                                  <p className="text-[11px] leading-relaxed opacity-80 font-medium max-w-prose">
                                    I added task assignment and progress tracking features to keep the team organized.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Significant Roles */}
                            <div className="space-y-6">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-2">Significant Roles</h3>
                              <div className="space-y-4">
                                <div className="flex justify-between items-baseline gap-4">
                                  <span className="text-[12px] font-black uppercase tracking-tight">Lead Web Developer</span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-black/50 shrink-0">Recent Projects</span>
                                </div>
                                <div className="flex justify-between items-baseline gap-4">
                                  <span className="text-[12px] font-black uppercase tracking-tight">Web & UI Designer</span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-black/50 shrink-0">Freelance / Custom Sites</span>
                                </div>
                                <div className="flex justify-between items-baseline gap-4">
                                  <span className="text-[12px] font-black uppercase tracking-tight">Lead AI Developer</span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-black/50 shrink-0">AIRA-GEN (Reports AI)</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column (Span 5) - Skills, Education, Certs */}
                          <div className="lg:col-span-5 space-y-12">

                            {/* Skills Section */}
                            <div className="space-y-6">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-2">Skills</h3>
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-black/60">Languages & Core Tech</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {['PHP', 'Python', 'JavaScript', 'SQL'].map(s => (
                                      <span key={s} className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-black/5 rounded-sm text-black/75">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-black/60">Frameworks & Libraries</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {['Laravel', 'Livewire', 'React', 'Django', 'Tailwind CSS'].map(s => (
                                      <span key={s} className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-black/5 rounded-sm text-black/75">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-black/60">Databases & Tools</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {['MySQL', 'Git/GitHub', 'Composer', 'Node.js', 'XAMPP'].map(s => (
                                      <span key={s} className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-black/5 rounded-sm text-black/75">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-black/60">Specializations</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {['AI Automation', 'System Development', 'Web App Architecture', 'Technical Content'].map(s => (
                                      <span key={s} className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-black/5 rounded-sm text-black/75">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Education Section */}
                            <div className="space-y-6">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-2">Education</h3>
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <div className="flex justify-between items-baseline gap-4">
                                    <p className="text-[11px] font-black uppercase tracking-tight">BS Information Technology</p>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-black/50 shrink-0">2021-2026</span>
                                  </div>
                                  <p className="text-[10px] text-black/60 font-bold uppercase tracking-widest leading-none">CLSU</p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between items-baseline gap-4">
                                    <p className="text-[11px] font-black uppercase tracking-tight">Senior High Graduate</p>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-black/50 shrink-0">2021</span>
                                  </div>
                                  <p className="text-[10px] text-black/60 font-bold uppercase tracking-widest leading-none">Galvan High School</p>
                                </div>
                              </div>
                            </div>

                            {/* Certifications Section */}
                            <div className="space-y-6">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-2">Certifications</h3>
                              <div className="space-y-3">
                                {[
                                  "CS50 AI with Python (HarvardX)",
                                  "TOPCIT IT Competency (IITP)",
                                  "IT Specialist in Web (Pearson VUE)",
                                  "Kaggle: Data Visualization",
                                  "Kaggle: Pandas for Data Science"
                                ].map((cert, idx) => (
                                  <div key={idx} className="flex items-start space-x-2 text-[11px] font-medium leading-relaxed opacity-85">
                                    <span className="text-black/30 shrink-0 mt-0.5">•</span>
                                    <span>{cert}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* References Block */}
                        <div className="border-t border-black/5 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px]">
                          <div className="space-y-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">References</h3>
                            <p className="opacity-80 font-medium max-w-prose">Available upon request.</p>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Declaration</h3>
                            <p className="opacity-80 font-medium max-w-prose">I hereby declare that the above-mentioned information is true and correct to the best of my knowledge and belief.</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'digital' && (
                <motion.div
                  key="digital"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full flex flex-col lg:overflow-hidden"
                >
                  <div className="mb-8 shrink-0">
                    <h1 className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center text-black/50">
                      <Package className="w-4 h-4 mr-4 shrink-0" /> Digital Products
                    </h1>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 lg:pr-6 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {DATA.digitalProducts.map((product, idx) => (
                        <motion.div
                          key={idx}
                          className="group bg-white border border-black/5 p-6 rounded-sm flex flex-col justify-between space-y-6 transition-all duration-300 hover:border-black/10 hover:shadow-sm"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.4 }}
                        >
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="p-2.5 bg-black/5 rounded-sm text-black/40 group-hover:text-black group-hover:bg-black/10 transition-colors shrink-0">
                                {product.icon}
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-black/5 text-black/60 rounded-sm select-none">
                                {product.tag}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-sm font-black uppercase tracking-tight leading-tight">
                                {product.name}
                              </h3>
                              <p className="text-[11px] leading-relaxed opacity-75 font-medium max-w-prose">
                                {product.desc}
                              </p>
                            </div>
                          </div>

                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center inline-block py-3 border border-black bg-black text-white hover:bg-transparent hover:text-black transition-colors duration-300 font-black text-[9px] tracking-widest uppercase select-none rounded-sm"
                          >
                            {product.cta || "Access Notion"}
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'templates' && (
                <motion.div
                  key="templates"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full flex flex-col lg:overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 shrink-0">
                    <div className="space-y-3">
                      <h1 className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center text-black/50">
                        <Palette className="w-4 h-4 mr-4 shrink-0" /> Design Templates
                      </h1>
                      <p className="text-[12px] leading-relaxed opacity-70 font-medium max-w-xl">
                        Canva-ready layouts and visual systems. Each preview opens the editable design in Canva.
                      </p>
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">
                      {DATA.designTemplates.length} Templates
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 lg:pr-6 pb-8">
                    {DATA.designTemplates.length === 0 ? (
                      <div className="min-h-[360px] border border-black/5 bg-black/[0.015] rounded-sm flex flex-col items-center justify-center text-center px-8">
                        <Palette className="w-8 h-8 text-black/20 mb-6" />
                        <h3 className="text-sm font-black uppercase tracking-tight mb-2">No templates yet</h3>
                        <p className="text-[12px] text-black/50 font-medium max-w-sm">
                          Add your Canva template records in the data file to show previews here.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {DATA.designTemplates.map((template, idx) => {
                          const isFeatured = idx === 0
                          return (
                            <motion.article
                              key={template.name}
                              role="link"
                              tabIndex={0}
                              onClick={() => window.open(template.canvaUrl, '_blank', 'noopener,noreferrer')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  window.open(template.canvaUrl, '_blank', 'noopener,noreferrer')
                                }
                              }}
                              aria-label={`Open ${template.name} in Canva`}
                              className={`group bg-white border border-black/5 rounded-sm overflow-hidden transition-all duration-300 hover:border-black/15 hover:bg-black/[0.01] cursor-pointer ${isFeatured ? 'xl:col-span-2' : ''
                                }`}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.08, duration: 0.4, ease: "easeOut" }}
                              whileHover={{ y: -4, transition: { duration: 0.2 } }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className={`${isFeatured ? 'grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]' : 'flex flex-col'} h-full`}>
                                <div className={`relative bg-black/5 overflow-hidden p-3 ${isFeatured ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
                                  <img
                                    src={template.preview}
                                    alt={`${template.name} preview`}
                                    className="w-full h-full object-contain transition-all duration-700 group-hover:scale-[1.02]"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                </div>

                                <div className={`flex flex-col justify-between gap-8 p-6 ${isFeatured ? 'lg:p-8' : ''}`}>
                                  <div className="space-y-5">
                                    <div className="flex items-center justify-between gap-4">
                                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-black/5 text-black/60 rounded-sm">
                                        {template.category}
                                      </span>
                                      <span className="text-[9px] font-black uppercase tracking-widest text-black/35">
                                        {template.format}
                                      </span>
                                    </div>

                                    <div className="space-y-3">
                                      <h3 className={`${isFeatured ? 'text-xl md:text-2xl' : 'text-sm'} font-black uppercase tracking-tight leading-tight text-black`}>
                                        {template.name}
                                      </h3>
                                      <p className="text-[12px] leading-relaxed opacity-75 font-medium max-w-prose">
                                        {template.desc}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-5">
                                    <div className="flex flex-wrap gap-1.5">
                                      {template.tools.map((tool, toolIdx) => (
                                        <span key={toolIdx} className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-black/5 text-black/60 rounded-sm">
                                          {tool}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-sm text-[9px] font-black uppercase tracking-widest group-hover:bg-black/80 transition-colors">
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>Open in Canva</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.article>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}



              {activeTab === 'gallery' && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full flex flex-col lg:overflow-hidden"
                >
                  {/* Gallery Control Header */}
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 shrink-0">
                    <h1 className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center text-black/50">
                      <LayoutGrid className="w-4 h-4 mr-4 shrink-0" /> Gallery
                    </h1>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
                      {/* Filter Tabs Pill */}
                      <div className="flex bg-black/5 rounded-full p-1 border border-black/5 select-none overflow-x-auto max-w-full no-scrollbar">
                        {(['all', 'certs', 'projects'] as const).map((filter) => {
                          const filterLabelMap: Record<string, string> = {
                            all: 'All',
                            certs: 'Certifications',
                            projects: 'Projects'
                          }
                          return (
                            <button
                              key={filter}
                              onClick={() => setGalleryFilter(filter)}
                              className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-full transition-all duration-300 shrink-0 ${galleryFilter === filter
                                ? 'bg-black text-white shadow-sm'
                                : 'text-black/60 hover:text-black'
                                }`}
                            >
                              {filterLabelMap[filter]}
                            </button>
                          )
                        })}
                      </div>

                      {/* View Mode Toggle Switcher */}
                      <div className="flex bg-black/5 rounded-full p-1 border border-black/5 select-none shrink-0 self-start sm:self-auto">
                        <button
                          onClick={() => setGalleryViewMode('masonry')}
                          className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5 ${galleryViewMode === 'masonry'
                            ? 'bg-black text-white shadow-sm'
                            : 'text-black/60 hover:text-black'
                            }`}
                          title="Masonry Stream"
                        >
                          <Columns className="w-3 h-3" />
                          <span>Stream</span>
                        </button>
                        <button
                          onClick={() => setGalleryViewMode('inspector')}
                          className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5 ${galleryViewMode === 'inspector'
                            ? 'bg-black text-white shadow-sm'
                            : 'text-black/60 hover:text-black'
                            }`}
                          title="Inspector Grid"
                        >
                          <List className="w-3 h-3" />
                          <span>Inspector</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Gallery Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 lg:pr-6 pb-8">
                    {galleryViewMode === 'masonry' ? (
                      /* Masonry Stream Mode */
                      <motion.div
                        layout
                        className="columns-1 md:columns-2 gap-8 space-y-8 pb-10"
                      >
                        {DATA.gallery
                          .filter((item) => {
                            if (galleryFilter === 'all') return true
                            if (galleryFilter === 'certs') return item.category === 'Achievement'
                            if (galleryFilter === 'projects') return item.category === 'Web Development' || item.category === 'System Development'
                            return true
                          })
                          .map((item) => (
                            <motion.div
                              layout
                              key={item.img}
                              onClick={() => setActiveImage(item)}
                              className="group relative break-inside-avoid overflow-hidden bg-black/5 border border-black/5 cursor-pointer rounded-sm"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            >
                              <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 backdrop-blur-[2px]">
                                <div className="flex justify-between items-center mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">
                                    {item.category}
                                  </p>
                                  {item.verified && (
                                    <span className="text-[8px] font-black uppercase bg-white/10 text-white px-2 py-0.5 rounded-sm">
                                      VERIFIED
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-base font-black uppercase tracking-tighter text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                  {item.title}
                                </h3>
                              </div>
                            </motion.div>
                          ))}
                      </motion.div>
                    ) : (
                      /* Inspector Grid Mode (Dense technical details) */
                      <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10"
                      >
                        {DATA.gallery
                          .filter((item) => {
                            if (galleryFilter === 'all') return true
                            if (galleryFilter === 'certs') return item.category === 'Achievement'
                            if (galleryFilter === 'projects') return item.category === 'Web Development' || item.category === 'System Development'
                            return true
                          })
                          .map((item) => (
                            <motion.div
                              layout
                              key={item.img}
                              onClick={() => setActiveImage(item)}
                              className="group bg-white border border-black/5 p-5 rounded-sm flex flex-col justify-between space-y-5 cursor-pointer transition-all duration-300 hover:border-black/15 hover:shadow-sm"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                              whileHover={{ y: -4 }}
                            >
                              <div className="space-y-4">
                                {/* Top Header Specs */}
                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-black/40">
                                  <span className="px-2 py-0.5 bg-black/5 rounded-sm text-black/60">
                                    {item.category}
                                  </span>
                                  {item.verified ? (
                                    <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                                      <span className="w-1 h-1 bg-emerald-600 rounded-full mr-1.5 shrink-0" />
                                      <span>VERIFIED</span>
                                    </div>
                                  ) : (
                                    <span className="text-black/30">DRAFT</span>
                                  )}
                                </div>

                                {/* Aspect-Ratio Thumbnail Box */}
                                <div className="relative aspect-[16/10] bg-black/5 overflow-hidden border border-black/5 rounded-sm">
                                  <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                    loading="lazy"
                                  />
                                </div>

                                {/* Text Details */}
                                <div className="space-y-2">
                                  <h3 className="text-xs font-black uppercase tracking-tight leading-tight group-hover:text-black transition-colors">
                                    {item.title}
                                  </h3>
                                  <p className="text-[11px] leading-relaxed opacity-70 line-clamp-2 font-medium max-w-prose">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>

                              {/* Tech & Date Footer block */}
                              <div className="border-t border-black/5 pt-4 flex flex-col gap-2.5">
                                <div className="flex flex-wrap gap-1">
                                  {item.tech.slice(0, 3).map((tag, tIdx) => (
                                    <span key={tIdx} className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-black/5 text-black/60 rounded-sm">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex justify-between items-center text-[9px] font-black text-black/40 uppercase tracking-widest">
                                  <span>Captured:</span>
                                  <span>{item.date}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Lightbox Modal Viewer */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-8 cursor-zoom-out select-none"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full h-[90vh] md:h-[75vh] bg-white dark:bg-[#0f1011] border border-black/10 dark:border-[#23252a] rounded-sm shadow-2xl flex flex-col md:flex-row cursor-default overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors p-2 z-10 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Media Viewer */}
              <div className="flex-1 md:w-3/5 bg-black/[0.02] dark:bg-white/[0.01] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-black/5 dark:border-[#23252a] overflow-hidden min-h-[40vh] md:min-h-0">
                <img
                  src={activeImage.img}
                  alt={activeImage.title}
                  className="max-w-full max-h-[35vh] md:max-h-[60vh] object-contain rounded-sm select-all"
                />
              </div>

              {/* Right Side: Technical Inspector Panel */}
              <div className="w-full md:w-2/5 flex flex-col justify-between p-8 bg-white dark:bg-[#0f1011] overflow-y-auto custom-scrollbar">
                <div className="space-y-8">
                  {/* Status & Category */}
                  <div className="flex justify-between items-center select-none pt-2">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 rounded-sm">
                      {activeImage.category}
                    </span>
                    {activeImage.verified ? (
                      <div className="flex items-center text-[9px] font-black text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/35 px-2 py-0.5 rounded-sm">
                        <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-500 rounded-full mr-1.5 shrink-0" />
                        <span>VERIFIED CREDENTIAL</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-[9px] font-black text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-sm">
                        <span className="w-1.5 h-1.5 bg-black/40 dark:bg-white/40 rounded-full mr-1.5 shrink-0" />
                        <span>PERSONAL ARCHIVE</span>
                      </div>
                    )}
                  </div>

                  {/* Asset Title */}
                  <div className="space-y-2 text-left">
                    <h2 className="text-sm md:text-base font-black uppercase tracking-tight leading-tight text-black dark:text-white">
                      {activeImage.title}
                    </h2>
                  </div>

                  {/* Technical Specs Table */}
                  <div className="border-t border-b border-black/5 dark:border-[#23252a] py-4 space-y-3 font-medium text-[11px] text-left">
                    <div className="flex justify-between gap-4">
                      <span className="text-black/40 dark:text-white/40 uppercase tracking-widest text-[9px] shrink-0">File Path</span>
                      <span className="font-mono text-black/80 dark:text-white/80 select-all truncate text-right">{activeImage.img}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 dark:text-white/40 uppercase tracking-widest text-[9px]">Captured / Issued</span>
                      <span className="text-black/80 dark:text-white/80">{activeImage.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 dark:text-white/40 uppercase tracking-widest text-[9px]">Category Class</span>
                      <span className="text-black/80 dark:text-white/80">{activeImage.category}</span>
                    </div>
                  </div>

                  {/* Context Description */}
                  <div className="space-y-2.5 text-left">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">Context / Description</h3>
                    <p className="text-[12px] leading-relaxed text-black/75 dark:text-white/75 font-medium max-w-prose">
                      {activeImage.desc}
                    </p>
                  </div>

                  {/* Tech Stack involved */}
                  <div className="space-y-3 text-left">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">Metadata Tags</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {activeImage.tech.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-black/5 dark:bg-white/5 text-black/75 dark:text-white/75 rounded-sm font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-auto border-t border-black/5 dark:border-[#23252a]">
                  <a
                    href={activeImage.img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 border border-black/15 dark:border-[#23252a] hover:border-black dark:hover:border-white text-[9px] font-black uppercase tracking-widest text-black dark:text-white transition-colors rounded-sm flex items-center justify-center space-x-2 select-none"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Full Image</span>
                  </a>
                  <button
                    onClick={() => setActiveImage(null)}
                    className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 text-[9px] font-black uppercase tracking-widest transition-colors rounded-sm select-none cursor-pointer"
                  >
                    Close Inspector
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
