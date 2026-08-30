# Content Manifest

Tracks every content placeholder on the site (brief §7). **No page listed as
"placeholder" may go live indexed** — they are all `noindex` and excluded from
`sitemap.xml` until real copy lands. When copy lands on a page:

1. Replace the `[PLACEHOLDER: …]` text inside its `<!-- CONTENT:* -->` regions.
2. Flip `<meta name="robots">` from `noindex, follow` to `index, follow`.
3. Add the page to `sitemap.xml` with a fresh `lastmod`.
4. If the FAQ block got real copy, add matching FAQPage JSON-LD (must mirror the
   rendered text exactly — brief §6.5).
5. Update the `<time>` "Last updated" line.
6. Run `npm run guard:placeholders` — it must pass before deploying an indexed page.

Verify with: `grep -rn "PLACEHOLDER" --include='*.html' .`

## Pages awaiting copy (noindex, not in sitemap)

| Page | Regions with placeholders | Target lengths | Status |
|---|---|---|---|
| `/is-haiti-safe` | BLUF, BODY ×4, FAQ ×3, CTA | BLUF 40–60w; sections 100–150w; FAQ answers 40–60w | ⬜ awaiting copy |
| `/programs/community-outreach` | BLUF, BODY ×3, FAQ ×3, CTA | as above | ⬜ awaiting copy |
| `/donate/where-your-money-goes` | BLUF, BODY ×3, FAQ ×3, CTA | as above | ⬜ awaiting copy |
| `/donate/send-money-to-haiti` | BLUF, BODY ×3, FAQ ×3, CTA | as above | ⬜ awaiting copy |
| `/donate/memorial-giving` | BLUF, BODY ×3, FAQ ×3, CTA | as above | ⬜ awaiting copy |
| `/get-involved` | BLUF, BODY ×3, CTA | BLUF 40–60w; sections 60–100w | ⬜ awaiting copy |
| `/get-involved/mission-trips` | BLUF, BODY ×3, FAQ ×3, CTA | as above | ⬜ awaiting copy |

## Live pages with content notes (indexed, real copy)

| Page | Note |
|---|---|
| `/` | Civic rebuild: existing homepage prose preserved in the white band; founder quote marked CONTENT:VERIFY |
| `/programs` | Now indexed: real answer block + program cards composed from existing homepage/mission copy |
| `/donate` | Existing copy + FAQ preserved; FAQPage JSON-LD mirrors visible FAQ |
| `/why-haiti-is-poor` | Prose moved intact from `/articles/history`; H1 retargeted to "Why Is Haiti So Poor?"; BLUF answer-block can be added when copy team delivers |
| `/programs/education` | Civic reference page built from mockup-B copy + legacy prose migrated intact below it (consolidate when final copy lands). CONTENT:VERIFY on: ~90% private-school stat, education-spending rank, 1-in-5 enrollment, $30–43 comparison, meal-cost benchmarks, tier amounts beyond $5. "Sponsor the classroom" framing per v2 — never imply individual child matching |
| `/programs/clean-water` | Prose moved intact from `/articles/wells-to-wellness` |
| `/programs/disaster-relief` | Prose moved intact; H1 retargeted to "Haiti Earthquake Relief" |
| `/about` | Composed only from existing site copy + approved `mission.md` (mission statement, Pelerin village, founder quote, org facts) |
| `/about/our-story` | Prose moved intact from `/articles/our-story` |
| `/contact` | Contact details from existing footer + privacy policy address |
| `/thank-you` | Transactional copy only; noindex permanently; GA4 conversion event to be added (README action items) |

## CONTENT:VERIFY registry (brief v2 §9 — waiting on Joseph, do not resolve)

Search the codebase for `CONTENT:VERIFY`. Currently marked:
- Founder quote wording (`/`, `/about`)
- Education statistics from the design mockup: ~90% private schools, spending rank, 1-in-5 secondary enrollment, $30–43/mo sponsorship comparison (`/programs/education`)
- Meal-cost benchmarks $0.09 / $0.13 (`/donate/where-your-money-goes`)
- Tier-ladder amounts beyond the $5 anchor (`/programs/education`, `/donate`)
- BLUF answer blocks on migrated pages use each page's existing lede as a stand-in
- Hero image stand-ins: disaster-relief, our-story, where-your-money-goes, send-money-to-haiti, memorial-giving, is-haiti-safe
