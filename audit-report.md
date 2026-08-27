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

## 8. Residual issues / for human decision

- **Gold `#f3b419` on white** and light-gray body text on white surfaces likely fail 4.5:1 — audited in Phase 5; reported, not changed (brief §8).
- New scaffold pages ship with `noindex` + placeholders and are excluded from `sitemap.xml` until real copy lands (never index placeholders); flip robots + add to sitemap at content time. Tracked in `content-manifest.md`.
- The placeholder build-guard is provided as `npm run guard:placeholders` but is **not** wired into the Netlify build yet — wiring it in would fail every deploy until all content lands. Wire it in once content is delivered (README action item).
- Run before launch (outside this environment): W3C vnu, axe-core, Lighthouse/PSI, external link checker, `scripts/optimize-images.mjs`.
