# Site Audit Report — haitiansensationmission.org

**Date:** 2026-08-27
**Scope:** Phase 1 of the foundation operations brief (semantic HTML · schema · a11y · performance · Ad Grant readiness).
**Method:** Full read of the repository, structural parse of every HTML page (headings, landmarks, links, images, JSON-LD), image header inspection for intrinsic dimensions, internal link crawl, and baseline screenshots of all nine pages at desktop (1440px) and mobile (390px) widths.

---

## 1. Tooling limitations in this session

The remote execution environment blocks outbound access to npm, PyPI, and file downloads (403 on all). Consequences for this audit and the phases after it:

| Tool | Status | Mitigation |
|---|---|---|
| W3C validator (vnu) | Not runnable | Careful manual authoring; run vnu/validator.w3.org before launch |
| axe-core / Pa11y | Not runnable | Manual WCAG checklist audit (§8 of brief) performed by hand; run axe before launch |
| Lighthouse / PSI | Not runnable | Run PageSpeed Insights against the deployed site |
| sass | Not installable locally | SCSS edits kept minimal; Netlify compiles on deploy (`netlify.toml`); compiled CSS hand-synced for local preview |
| sharp / cwebp / ImageMagick | Not installable | Image conversion **cannot run in this session**. A ready-to-run `scripts/optimize-images.mjs` is provided instead — see README action items |

Baseline screenshots for visual-regression comparison were captured in-session (desktop + mobile, all 9 pages) and diffed against post-change renders before each push.

---

## 2. Page inventory (pre-change)

| Page | Title (len) | Canonical | Robots | Meta desc len | JSON-LD |
|---|---|---|---|---|---|
| `index.html` | 90ch ⚠ too long | `/` ✓ clean | index, follow | 189ch ⚠ long | NGO + WebSite (@graph) |
| `donate.html` | 74ch ⚠ too long | `/donate.html` ✗ | index, follow | 203ch ⚠ long | NGO, FAQPage |
| `articles/history.html` | 47ch | `/articles/history.html` ✗ | index, follow | 166ch ⚠ | NGO |
| `articles/education.html` | 48ch | `/articles/education.html` ✗ | index, follow | 114ch ⚠ short | NGO |
| `articles/natural-disasters.html` | 45ch | `/articles/natural-disasters.html` ✗ | index, follow | 155ch ✓ | NGO |
| `articles/wells-to-wellness.html` | 45ch | `/articles/wells-to-wellness.html` ✗ | index, follow | 129ch ⚠ short | NGO |
| `articles/our-story.html` | 37ch | `/articles/our-story.html` ✗ | index, follow | 113ch ⚠ short | NGO |
| `legal/privacy.html` | 42ch | `/legal/privacy.html` ✗ | **noindex** | 74ch | none |
| `legal/terms.html` | 46ch | `/legal/terms.html` ✗ | **noindex** | 80ch | none |

All pages: exactly one H1, no skipped heading levels detected by parse, skip link present, `header`/`main`/`footer` landmarks present (legal pages lack `header`/nav entirely — they have only a "back" link). Open Graph + Twitter cards present on all non-legal pages.

**Internal links: zero broken.** All internal hrefs resolve to files on disk.

---

## 3. Verification of brief §2 — confirmations and discrepancies

### Confirmed defects
- **Canonical mismatch (🔴):** every page except the homepage canonicalizes to its `.html` URL. `sitemap.xml` also lists `.html` URLs.
- **Hash-anchor homepage sections (🟠):** primary nav is `#home / #about / #mission / donate.html`. About/mission content is not independently indexable.
- **Eyebrow above H1 (🟠):** `p.home__subtitle` (index) and `p.article__subtitle` (all articles) precede the H1 in the DOM.
- **Blockquote pseudo-headings (🟠):** 10 blockquotes across the five articles; several function as section headings or pull-quotes without `<cite>` (education ×4, disasters ×2, wells ×2, history ×1, our-story ×1).
- **Images unoptimized (🟠):** see §5 below. 118 files, 46 MB. No `width`/`height` attributes anywhere (CLS risk). No `fetchpriority` on any LCP image. `loading="lazy"` already applied to most below-fold images.
- **No freshness signals (🟡):** zero `<time>` elements, no dateModified anywhere.
- **No breadcrumbs (🟡):** confirmed, no page has breadcrumb nav or BreadcrumbList.

### Discrepancies vs. the brief (reality wins; noted per §0)
1. **Structured data is not zero.** Earlier work (PRs #11–#12) added: NGO + WebSite `@graph` on the homepage; NGO + a 4-question FAQPage on `/donate` (FAQPage matches the visible FAQ text); NGO block on every article. All parse as valid JSON. Missing: BreadcrumbList, Article, DonateAction, `foundingDate`, `address`, `sameAs`, and the org name differs from the brief ("Haitian Sensation Mission" / legalName "Haitian Sensation Missions, Inc.").
2. **`/articles/community` does not exist.** The brief's inventory and redirect map include it; there is no such file and no page links to it. `/programs/community-outreach` will be a new placeholder scaffold; the two community redirect lines are unnecessary but harmless (kept via the `/articles/*` catch-all).
3. **The Zeffy embed is not an on-page iframe.** It is a script-injected modal opened by `<button zeffy-form-link="…">` elements (donate page ×2, each already carrying an aria-label). There is no `<iframe>` in any source file to title; the iframe is injected at runtime into the modal. A11y follow-up: verify modal keyboard operability and focus trap on the live site; the `title` fix, if needed, must come from Zeffy's script or be documented as a vendor limitation.
4. **Hosting is Netlify** (`netlify.toml` present, builds SCSS on deploy). Decision: stay on Netlify for now; migrate to Cloudflare Pages after this operation. `_redirects` syntax is compatible with both. Cloudflare-specific items in brief §9 (Polish, Brotli, Auto Minify) deferred to migration.
5. **Legal pages are already `noindex`** and are not in the sitemap. Kept as-is.
6. **Image count is 118, not ~67.** 70 are referenced by HTML/CSS; 48 are unreferenced (see §5).
7. **No analytics of any kind is installed** (no GA4, no gtag, no GTM). Decision: owner adds GA4 + GDPR-compliant cookie consent after this operation (README action item).
8. Titles/descriptions exist everywhere but several miss length targets (table above); rewritten in Phase 2 per brief §4.

### Confirmed strengths (preserved)
- Skip link on every page; descriptive alt text on every content image (0 missing `alt` attributes; decorative images use `alt=""`); one H1 per page; OG/Twitter cards; `index, follow` on content pages; EIN + tax-deductible status stated on `/donate`; `preconnect` hints for fonts and Zeffy; reduced-motion media query already honored in JS scroll behavior (`dist/js/main.js`).

---

## 4. Current URL / redirect state

- No `_redirects` file exists. Clean URLs currently depend on Netlify's Pretty URLs; canonicals contradict them (`.html`).
- `robots.txt` is fine (allow all + sitemap pointer).
- `sitemap.xml` lists 7 URLs, all `.html` variants.
- No `/thank-you` page; no Zeffy success redirect configured (dashboard-side — README action item).

## 5. Image inventory

Totals: **118 files, ~46 MB**. 70 referenced (≈33 MB), 48 unreferenced (≈13 MB, including the single worst file `topsphere-media-MEGAHD.jpg`, 16000×9000, 6.1 MB — referenced by nothing).

Worst referenced offenders (full table in `audit-data/image-tables.md`):

| File | Intrinsic | Size | Note |
|---|---|---|---|
| natural-disasters_cover.jpeg | 6432×4272 | 3.1 MB | article hero |
| bill-hamway-madam-felix.jpg | 5760×3840 | 2.2 MB | |
| 3606.jpg | 5556×5556 | 1.8 MB | |
| petionville-reynaldo-mirault.jpg | 2400×1600 | 1.5 MB | |
| susan-mohr-…-unsplash.jpg | 2400×1800 | 1.3 MB | |

Several `PIXNIO-*` and `*-725x*` assets are already small/degraded (e.g. 364×544) — these are **below** typical display size and must not be upscaled (brief §9); they are flagged in the full table.

No `<img>` anywhere has `width`/`height`. `loading="lazy"` coverage is good (80/133 imgs across pages); no `fetchpriority="high"` on hero/LCP images.

## 6. External links (37 unique)

Cannot be verified from this session (network blocked). List captured in `audit-data/audit.json`; verify with a link checker before Ad Grant submission. None are ads or affiliate links (Ad Grant §10 check: **pass** — outbound links are citations to news/academic sources, the founder's restaurant site, the webmaster's portfolio, and Zeffy).

## 7. Decisions log (from site owner, 2026-08-27)

1. Stay on **Netlify** now; Cloudflare Pages migration after this operation.
2. `/programs/community-outreach` scaffolded as a new placeholder page (no legacy source exists).
3. **GA4 + cookie consent** added by owner after this operation — not scaffolded now.
4. **Zeffy → `/thank-you` success redirect** tracked as a README action item (dashboard-side).
5. `mission.md` in the repo root is approved source content for now (used for `/about`).

## 7b. Accessibility audit (Phase 5, manual — axe-core not runnable in-session)

**Fixed in this branch:**
- Visible focus indicators for keyboard users: global `:focus-visible` style (gold ring wrapped in a navy ring so it passes 3:1 on both navy and white surfaces). The pre-existing `outline: none` on buttons/inputs now has a compliant replacement.
- `prefers-reduced-motion` honored: CSS media query disables smooth scrolling and transitions; the scroll-to-top JS switches to instant scrolling.
- Heading order: eyebrow text now renders after the H1 in the DOM (visual position unchanged via CSS `order`), no skipped levels on any page.
- Landmarks: every page except legal has exactly one `header`/`main`/`footer`; all `<nav>` elements uniquely labeled (Primary / Breadcrumb / Keep reading).
- Link text: card "Learn More" spans are `aria-hidden` decoration inside links named by their card titles; no bare "click here"/"read more" links exist.
- Alt text: preserved through the restructure on every image (re-verified: 0 missing).

**Contrast measurements (WCAG 1.4.3), full brand-pair matrix computed:**

| Pair | Ratio | Verdict |
|---|---|---|
| Gold `#f3b419` on navy `#002e5a` | 7.38 | ✅ |
| White / near-white text on navy | 12.2–13.7 | ✅ |
| Gray body text `hsl(0,0%,70%)` on navy | 6.51 | ✅ |
| `--text-color-light` on navy / on `--hf-blue-light` | 8.29 / 5.37 | ✅ |
| Navy on gold (nav Donate button) | 7.38 | ✅ |
| White on red (scroll-up button) | 5.46 | ✅ |
| **White on gold — mission-card "Learn More" chips** | **1.85** | ❌ report only |
| **Gold on white — related-card "Learn More" text** | **1.85** | ❌ report only |
| **Article link hover (gold→red on navy)** | **2.50** | ❌ report only |

Per the brief, the three failures are **reported, not changed** — each needs a design decision (they involve the gold/red brand colors on light surfaces). Suggested fixes when you're ready: use navy text on the gold chips; use `--hf-blue-light` or underline-only for hover on navy.

**Not verifiable offline (do before launch):**
- Zeffy modal keyboard operability and focus management — the donation form is a script-injected modal, not an on-page iframe (see §3.3). Tab through the full donate flow on the live site; if the injected iframe lacks a `title`, raise it with Zeffy support.
- Full axe-core/Pa11y run on the deployed site.

## 7c. Performance work (Phase 6)

**Done in this branch:**
- Explicit `width`/`height` attributes on all 177 raster `<img>` tags across the site, from measured intrinsic dimensions (CLS guard). Rendering verified pixel-identical before/after.
- `fetchpriority="high"` on all 7 hero/LCP images; lazy-loading stripped from heroes.
- `loading="lazy"` added to the ~60 below-fold footer images that lacked it (content images already had it from earlier work).
- Google Fonts already load with `display=swap` and preconnect; Zeffy script is `defer`; both left as-is.
- `scripts/optimize-images.mjs` (sharp) committed: generates WebP siblings and optionally downscales oversized sources (never upscales; originals backed up). `scripts/update-image-dimensions.py` re-syncs markup dimensions after any image change.

**Blocked in this environment (npm/pip/downloads all 403):** actual image conversion could not run here — no sharp, cwebp, ImageMagick, or usable ffmpeg on the box. Two paths forward:
1. Run `npm i -D sharp && npm run images:optimize -- --resize && npm run images:dimensions` locally, then switch heroes to `<picture>` with WebP sources; or
2. After the planned Cloudflare Pages migration, enable **Polish (Lossy WebP)** + Brotli — edge conversion with zero markup changes. The `--resize` pass is still worth one run either way: `natural-disasters_cover.jpeg` is 6432px/3.1MB, `bill-hamway-madam-felix.jpg` 5760px/2.2MB, `3606.jpg` 5556px/1.8MB (and unreferenced `topsphere-media-MEGAHD.jpg` is 16000px/6.1MB — deletable).
- Critical-CSS inlining skipped deliberately: it would fork the compiled stylesheet from the SASS build (brief §9 allows skipping in that case). The single 41KB stylesheet is cacheable and small.
- PSI/Lighthouse must be measured on the deployed site (no external network here).

## 8. Residual issues / for human decision

- **Gold `#f3b419` on white** and light-gray body text on white surfaces likely fail 4.5:1 — audited in Phase 5; reported, not changed (brief §8).
- New scaffold pages ship with `noindex` + placeholders and are excluded from `sitemap.xml` until real copy lands (never index placeholders); flip robots + add to sitemap at content time. Tracked in `content-manifest.md`.
- The placeholder build-guard is provided as `npm run guard:placeholders` but is **not** wired into the Netlify build yet — wiring it in would fail every deploy until all content lands. Wire it in once content is delivered (README action item).
- Run before launch (outside this environment): W3C vnu, axe-core, Lighthouse/PSI, external link checker, `scripts/optimize-images.mjs`.


---

# Brief v2 delta audit (2026-08-30) — Civic redesign readiness

Brief v2 supersedes v1 and authorizes a full visual redesign per three spec files
(`hsm-civic-design-system.html`, `hsm-universal-page-template.html`,
`mockup-B-civic-v2.html`). Phase 1 of the v2 work order: state check + gaps,
**stop and report before proceeding**.

## What the v1 foundation already satisfies (v2 §2, §5, §6, §8, §9)

- URL architecture, `_redirects`, self-canonicalization, sitemap, robots — implemented and verified (identical map in v2 §2)
- Four-column footer taxonomy (Learn/Programs/Give/Organization), zero orphans, org/EIN legal line — implemented (color changes to `#0c0e11` black in the redesign)
- JSON-LD layer (NGO, WebSite, BreadcrumbList, Article ×5, DonateAction, FAQPage mirroring visible text) — implemented; v2 name-ordering tweak pending (name → "Haitian Sensation Missions Inc")
- Placeholder convention, CONTENT regions, `content-manifest.md`, build guard — active
- Skip link, landmarks, labeled navs, single H1s, heading order, reduced motion, `:focus-visible` (to be restyled as the v2 dual ring) — done
- Image width/height, fetchpriority, lazy-loading — done; `/thank-you` — done

## Changes applied in this delta pass

- `/programs/education` retitled per v2 §3: title "Education in Haiti: How to Help Students in Pelerin", H1 "Education in Haiti", new meta description. v2 confirms **no matched-child sponsorship exists** — the previous "Sponsor a Child in Haiti" H1 (v1 §4's own target, flagged in the v1 report) implied individual matching and is now removed everywhere (title/OG/Twitter/H1/Article headline).
- Founder quote on `/about` marked `<!-- CONTENT:VERIFY -->` (v2 §9 known-verify list).

## Blockers / escalations before Phases 2–5 can start

1. **The three spec files are missing.** Not in the repo (`/design-spec/` does not exist), not delivered alongside the brief. They are authoritative for: all component visuals, hero anatomy, the per-page hero/H1 table (≤22ch H1s), the §20 page recipes, and the DoD screenshot-match. Building the Civic system from §4's summary alone would violate the brief's own "verify before you trust" rule. **Need: the three HTML files.**
2. **Font self-hosting is impossible from this environment.** All outbound downloads are blocked (403), so Libre Franklin / Source Sans 3 woff2 files cannot be fetched here. Options: (a) owner commits the subset woff2 files (or the spec files bundle them), (b) run the font step from a machine with network, (c) temporarily keep Google Fonts `<link>` and swap to self-hosted before launch — v2 forbids shipping that to production, so (a) or (b) is needed before the DoD.
3. **Brand red mismatch.** v2 locks `--red: #C1272D`; the current compiled site uses `--hf-red: #d30731` throughout (buttons, hover states, scroll-up). Treating v2 as authoritative means a visible brand-red shift — flagging rather than assuming, since v1 called the flag red "~#C1272D" while the built site has always used `#d30731`. **Confirm #C1272D is intended.**
4. **GA4 scope change.** v1 decision log (owner, 2026-08-27): GA4 + cookie consent added by owner post-operation. v2 §8 lists GA4 conversion wiring as P0 in-scope. **Confirm which stands** — and if in scope, provide the GA4 Measurement ID.
5. **PR #14 is still open/unmerged.** v2 work continues on the same branch and will land in that PR unless it's merged first and a fresh branch cut. Either works; merging first gives a cleaner v2 diff. **Owner's call.**

## Rebuild-plan notes once unblocked (v2 phases 2–8)

- SASS will be rebuilt token-first from v2 §4 (new `--navy-deep/-700/-100/-050`, gold-ink, red pair, ink/soft/mist/line, black set, 4px radius) with the existing partial structure retired in favor of component partials matching the design-system file.
- Fixed section rhythm (NAV → HERO → NAVY → WHITE → RED → WHITE FAQ → GOLD Zeffy → WHITE related → BLACK footer) replaces current page layouts; utility rhythm for contact/thank-you/legal.
- Governance rules 1–5 (§4) become lint checks in the report: no gold text on white, ≤1 red band/page, gold tiles only in navy sections, no small red text on navy, dual-ring focus.
- Hero images: 1600×900 WebP ≤110KB requires the image pipeline (sharp) — still blocked here; same resolution paths as v1 §7c (run locally or post-Cloudflare Polish, but hero ≤110KB needs actual conversion, so a local `npm run images:optimize` run is effectively a prerequisite for the v2 hero spec).


---

# Civic rebuild report (2026-08-30) — brief v2 phases 2–8

The three spec files were delivered and committed to `design-spec/`. The full Civic
design system is implemented sitewide.

## What was built
- **SASS rebuilt token-first** from the design-system spec: 8 partials (tokens, base,
  layout, header, hero, bands, components, footer), written as plain-CSS-in-SCSS so the
  committed compiled stylesheet is equivalent to the Netlify sass build by construction.
  All old partials retired. Compiled CSS: 25KB (was 41KB), zero Remixicon dependency.
- **All 20 pages regenerated** on the universal template: navy nav (hamburger + Donate
  always visible on mobile), slab hero in three heights (64vh home / 52vh article /
  34vh utility) with breadcrumbs → eyebrow → H1 → dek → "Last updated" inside the slab,
  hero image at 50% opacity (self-scrimming), fixed band rhythm navy → white → red →
  white FAQ → gold Zeffy → white cards → black footer, mobile sticky donate bar.
- **Content migrated intact**: every article's prose moved into the white band
  (pull-quotes → `.quote`, images → captionless `figure.photo`, links preserved);
  homepage about/history/join prose redistributed to the homepage white band and
  `/get-involved`; legal prose re-shelled with nav + short hero (fixes the missing
  banner landmark from v1). H1s/titles per v2 §3 and the template spec's table.
- **Education page** built as the reference implementation from mockup-B, with the
  legacy article prose preserved below it and every mockup-supplied statistic marked
  `CONTENT:VERIFY` (registry in content-manifest.md). Red band carries the
  "sponsor the classroom" reframe; FAQPage JSON-LD mirrors the visible FAQ.
- **/programs hub now indexed** (real copy from existing mission text) and added to the
  sitemap; the 7 placeholder scaffolds remain noindex with §9 placeholders.
- **Schema updated**: org name → "Haitian Sensation Missions Inc" (alternateName
  "Haitian Sensation Mission") per v2 §5; BreadcrumbList matches the new trails
  (including Home › Why Haiti › Safety); Article dateModified 2026-08-30; DonateAction +
  FAQPage on /donate; FAQPage on /programs/education.
- **Governance rules verified in output**: gold never text-on-white; gold tiles only in
  navy sections with one `.lead` ring; exactly one red band per page; dual-ring focus;
  `prefers-reduced-motion`; native `<details>` FAQ; charts (donut/bars/map SVG) carry
  role="img" + title/desc with data duplicated as text.
- Zeffy: unchanged modal flow, button in the gold band sitewide (script deferred,
  preconnects in place). Explicit width/height re-applied to all images
  (scripts/update-image-dimensions.py); hero images preloaded with fetchpriority=high;
  zero broken internal links; placeholder guard green.

## Deviations from the spec (flagged, not guessed)
1. **Fonts are Google-Fonts-linked, not self-hosted** — downloads are blocked in this
   environment (spec itself marks its links "mockup-only"). README action item #11.
2. **Hero images are existing JPEGs, not 1600×900 WebP ≤110KB** — conversion tooling
   cannot run here; run `npm run images:optimize -- --resize` (action item #4). The 50%
   navy overlay keeps contrast guaranteed meanwhile.
3. **Hero stand-ins** for the six pages the spec marks "needs selection" chosen from
   existing assets and marked `CONTENT:VERIFY`: disaster-relief (helping-people supplies
   photo), our-story (joe-coffee), where-your-money-goes (school-supplies),
   send-money-to-haiti (mother-child), memorial-giving (landscape), is-haiti-safe
   (Pétionville hillside).
4. **Brand red now #C1272D** per the spec files (previous builds used #d30731) — spec
   wins on visuals per the brief's own precedence rule.
5. **Contact form omitted** pending a form backend decision (README #12); homepage
   photo-card collage from the old design not carried over (assets remain in repo).
6. **GA4 not wired** — v1 owner decision ("after the operation") kept over v2 §8's P0
   listing until the owner confirms and supplies a Measurement ID.
7. Why-haiti-is-poor uses the timeline (spec recipe) but skips gold impact tiles —
   impact stats felt wrong on a history page; safe org tiles available on request.
