import Image from "next/image";

type Project = {
  category: string;
  number: string;
  title: string;
  description: string;
  helps: string;
  outcome: string;
  tags: string[];
  href?: string;
  source?: string;
  availability?: string;
  featured?: boolean;
};

const projects: Project[] = [
  {
    category: "Business AI systems",
    number: "01",
    title: "Build Your Business Brain",
    description:
      "A free, no-code workshop that turns scattered business knowledge into one organized AI-ready system—in about 30 minutes.",
    helps: "Coaches, consultants, freelancers, and service providers",
    outcome: "A Business Brain, prompt library, brand kit, and workflow map",
    tags: ["Workshop", "Claude", "No code"],
    href: "https://github.com/jazzy15j/build-your-business-brain",
    featured: true,
  },
  {
    category: "Business AI systems",
    number: "02",
    title: "Business Brain Command Pack",
    description:
      "Six practical commands that turn a Business Brain into a daily operating system for leads, client updates, onboarding, and follow-up.",
    helps: "Service businesses that want calmer, more consistent client work",
    outcome: "Faster daily decisions while keeping every send approval-first",
    tags: ["Claude Code", "Client systems", "Free"],
    href: "https://github.com/jazzy15j/business-brain-command-pack",
  },
  {
    category: "Business AI systems",
    number: "03",
    title: "Command Pack Pro",
    description:
      "Ten advanced commands for the full client lifecycle—from routing an inquiry to delivery, upsells, closing, and revenue tracking.",
    helps: "Growing service providers ready for a fuller operating system",
    outcome: "A connected client workflow with human approval built in",
    tags: ["Operations", "Revenue", "Automation"],
    href: "https://github.com/jazzy15j/business-brain-command-pack-pro",
  },
  {
    category: "Useful everyday tools",
    number: "04",
    title: "Concert Scout",
    description:
      "A free personal concert-alert system that checks Ticketmaster and official local calendars, then emails only new or meaningfully changed matches.",
    helps: "Music fans who want relevant shows without constant searching",
    outcome: "Daily artist, genre, venue, city, and price-aware alerts",
    tags: ["Python", "GitHub Actions", "Email"],
    href: "https://github.com/jazzy15j/concert-alert",
    featured: true,
  },
  {
    category: "Useful everyday tools",
    number: "05",
    title: "Eat Good, Spend Less",
    description:
      "A cozy, install-able household meal planner for two that thinks ahead: it decides dinner, builds the grocery list, and tracks what to use first — so opening the app takes about a minute a day.",
    helps: "Households who want fewer food decisions, not more meal-planning apps",
    outcome: "A daily command center: tonight's dinner, use-first list, and cook-mode instructions",
    tags: ["PWA", "No backend", "Offline-friendly"],
    href: "/eat-good-spend-less",
    featured: true,
  },
  {
    category: "Useful everyday tools",
    number: "06",
    title: "Vacation Quest Generator",
    description:
      "Turns a family itinerary into a colorful, downloadable adventure quest with stages, map links, photo challenges, and progress tracking.",
    helps: "Families who want a trip to feel more playful and memorable",
    outcome: "A private, portable quest that works right in the browser",
    tags: ["Travel", "Browser only", "Family"],
    href: "https://github.com/jazzy15j/vacation-quest-generator",
  },
  {
    category: "The studio",
    number: "07",
    title: "JDesigns Strategist",
    description:
      "My main studio site for simple small-business systems, Meta ads guidance, account access help, and practical resources.",
    helps: "Small-business owners who need clarity before more complexity",
    outcome: "Straightforward strategy, guides, and systems that can be used",
    tags: ["Strategy", "Meta ads", "Business systems"],
    href: "https://www.jdesigns.info",
    source: "https://github.com/jazzy15j/jdesigns-site",
  },
  {
    category: "Useful everyday tools",
    number: "08",
    title: "Shelf Scout",
    description:
      "A pocket book-flipping tool that scans an ISBN, looks up the title, and calculates likely profit after purchase cost, marketplace fees, shipping, and supplies.",
    helps: "Thrift-store book buyers who need a fast decision before purchasing",
    outcome: "A clear Buy, Maybe, or Pass verdict with estimated profit, margin, and ROI",
    tags: ["ISBN scanner", "Profit calculator", "Private build"],
    availability: "Private working app",
    featured: true,
  },
  {
    category: "Business AI systems",
    number: "09",
    title: "AI Business Audit",
    description:
      "A structured intake and delivery experience that turns business context into a practical 90-day strategy across operations, marketing, systems, and useful AI opportunities.",
    helps: "Small-business owners who need a prioritized plan instead of more disconnected advice",
    outcome: "A clear diagnostic, opportunity map, and sequenced 90-day action plan",
    tags: ["Strategy product", "AI audit", "Client experience"],
    availability: "JDesigns case study",
  },
  {
    category: "Business AI systems",
    number: "10",
    title: "JDesigns System OS",
    description:
      "A private operating system that connects lead routing, service delivery, audits, content production, revenue decisions, and client offboarding with approval-first workflows.",
    helps: "A strategy studio managing many kinds of client work without losing context",
    outcome: "One connected operating model from first inquiry through final delivery",
    tags: ["Internal OS", "Workflow design", "Sanitized case study"],
    availability: "Private system",
  },
  {
    category: "Business AI systems",
    number: "11",
    title: "The $20 Business",
    description:
      "A complete educational system for running a solo business with one AI workspace—from business memory and client folders to daily commands, approvals, branding, selling, and delivery.",
    helps: "Solo service providers who want a capable system without an expensive software stack",
    outcome: "A guided foundation, reusable templates, and a practical first-30-days plan",
    tags: ["Education", "Solo business", "In development"],
    availability: "Product in development",
  },
  {
    category: "The studio",
    number: "12",
    title: "Personal Museum Research Lab",
    description:
      "A source-traceable research operating system for testing a more visual, personal, and approachable way to discover, understand, collect, and live with historical art.",
    helps: "A product idea that needs evidence before features or architecture",
    outcome: "Auditable research linking sources, signals, assumptions, experiments, reports, and decisions",
    tags: ["Research OS", "Evidence design", "Exploration"],
    availability: "Research in progress",
  },
];

const categories = [
  {
    label: "Business AI systems",
    count: "06",
    blurb: "Turn what you know into repeatable, human-approved workflows.",
  },
  {
    label: "Useful everyday tools",
    count: "04",
    blurb: "Small tools that remove searching, planning, and everyday friction.",
  },
  {
    label: "The studio & experiments",
    count: "02",
    blurb: "The strategy practice, private systems, and evidence-led experiments.",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="JDesigns Strategist home">
          <span className="brand-mark">✦</span>
          <span>JDesigns Strategist</span>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a
            className="nav-github"
            href="https://github.com/jazzy15j"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow />
          </a>
        </div>
      </nav>

      <header className="hero shell" id="top">
        <div className="eyebrow">
          <span className="pulse" />
          Public project portfolio · Jasmine Stock
        </div>
        <h1>
          Useful systems,
          <br />
          built from <em>real life.</em>
        </h1>
        <div className="hero-bottom">
          <p>
            I&apos;m Jasmine. I turn messy work and everyday friction into
            simple tools people can actually understand, use, and share.
          </p>
          <a className="round-link" href="#work" aria-label="See selected work">
            <span>See the work</span>
            <b aria-hidden="true">↓</b>
          </a>
        </div>
        <div className="hero-rule">
          <span>Selected builds · 2025–26</span>
          <span>Based in Nebraska · Built for anywhere</span>
        </div>
      </header>

      <section className="categories shell" aria-label="Project categories">
        {categories.map((category) => (
          <article key={category.label}>
            <div className="category-top">
              <span>{category.label}</span>
              <b>{category.count}</b>
            </div>
            <p>{category.blurb}</p>
          </article>
        ))}
      </section>

      <section className="work shell" id="work">
        <div className="section-heading">
          <p>Public projects</p>
          <h2>Things I&apos;ve made</h2>
          <span>
            Every project starts with a specific problem—and ends with
            something useful.
          </span>
        </div>

        <div className="project-list">
          {projects.map((project) => (
            <article
              className={`project ${project.featured ? "featured" : ""}`}
              key={project.title}
            >
              <div className="project-index">
                <span>{project.number}</span>
                <p>{project.category}</p>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <dl>
                  <div>
                    <dt>Made for</dt>
                    <dd>{project.helps}</dd>
                  </div>
                  <div>
                    <dt>The result</dt>
                    <dd>{project.outcome}</dd>
                  </div>
                </dl>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="project-actions">
                {project.href ? (
                  project.href.startsWith("/") ? (
                    <a href={project.href}>
                      Open app <Arrow />
                    </a>
                  ) : (
                    <a href={project.href} target="_blank" rel="noreferrer">
                      {project.source ? "Visit site" : "View project"} <Arrow />
                    </a>
                  )
                ) : (
                  <span className="availability">{project.availability}</span>
                )}
                {project.source && (
                  <a
                    className="source-link"
                    href={project.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about shell" id="about">
        <div className="about-portrait">
          <Image
            src="/jasmine-stock.png"
            alt="Jasmine Stock, founder of JDesigns Strategist"
            width={800}
            height={800}
            unoptimized
          />
          <span>Jasmine · Strategist</span>
        </div>
        <div className="about-copy">
          <p className="kicker">The person behind the builds</p>
          <h2>
            Strategy brain.
            <br />
            <em>Builder&apos;s hands.</em>
          </h2>
          <p className="about-lede">
            I build because I keep finding problems that deserve a clearer,
            friendlier answer.
          </p>
          <p>
            My work lives where business strategy, practical AI, and real life
            overlap. Some projects help a small-business owner organize their
            entire operation. Others make it easier to find a great concert or
            turn a family vacation into an adventure.
          </p>
          <p>
            The common thread: useful first, understandable always, and built
            to give people more control—not less.
          </p>
          <div className="about-links">
            <a href="https://www.jdesigns.info" target="_blank" rel="noreferrer">
              Work with JDesigns <Arrow />
            </a>
            <a href="https://github.com/jazzy15j" target="_blank" rel="noreferrer">
              Follow the builds <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <span className="brand-mark">✦</span>
          <p>
            JDesigns
            <br />
            Strategist
          </p>
        </div>
        <div className="footer-note">
          <p>Jasmine Stock · JDesigns Strategist</p>
          <p>Building in public from Nebraska.</p>
        </div>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
