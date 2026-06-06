/* ZAMP Funds — static page generator.
   Emits the 5 site pages from shared head/nav/footer templates so the
   markup stays DRY and consistent. Run: node build/generate.js  */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

/* ----------------------------- shared bits ----------------------------- */
const head = (title, desc) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="theme-color" content="#0d0a05" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:type" content="website" />
<link rel="icon" type="image/png" href="assets/logo/zamp-x2-mark.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="styles/styles.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,1,0" />
</head>
<body>
<div class="zk-progress" aria-hidden="true"></div>`;

const NAV_LINKS = [
  ["About ZAMP", "about.html"],
  ["Portfolio", "portfolio.html"],
  ["For Founders", "founders.html"],
  ["For Investors", "investors.html"],
];

const nav = (active, connectHref) => `
<header class="zk-nav scheme-2" data-nav>
  <div class="zk-nav__inner">
    <a class="zk-nav__logo" href="index.html" aria-label="ZAMP Funds — home">
      <span class="zk-logo">
        <img src="assets/logo/zamp-x2-mark.png" alt="" />
        <span class="zk-logo__text">ZAMP <b>X2</b></span>
      </span>
    </a>
    <nav class="zk-nav__links" aria-label="Primary">
      ${NAV_LINKS.map(([label, href]) =>
        `<a href="${href}" class="zk-nav__link${active === label ? " is-active" : ""}">${label}</a>`
      ).join("\n      ")}
    </nav>
    <div class="zk-nav__cta">
      <a class="zds-btn zds-btn--primary zds-btn--sm" href="${connectHref}">Connect</a>
    </div>
    <button class="zk-nav__burger" aria-label="Open menu" aria-expanded="false" data-menu-toggle>
      <span class="material-symbols-rounded">menu</span>
    </button>
  </div>
  <div class="zk-nav__mobile" data-menu hidden>
    ${NAV_LINKS.map(([label, href]) => `<a href="${href}" class="zk-nav__link">${label}</a>`).join("\n    ")}
    <a class="zds-btn zds-btn--primary zds-btn--sm" href="${connectHref}">Connect</a>
  </div>
</header>`;

const FOOTER_LINKS = [
  ["About ZAMP", "about.html"], ["Portfolio", "portfolio.html"],
  ["For Founders", "founders.html"], ["For Investors", "investors.html"],
  ["Contact", "investors.html#contact"],
];
const SOCIALS = [["public","Website"],["share","X"],["rss_feed","Blog"],["groups","LinkedIn"],["play_circle","YouTube"]];

const footer = () => `
<footer class="zds-section scheme-2 zk-footer" id="site-footer">
  <div class="zds-container">
    <div class="zk-footer__top">
      <a class="zk-footer__logo" href="index.html" aria-label="ZAMP Funds — home">
        <span class="zk-logo zk-logo--lg">
          <img src="assets/logo/zamp-x2-mark.png" alt="" />
          <span class="zk-logo__text">ZAMP <b>X2</b></span>
        </span>
      </a>
      <nav class="zk-footer__links" aria-label="Footer">
        ${FOOTER_LINKS.map(([l,h]) => `<a href="${h}">${l}</a>`).join("\n        ")}
      </nav>
      <div class="zk-footer__social">
        ${SOCIALS.map(([s,label]) => `<a href="#" aria-label="${label}"><span class="material-symbols-rounded">${s}</span></a>`).join("\n        ")}
      </div>
    </div>
    <div class="zk-footer__rule"></div>
    <div class="zk-footer__legal">
      <p>© 2026 ZAMP Funds. A venture capital firm based in Miami, Florida. All rights reserved.</p>
      <div class="zk-footer__legal-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Cookies Settings</a>
      </div>
    </div>
  </div>
</footer>`;

const scripts = () => `
<script src="js/app.js" defer></script>
</body>
</html>`;

const btn = (label, variant, attrs = "") =>
  `<a class="zds-btn zds-btn--${variant} zds-btn--md" ${attrs}>${label}</a>`;
const linkBtn = (label, attrs = "") =>
  `<a class="zds-btn zds-btn--link zds-btn--md" ${attrs}><span>${label}</span><span class="material-symbols-rounded">chevron_right</span></a>`;

/* ----------------------------- shared sections ----------------------------- */
const FAQ_ITEMS = [
  ["What sectors do you fund?", "We invest across artificial intelligence, robotics, defense technology, drones, energy, healthcare, education, and marketplaces — wherever large market shifts meet technological acceleration."],
  ["How much do you typically invest?", "Investment sizes vary based on the opportunity and stage. We focus on founders with clear vision and the ability to execute at scale. Reach out to discuss what makes sense for your company."],
  ["What makes ZAMP different?", "We are not passive capital. We move fast, we believe before consensus forms, and we help founders navigate complex markets with strategic clarity and trusted relationships."],
  ["How do I submit my company?", "Visit our For Founders page and submit your company details. Tell us what you are building and why it matters — we review every submission and move quickly."],
  ["Can investors participate in your fund?", "Yes. ZAMP Funds is designed for investors seeking exposure to private companies with significant growth potential. Visit For Investors to request information."],
];

const accordion = (items) => `<div class="zds-accordion" data-accordion>
  ${items.map(([q,a], i) => `<div class="zds-accordion__item" data-open="${i===0}">
    <button type="button" class="zds-accordion__trigger" aria-expanded="${i===0}">
      <span>${q}</span><span class="zds-accordion__icon" aria-hidden="true">+</span>
    </button>
    <div class="zds-accordion__panel"><div class="zds-accordion__panel-inner">${a}</div></div>
  </div>`).join("\n  ")}
</div>`;

const faqSection = () => `
<section class="zds-section scheme-2">
  <div class="zds-container zk-faq">
    <div class="zk-faq__intro">
      <h2 class="zds-h2">Questions</h2>
      <p class="zds-text-medium zk-muted">Everything you need to know about working with ZAMP Funds.</p>
      <div class="zk-section-foot">${btn("Contact","secondary",'href="#site-footer"')}</div>
    </div>
    <div class="zk-faq__list">${accordion(FAQ_ITEMS)}</div>
  </div>
</section>`;

const contactSection = () => `
<section class="zds-section scheme-1" id="contact">
  <div class="zds-container zk-contact">
    <div class="zk-contact__info">
      <p class="zds-eyebrow">Connect</p>
      <h2 class="zds-h2">Get in touch</h2>
      <p class="zds-text-medium zk-muted">Have questions or want to discuss an opportunity?</p>
      <ul class="zk-contact__list">
        <li><span class="material-symbols-rounded">mail</span><div><strong>Email</strong><a href="mailto:hello@zampfunds.com">hello@zampfunds.com</a></div></li>
        <li><span class="material-symbols-rounded">call</span><div><strong>Phone</strong><a href="tel:+13055550147">+1 (305) 555-0147</a></div></li>
        <li><span class="material-symbols-rounded">location_on</span><div><strong>Office</strong><span class="zk-muted">Miami, Florida, USA</span></div></li>
      </ul>
    </div>
    <form class="zk-contact__form" data-contact-form novalidate>
      <div class="zds-field"><label class="zds-field__label" for="c-name">Full name</label><input id="c-name" class="zds-input" placeholder="Jane Founder" required /></div>
      <div class="zds-field"><label class="zds-field__label" for="c-email">Work email</label><input id="c-email" class="zds-input" type="email" placeholder="you@company.com" required /></div>
      <div class="zds-field"><label class="zds-field__label" for="c-msg">Tell us what you're building</label><textarea id="c-msg" class="zds-input" placeholder="A few sentences about your company…"></textarea></div>
      <button type="submit" class="zds-btn zds-btn--accent zds-btn--md">Send message</button>
    </form>
  </div>
</section>`;

const split = ({eyebrow, title, body, image, ground, flip}) => `
<section class="zds-section ${ground}">
  <div class="zds-container zk-split${flip ? " zk-split--flip" : ""}">
    <div class="zk-split__text">
      ${eyebrow ? `<p class="zds-eyebrow">${eyebrow}</p>` : ""}
      <h2 class="zds-h2">${title}</h2>
      <p class="zds-text-medium zk-muted">${body}</p>
      <div class="zk-section-foot">${btn("Learn more","secondary")}${linkBtn("Explore")}</div>
    </div>
    <div class="zk-split__media"><img src="${image}" alt="" /></div>
  </div>
</section>`;

const pageHeader = ({eyebrow, title, sub, primary, secondary, ground="scheme-1"}) => `
<section class="zds-section ${ground}">
  <div class="zds-container zk-pagehead">
    <p class="zds-eyebrow">${eyebrow}</p>
    <h1 class="zds-h1">${title}</h1>
    <p class="zds-text-medium zk-muted">${sub}</p>
    <div class="zk-section-foot zk-section-foot--center">
      ${primary ? btn(primary.label, "primary", `href="${primary.href}"`) : ""}
      ${secondary ? btn(secondary.label, "secondary", `href="${secondary.href}"`) : ""}
    </div>
  </div>
</section>`;

/* ----------------------------- HOME ----------------------------- */
const FEATURES = [
  ["bolt", "Founders who move fast", "Clarity, conviction, and the drive to turn a bold idea into a durable company."],
  ["trending_up", "Conviction before consensus", "The biggest outcomes come from seeing the shift before the rest of the market does."],
  ["hub", "Built at the intersection", "Where a market shift, a technology curve, and a relentless founder all meet at once."],
];
const BENEFITS = [
  ["Strategic clarity", "More than capital — a point of view that helps founders navigate complex markets."],
  ["Trusted relationships", "Our network opens doors and accelerates growth across emerging sectors."],
  ["Speed and conviction", "We believe before consensus forms and move at the pace founders need."],
  ["Emerging sector access", "Exposure to the categories that will define the next decade of technology."],
];
const SECTORS = [
  ["smart_toy", "Artificial Intelligence"], ["precision_manufacturing", "Robotics"],
  ["auto_mode", "Autonomy"], ["hub", "Next-Gen Networking"],
  ["factory", "Industry AI"], ["neurology", "Functional AI"],
];
const MARQUEE = [
  ["bolt","Capital"], ["trending_up","Conviction"], ["rocket_launch","Acceleration"],
  ["target","Asymmetric opportunities"], ["visibility","Structural change before consensus"],
  ["all_inclusive","All in on AI, autonomy & robots"],
];

const home = head("ZAMP Funds — We back companies building what comes next",
  "ZAMP Funds is a Miami venture capital firm backing founders building across AI, robotics, and autonomy. We are not passive capital.")
+ nav("home", "#contact")
+ `
<main>
  <section class="scheme-1 zk-hero-section">
    <div class="zds-section" style="padding-bottom:0">
      <div class="zds-container zk-hero">
        <div class="zk-hero__tag"><span class="zk-hero__dot"></span>Miami · Venture Capital · Est. 2024</div>
        <h1 class="zds-h1 zk-hero__title">We back companies building <span class="zk-accent-word">what comes next</span></h1>
        <p class="zds-text-medium zk-hero__sub">ZAMP Funds invests in founders pursuing breakthrough opportunities in AI, robotics, and autonomy — wherever intelligence reshapes a market. We move with conviction, and we are not passive capital.</p>
        <div class="zk-hero__actions">
          ${btn("For Founders","primary",'href="founders.html"')}
          ${btn("For Investors","secondary",'href="investors.html"')}
        </div>
        <a class="zk-hero__scroll" href="#features"><span class="material-symbols-rounded">arrow_downward</span>Scroll to explore</a>
      </div>
    </div>
    <div class="zk-hero__media"><img src="assets/images/home-hero-header-section.jpg" alt="Founders at work" /><div class="zk-hero__scrim"></div></div>
  </section>

  <section class="zds-section scheme-2" id="features">
    <div class="zds-container">
      <div class="zk-section-head">
        <p class="zds-eyebrow">Conviction</p>
        <h2 class="zds-h2">Not passive capital. Never have been.</h2>
        <p class="zds-text-medium zk-muted">We back founders who move with purpose, see what others miss, and have the relentless drive to build something that matters.</p>
      </div>
      <div class="zk-grid3">
        ${FEATURES.map(([icon,t,b]) => `<div class="zk-feature"><span class="material-symbols-rounded zk-feature__icon">${icon}</span><h3 class="zds-h4">${t}</h3><p class="zk-muted">${b}</p></div>`).join("\n        ")}
      </div>
      <div class="zk-section-foot">${btn("Learn","secondary",'href="about.html"')}${linkBtn("Our thesis",'href="about.html"')}</div>
    </div>
  </section>

  <section class="zds-section scheme-1">
    <div class="zds-container zk-benefits">
      <div class="zk-benefits__col">
        <div>
          <p class="zds-eyebrow">Partnership</p>
          <h2 class="zds-h2">Money is the easy part</h2>
          <p class="zds-text-medium zk-muted">Great companies need more than a check — trusted relationships, speed, and people willing to believe before the market does.</p>
          <div class="zk-section-foot" style="margin-top:var(--space-8)">${btn("Explore","secondary",'href="founders.html"')}</div>
        </div>
        <div class="zk-benefits__list">
          ${BENEFITS.map(([h,b]) => `<div class="zk-benefit"><h5 class="zds-h6">${h}</h5><p class="zk-muted">${b}</p></div>`).join("\n          ")}
        </div>
      </div>
      <div class="zk-benefits__media">
        <img src="assets/images/home-benefits-section-1.jpg" alt="Portfolio company" />
        <img src="assets/images/home-benefits-section-4.jpg" alt="Founders" />
      </div>
    </div>
  </section>

  <section class="zds-section scheme-3">
    <div class="zds-container">
      <div class="zk-section-head zk-section-head--left">
        <p class="zds-eyebrow">Focus</p>
        <h2 class="zds-h2">Where we invest</h2>
        <p class="zds-text-medium zk-muted">Our focus is simple and unchanged: AI, robotics, autonomy, and the networks and intelligence that connect them.</p>
      </div>
      <div class="zk-sectors">
        ${SECTORS.map(([icon,name]) => `<a class="zk-sector" href="portfolio.html"><span class="material-symbols-rounded zk-sector__icon">${icon}</span><span class="zk-sector__name">${name}</span><span class="material-symbols-rounded zk-sector__arrow">arrow_outward</span></a>`).join("\n        ")}
      </div>
    </div>
  </section>

  <div class="scheme-1">
    <div class="zk-marquee" aria-hidden="true">
      <div class="zk-marquee__track">
        ${[...MARQUEE, ...MARQUEE].map(([i,t]) => `<span class="zk-marquee__item"><span class="material-symbols-rounded">${i}</span>${t}</span>`).join("\n        ")}
      </div>
    </div>
  </div>

  <section class="zds-section scheme-2">
    <div class="zds-container zk-cta">
      <div class="zk-cta__col">
        <span class="material-symbols-rounded zk-cta__icon">build</span>
        <h2 class="zds-h2">Building something that matters?</h2>
        <p class="zk-muted">If your company could reshape a market, we want to hear it — and we move fast.</p>
        <div class="zk-section-foot zk-section-foot--center">${btn("Submit","primary",'href="founders.html"')}${btn("Learn","secondary",'href="about.html"')}</div>
      </div>
      <div class="zk-cta__col">
        <span class="material-symbols-rounded zk-cta__icon">explore</span>
        <h2 class="zds-h2">Back what comes next</h2>
        <p class="zk-muted">Get access to high-conviction opportunities in the sectors defining the next decade.</p>
        <div class="zk-section-foot zk-section-foot--center">${btn("Inquire","primary",'href="investors.html"')}${btn("Explore","secondary",'href="investors.html"')}</div>
      </div>
    </div>
  </section>

  <section class="zds-section scheme-1">
    <div class="zds-container zk-quote">
      <div class="zk-quote__stars">${Array.from({length:5}).map(()=>`<span class="material-symbols-rounded">star</span>`).join("")}</div>
      <h5 class="zds-h5 zk-quote__text">"ZAMP understood our vision before the market did. They moved fast and believed in what we were building."</h5>
      <div class="zk-quote__by">
        <div class="zds-avatar">
          <img class="zds-avatar__img" src="assets/images/home-testimonial-section.jpg" alt="James Chen" width="56" height="56" style="width:56px;height:56px" />
          <div class="zds-avatar__meta"><span class="zds-avatar__name">James Chen</span><span class="zds-avatar__role">Founder, AI Systems</span></div>
        </div>
      </div>
    </div>
  </section>

  ${faqSection()}
  ${contactSection()}
</main>`
+ footer() + scripts();

/* ----------------------------- PORTFOLIO ----------------------------- */
const COMPANIES = [
  ["Meridian AI","home-benefits-section-0.jpg","Building autonomous systems that learn from real-world data at scale.","AI",["Artificial Intelligence","Enterprise"]],
  ["Skyward Dynamics","home-benefits-section-1.jpg","Next-generation drone platform for industrial inspection and logistics.","Robotics",["Drones","Robotics"]],
  ["Forge Robotics","home-benefits-section-2.jpg","Precision manufacturing robots designed for speed and adaptability.","Robotics",["Robotics","Manufacturing"]],
  ["Sentinel Defense","home-benefits-section-3.jpg","Advanced threat detection systems for critical infrastructure.","Defense",["Defense Tech","Security"]],
  ["Catalyst Energy","home-benefits-section-4.jpg","Distributed energy storage solving grid stability at scale.","Energy",["Green Energy","Climate"]],
  ["Vital Health","home-benefits-section-5.jpg","Diagnostic platform bringing precision medicine to underserved regions.","Health",["Healthcare","Impact"]],
];
const FILTERS = ["All","AI","Robotics","Defense","Energy","Health"];

const portfolio = head("Portfolio — ZAMP Funds", "Companies redefining their sectors, backed by ZAMP Funds.")
+ nav("Portfolio", "#site-footer")
+ `
<main>
  <section class="zds-section scheme-2">
    <div class="zds-container">
      <div class="zk-section-head">
        <p class="zds-eyebrow">Portfolio</p>
        <h2 class="zds-h2">Companies redefining their sectors</h2>
        <p class="zds-text-medium zk-muted">These founders saw structural change coming and moved to capture it.</p>
      </div>
      <div class="zk-pf-filters" data-pf-filters>
        ${FILTERS.map((f,i) => `<button class="zk-chip${i===0?" is-active":""}" data-filter="${f}">${f}</button>`).join("\n        ")}
      </div>
      <div class="zk-pf-grid" data-pf-grid>
        ${COMPANIES.map(([name,img,desc,sector,tags]) => `<article class="zds-card zds-card--hover zk-pf-item" data-sector="${sector}">
          <img class="zds-card__media" src="assets/images/${img}" alt="${name}" />
          <div class="zds-card__body">
            <h3 class="zds-h5">${name}</h3>
            <p class="zk-muted" style="margin:0">${desc}</p>
            <div class="zk-pf-tags">${tags.map(t=>`<span class="zds-badge zds-badge--tag">${t}</span>`).join("")}</div>
            ${linkBtn("View company")}
          </div>
        </article>`).join("\n        ")}
      </div>
      <div class="zk-section-foot" style="justify-content:center">${btn("View all companies","secondary")}</div>
    </div>
  </section>
</main>`
+ footer() + scripts();

/* ----------------------------- ABOUT ----------------------------- */
const TEAM = [
  ["Jimmy Augustine","Founder & Managing Partner","Founded ZAMP to back founders building what comes next. Moves fast, believes early.","team/jimmy-avatar.jpg"],
  ["Zoe Augustine","Co-Founder & Partner","Builds the relationships and conviction behind every ZAMP investment.","placeholders/team-zoe-augustine.jpg"],
  ["James Whitmore","Partner","Defense tech and aerospace background. Sees where markets shift.","placeholders/team-jw.jpg"],
  ["Elena Rodriguez","Investment analyst","Energy and healthcare focus. Sharp eye for emerging opportunities.","placeholders/team-er.jpg"],
  ["David Kim","Operations lead","Keeps the machine running. Makes things happen fast.","placeholders/team-dk.jpg"],
  ["Lisa Patel","Investor relations","Connects capital with conviction. Builds lasting partnerships.","placeholders/team-lp.jpg"],
  ["Marcus Johnson","Portfolio advisor","Founder experience. Opens doors. Helps companies scale.","placeholders/team-mj.jpg"],
  ["Rachel Adams","Sector analyst","Tracks structural change. Spots trends before they break.","placeholders/team-ra.jpg"],
];

const about = head("About — ZAMP Funds", "ZAMP Funds is a Miami venture capital firm. Fast, conviction-led, and genuinely useful.")
+ nav("About ZAMP", "#site-footer")
+ `
<main>
  ${pageHeader({eyebrow:"About", title:"We built the fund we wished existed",
    sub:"ZAMP Funds is a venture capital firm in Miami, Florida — fast, conviction-led, and genuinely useful. We back founders building across AI, robotics, and autonomy, wherever real change happens. We are not passive capital.",
    primary:{label:"Explore", href:"founders.html"}, secondary:{label:"Submit", href:"founders.html"}, ground:"scheme-1"})}
  ${split({eyebrow:"Thesis", title:"Built for asymmetric opportunities",
    body:"The biggest outcomes rarely come from consensus. They come from seeing structural change before the rest of the market fully understands it. ZAMP seeks companies at the intersection of large market shifts, technological acceleration, founder-led execution, real-world demand, and scalable business models.",
    image:"assets/images/placeholders/feature-a.jpg", ground:"scheme-2"})}
  <section class="zds-section scheme-3">
    <div class="zds-container zk-founder">
      <div class="zk-founder__media">
        <img src="assets/images/team/jimmy-augustine.jpg" alt="Jimmy Augustine" />
        <span class="zk-founder__tag"><i></i>Founder &amp; Managing Partner</span>
      </div>
      <div class="zk-founder__body">
        <p class="zds-eyebrow">Founder</p>
        <blockquote class="zk-founder__quote">“We were cash flow positive on day one. We're all in on AI, autonomy, and robots.”</blockquote>
        <p class="zds-text-medium zk-muted">Jimmy holds 40 patents in AI and built ZAMP's hedge fund on one of the most accurate prediction engines on the planet. His approach is plainspoken: back the highest-conviction opportunities, think in five-, ten-, and fifteen-year horizons, and stay all in on AI, autonomy, and robotics.</p>
        <div class="zk-founder__sign"><span class="zk-founder__name">Jimmy Augustine</span><span class="zk-founder__role zk-muted">Founder &amp; Managing Partner</span></div>
      </div>
    </div>
  </section>
  <section class="zds-section scheme-1">
    <div class="zds-container">
      <div class="zk-section-head">
        <p class="zds-eyebrow">Leadership</p>
        <h2 class="zds-h2">The team</h2>
        <p class="zds-text-medium zk-muted">We back founders who move with purpose — because we do too.</p>
      </div>
      <div class="zk-team">
        ${TEAM.map(([name,role,bio,img]) => `<div class="zk-team__card">
          <div class="zk-team__avatar"><img src="assets/images/${img}" alt="${name}" /></div>
          <p class="zk-team__name">${name}</p>
          <p class="zk-team__role zk-muted">${role}</p>
          <p class="zk-team__bio zk-muted">${bio}</p>
          <div class="zk-team__social"><a href="#" aria-label="Profile"><span class="material-symbols-rounded">groups</span></a><a href="#" aria-label="Share"><span class="material-symbols-rounded">share</span></a></div>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>
</main>`
+ footer() + scripts();

/* ----------------------------- FOR FOUNDERS ----------------------------- */
const STEPS = [
  ["Submit your vision","Tell us about your company, your team, and the problem you're solving.","step-01.jpg"],
  ["We review and respond","We evaluate quickly. If there's alignment, we'll have a real conversation about your opportunity.","step-02.jpg"],
  ["Build together","Strategic clarity, trusted relationships, and capital that moves with you as you scale.","step-03.jpg"],
  ["Ongoing support","We're active partners. Board participation, introductions, and people willing to believe before the market does.","step-04.jpg"],
];

const founders = head("For Founders — ZAMP Funds", "Move fast. Build next. ZAMP Funds backs founders with urgency and conviction.")
+ nav("For Founders", "#site-footer")
+ `
<main>
  ${pageHeader({eyebrow:"Founders", title:"Move fast. Build next.",
    sub:"We back founders with urgency and conviction. Capital alone doesn't build great companies.",
    primary:{label:"Submit your company", href:"#contact"}, secondary:{label:"Learn", href:"#site-footer"}, ground:"scheme-1"})}
  ${split({eyebrow:"Partnership", title:"Capital that moves with you",
    body:"Money alone doesn't build great companies. We bring strategic clarity, trusted relationships, and people willing to believe before the market catches up. We exist to help you move faster.",
    image:"assets/images/placeholders/feature-b.jpg", ground:"scheme-2", flip:true})}
  <section class="zds-section scheme-3">
    <div class="zds-container">
      <div class="zk-section-head">
        <p class="zds-eyebrow">Process</p>
        <h2 class="zds-h2">How we work with founders</h2>
        <p class="zds-text-medium zk-muted">We move fast. From submission to partnership, we keep pace with founders who are building something real.</p>
      </div>
      <div class="zk-steps">
        ${STEPS.map(([t,b,img],i) => `<div class="zk-step">
          <div class="zk-step__media"><img src="assets/images/placeholders/${img}" alt="" /></div>
          <span class="zk-step__num">${String(i+1).padStart(2,"0")}</span>
          <h3 class="zds-h5">${t}</h3>
          <p class="zk-muted">${b}</p>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>
  ${faqSection()}
  ${contactSection()}
</main>`
+ footer() + scripts();

/* ----------------------------- FOR INVESTORS ----------------------------- */
const STATS = [["500x","First home run"],["300x","Second home run"],["100x","Third home run"]];

const investors = head("For Investors — ZAMP Funds", "Back tomorrow's leaders. Access high-conviction venture opportunities with ZAMP Funds.")
+ nav("For Investors", "#contact")
+ `
<main>
  ${pageHeader({eyebrow:"Investing", title:"Back tomorrow's leaders",
    sub:"Access exceptional founders building across AI, robotics, and autonomy — the sectors where real change happens, and where the greatest returns are made.",
    primary:{label:"Request information", href:"#contact"}, secondary:{label:"Learn", href:"#site-footer"}, ground:"scheme-1"})}
  ${split({eyebrow:"Approach", title:"A long-term play, plainly stated",
    body:"Venture isn't the stock market. It's a three, five, seven — even ten-to-fifteen-year play. Our investors are sophisticated and understand they don't have the liquidity of public markets. If that horizon fits, the upside can be extraordinary. Our criteria is simple: where can we make the greatest return?",
    image:"assets/images/placeholders/feature-a.jpg", ground:"scheme-2"})}
  <section class="zds-section scheme-3">
    <div class="zds-container">
      <div class="zk-section-head zk-section-head--left">
        <p class="zds-eyebrow">Track record</p>
        <h2 class="zds-h2">Returns, plainly stated</h2>
        <p class="zds-text-medium zk-muted">We invest where we can make the greatest return. Our first three home runs returned 500x, 300x, and 100x — and we were cash flow positive on day one.</p>
      </div>
      <div class="zk-statband">
        ${STATS.map(([v,l]) => `<div class="zds-stat"><p class="zds-stat__value">${v}</p><h3 class="zds-stat__label">${l}</h3></div>`).join("\n        ")}
      </div>
    </div>
  </section>
  ${contactSection()}
</main>`
+ footer() + scripts();

/* ----------------------------- write ----------------------------- */
const pages = { "index.html": home, "portfolio.html": portfolio, "about.html": about, "founders.html": founders, "investors.html": investors };
for (const [file, content] of Object.entries(pages)) {
  fs.writeFileSync(path.join(ROOT, file), content, "utf8");
  console.log("wrote", file, content.length, "bytes");
}
