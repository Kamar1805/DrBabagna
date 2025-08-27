import { useEffect, useState, useRef } from 'react'
import './Home.css'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  /* Education slides */
  const eduSlides = [
    { degree: 'PhD, Epidemiology', school: 'University of Salford, Manchester, UK', year: '—' },
    { degree: 'M.Sc, Environmental & Public Health', school: 'University of Salford, UK', year: '—' },
    { degree: 'DVM, Veterinary Medicine', school: 'University of Maiduguri, Nigeria', year: '—' }
  ]
  const [eduIndex, setEduIndex] = useState(0)

  /* Awards slides */
  const awardSlides = [
    { title: 'Excellence in One Health Leadership', host: 'African Public Health Consortium', year: '2023', img: '/awards/one-health.png' },
    { title: 'Research Impact Award', host: 'Salford Alumni Association', year: '2022', img: '/awards/research-impact.png' },
    { title: 'Public Service & Collaboration Honor', host: 'Regional Health & Vet Council', year: '2021', img: '/awards/public-service.png' }
  ]
  const [awardIndex, setAwardIndex] = useState(0)

  /* Hero: single image + rotating taglines */
  const heroImage = '/hero/hero1.png'
  const heroTaglines = [
    'Group Managing Director · Researcher · Public Figure',
    'Innovator | Developer | Business Leader',
    'Passionate about sustainable development'
  ]
  const [taglineIndex, setTaglineIndex] = useState(0)

  /* About mobile expand */
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width:700px)').matches)
  const [aboutExpanded, setAboutExpanded] = useState(() => !window.matchMedia('(max-width:700px)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(max-width:700px)')
    const handler = e => {
      setIsMobile(e.matches)
      setAboutExpanded(!e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  /* Reveal on scroll */
  useEffect(() => {
    const els = document.querySelectorAll('.home .reveal')
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  /* Auto sliders */
  useEffect(() => {
    const id = setInterval(() => setEduIndex(i => (i + 1) % eduSlides.length), 4500)
    return () => clearInterval(id)
  }, [eduSlides.length])

  useEffect(() => {
    const id = setInterval(() => setAwardIndex(i => (i + 1) % awardSlides.length), 5000)
    return () => clearInterval(id)
  }, [awardSlides.length])

  /* Hero tagline rotation */
  useEffect(() => {
    const id = setInterval(() => setTaglineIndex(i => (i + 1) % heroTaglines.length), 4000)
    return () => clearInterval(id)
  }, [heroTaglines.length])

  const prevEdu = () => setEduIndex(i => (i - 1 + eduSlides.length) % eduSlides.length)
  const nextEdu = () => setEduIndex(i => (i + 1) % eduSlides.length)

  const prevAward = () => setAwardIndex(i => (i - 1 + awardSlides.length) % awardSlides.length)
  const nextAward = () => setAwardIndex(i => (i + 1) % awardSlides.length)

  /* Contact form state */
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' })
  const [contactSending, setContactSending] = useState(false)
  const [contactStatus, setContactStatus] = useState(null) // 'ok' | 'error'
  const handleContactChange = e => {
    const { name, value } = e.target
    setContactData(d => ({ ...d, [name]: value }))
  }
  const handleContactSubmit = async (e) => {
    e.preventDefault()
    if (contactSending) return
    if (!contactData.name || !contactData.email || !contactData.message) return
    setContactStatus(null)
    setContactSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      })
      if (!res.ok) throw new Error('Send failed')
      setContactStatus('ok')
      setContactData({ name: '', email: '', message: '' })
      setTimeout(() => setContactStatus(null), 6000)
    } catch (err) {
      setContactStatus('error')
      setTimeout(() => setContactStatus(null), 7000)
    } finally {
      setContactSending(false)
    }
  }

  /* Anchor smooth scroll */
  const handleAnchor = (e) => {
    if (e && e.preventDefault) {
      const href = e.currentTarget.getAttribute('href')
      if (href?.startsWith('#')) {
        e.preventDefault()
        const el = document.querySelector(href)
        if (el) {
          const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72
          const top = el.getBoundingClientRect().top + window.scrollY - headerH + 4
          window.scrollTo({ top, behavior: 'smooth' })
          el.classList.add('pulse')
          setTimeout(() => el.classList.remove('pulse'), 900)
        }
      }
    }
    setMenuOpen(false)
  }

  /* Focus management for awards */
  const awardTrackRef = useRef(null)
  useEffect(() => {
    const current = awardTrackRef.current?.querySelectorAll('.award-slide')[awardIndex]
    if (current) current.setAttribute('tabindex', '-1')
  }, [awardIndex])

  return (
    <>
      <header className="site-header">
  <div className="container header-inner">
    <a href="#hero" className="brand" onClick={handleAnchor}>
      <img
        src="/header.png"
        alt="Site Logo"
        className="brand-logo"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginRight: '10px',
          verticalAlign: 'middle'
        }}
      />
      <span className="brand-name">Dr. Babagana Adam</span>
    </a>

          <button
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span /><span /><span />
          </button>

          <nav className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Primary">
            <a href="#hero" onClick={handleAnchor}>Home</a>
            <a href="#about" onClick={handleAnchor}>About</a>
            <a href="#education" onClick={handleAnchor}>Education</a>
            <a href="#awards" onClick={handleAnchor}>Awards</a>
            <a href="#contact" className="btn primary" onClick={handleAnchor}>Contact</a>
          </nav>
        </div>
      </header>

      <main className="home">
        {/* Hero */}
        <section id="hero" className="hero section">
          <div className="container hero-inner">
            <div className="hero-text">
              <h1 className="hero-title reveal reveal-left" style={{ '--delay': '0ms' }}>
                <div className='namecover'>
                <span className="name-part">Dr. Babagana</span>
                <span className="name-part">Adam</span>
                <span className="name-part">Mohammed</span>
                </div>
                
              </h1>
              <div className="hero-taglines" aria-live="polite">
                <p key={taglineIndex} className="hero-sub fade-line" style={{ '--delay': '140ms' }}>
                  {heroTaglines[taglineIndex]}
                </p>
              </div>
              <div className="hero-cta reveal reveal-up" style={{ '--delay': '260ms' }}>
                <a className="btn primary" href="https://www.linkedin.com/in/bm-adam/" target="_blank" rel="noreferrer">
                  Connect on LinkedIn
                </a>
                <a className="btn ghost" href="#contact" onClick={handleAnchor}>Contact</a>
              </div>
            </div>
            
          </div>
        </section>

        {/* About */}
        <section id="about" className="section reveal about-section" style={{ '--delay': '80ms' }}>
          <div className="container about-inner">
            <figure className="about-media reveal reveal-right" style={{ '--delay': '120ms' }}>
              <img
                src="/bb.jpeg"
                alt="Dr. Babagana Adam in a professional setting"
                width="520"
                height="520"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="about-text">
              <h2>About</h2>
              <p>
                Experienced Chief Executive Officer with a demonstrated history of working with government,
                non‑governmental organizations and the higher education sector. He is skilled in Veterinary
                Medicine and holds a PhD in Epidemiology from the University of Salford, Manchester (UK),
                applying scientific rigor to drive integrated One Health and public health outcomes.
              </p>
              {(aboutExpanded || !isMobile) && (
                <p>
                  Dr. Babagana Adam combines clinical insight, research depth and strategic leadership to
                  build cross‑sector collaborations, strengthen diagnostics capacity and translate evidence
                  into practical policies that improve population and animal health across Africa and the UK.
                </p>
              )}
              {isMobile && !aboutExpanded && (
                <button
                  type="button"
                  className="btn ghost about-more"
                  onClick={() => setAboutExpanded(true)}
                  aria-expanded={aboutExpanded}
                  aria-controls="about"
                >
                  See more
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Education */}
        <section id="education" className="section reveal" style={{ '--delay': '100ms' }}>
          <div className="container edu-wrap">
            <h2 className="section-title">Education</h2>
            <div className="edu-slider">
              <div className="edu-track" style={{ transform: `translateX(-${eduIndex * 100}%)` }}>
                {eduSlides.map((s, i) => (
                  <article className="edu-slide" key={i} aria-hidden={eduIndex !== i}>
                    <h3 className="degree">{s.degree}</h3>
                    <p className="school">{s.school} <span className="year">{s.year}</span></p>
                  </article>
                ))}
              </div>
              <div className="edu-controls">
                <button className="edu-nav prev" onClick={prevEdu} aria-label="Previous education slide">‹</button>
                <div className="edu-dots" role="tablist">
                  {eduSlides.map((_, i) => (
                    <button
                      key={i}
                      className={`dot ${eduIndex === i ? 'active' : ''}`}
                      aria-label={`Education slide ${i + 1}`}
                      aria-selected={eduIndex === i}
                      onClick={() => setEduIndex(i)}
                    />
                  ))}
                </div>
                <button className="edu-nav next" onClick={nextEdu} aria-label="Next education slide">›</button>
              </div>
            </div>
          </div>
        </section>

        {/* Awards */}
        <section id="awards" className="section reveal awards-section" style={{ '--delay': '110ms' }}>
          <div className="container awards-wrap">
            <h2 className="section-title">Awards & Recognition</h2>
            <div className="awards-slider">
              <div
                ref={awardTrackRef}
                className="awards-track"
                style={{ transform: `translateX(-${awardIndex * 100}%)` }}
              >
                {awardSlides.map((a, i) => (
                  <article key={i} className="award-slide" aria-hidden={awardIndex !== i}>
                    <div className="award-media">
                      <img src={a.img} alt={`${a.title} award`} loading="lazy" decoding="async" />
                    </div>
                    <div className="award-body">
                      <h3 className="award-title">{a.title}</h3>
                      <p className="award-host">{a.host}</p>
                      <p className="award-year">{a.year}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="awards-controls">
                <button className="awards-nav prev" onClick={prevAward} aria-label="Previous award">‹</button>
                <div className="awards-dots" role="tablist">
                  {awardSlides.map((_, i) => (
                    <button
                      key={i}
                      className={`dot ${awardIndex === i ? 'active' : ''}`}
                      aria-label={`Award ${i + 1}`}
                      aria-selected={awardIndex === i}
                      onClick={() => setAwardIndex(i)}
                    />
                  ))}
                </div>
                <button className="awards-nav next" onClick={nextAward} aria-label="Next award">›</button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section reveal contact-teaser" style={{ '--delay': '140ms' }}>
          <div className="container section-inner contact-inner">
            <header className="section-header">
              <h2>Contact</h2>
              <p>For speaking engagements, collaborations, or media inquiries, reach out below.</p>
            </header>
            <form className="contact-mini" onSubmit={handleContactSubmit} noValidate>
              <div className="row">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  value={contactData.name}
                  onChange={handleContactChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={contactData.email}
                  onChange={handleContactChange}
                />
              </div>
              <textarea
                name="message"
                rows={4}
                placeholder="Message"
                required
                value={contactData.message}
                onChange={handleContactChange}
              />
              <div className="actions">
                <button className="btn primary" type="submit" disabled={contactSending}>
                  {contactSending ? 'Sending...' : 'Send'}
                </button>
              </div>
              <div className="contact-status" aria-live="polite" style={{ minHeight: '1.3em', fontSize: '14px', fontWeight: 600 }}>
                {contactStatus === 'ok' && <span style={{ color: 'var(--accent)' }}>Your message has been sent.</span>}
                {contactStatus === 'error' && <span style={{ color: '#c0392b' }}>Failed to send. Try again.</span>}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="foot-left">
            <p>© 2025 Dr. Babagana Adam</p>
          </div>
          <div className="foot-right">
            <a href="mailto:contact@domain.com">contact@domain.com</a>
            <a href="https://www.linkedin.com/in/bm-adam/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  )
}