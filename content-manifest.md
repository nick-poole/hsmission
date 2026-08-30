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
| `/` | Civic rebuild: existing homepage prose preserved in the white band. Founder quote removed 2026-08-30 per Joseph — the site should not focus on him |
| `/programs` | Now indexed: real answer block + program cards composed from existing homepage/mission copy |
| `/donate` | Existing copy + FAQ preserved; FAQPage JSON-LD mirrors visible FAQ |
| `/why-haiti-is-poor` | ✅ **Final verified copy v2 (Aug 2026 fact-check) — landed 2026-08-30.** Timeline, 6 body sections, attributed NYT blockquote, 7-question FAQ (FAQPage schema mirrors it exactly), and a 19-entry numbered Sources list with inline superscript citations. Legacy `/articles/history` prose it replaced is preserved in git at commit `0acfb4f`. 🔴 **Maintenance: the Aug 30 2026 election sentence must be updated with the actual outcome — see registry below.** Refresh the "Haiti today" section twice a year; every figure there is date-stamped |
| `/programs/education` | Civic reference page built from mockup-B copy + legacy prose migrated intact below it (consolidate when final copy lands). CONTENT:VERIFY on: ~90% private-school stat, education-spending rank, 1-in-5 enrollment, $30–43 comparison, meal-cost benchmarks, tier amounts beyond $5. "Sponsor the classroom" framing per v2 — never imply individual child matching |
| `/programs/clean-water` | Prose moved intact from `/articles/wells-to-wellness` |
| `/programs/disaster-relief` | Prose moved intact; H1 retargeted to "Haiti Earthquake Relief" |
| `/about` | Composed only from existing site copy + approved `mission.md` (mission statement, Pelerin village, founder quote, org facts) |
| `/about/our-story` | Prose moved intact from `/articles/our-story` |
| `/contact` | Contact details from existing footer + privacy policy address |
| `/thank-you` | Transactional copy only; noindex permanently; GA4 conversion event to be added (README action items) |

## CONTENT:VERIFY registry (brief v2 §9 — waiting on Joseph, do not resolve)

Search the codebase for `CONTENT:VERIFY`. Currently marked:
- Founder quote wording (`/about` only — removed from `/` per Joseph)
- Education statistics from the design mockup: ~90% private schools, spending rank, 1-in-5 secondary enrollment, $30–43/mo sponsorship comparison (`/programs/education`)
- Meal-cost benchmarks $0.09 / $0.13 (`/donate/where-your-money-goes`)
- Tier-ladder amounts beyond the $5 anchor (`/programs/education`, `/donate`)
- 🔴 **`/why-haiti-is-poor` — election outcome (TIME-SENSITIVE).** Haiti's first general elections in a decade were scheduled for **August 30, 2026 — the day this copy landed**. The published sentence is written to remain accurate either way ("were scheduled for… though the electoral council had warned holding them on schedule might prove impossible") and cites [S18], but it must be updated with what actually happened. Search `CONTENT:VERIFY — ELECTION OUTCOME`. This is also the page's first scheduled maintenance trigger.
- BLUF answer blocks on the *remaining* migrated pages (clean-water, disaster-relief, our-story) use each page's existing lede as a stand-in
- Hero image stand-ins: disaster-relief, our-story, where-your-money-goes, send-money-to-haiti, memorial-giving, is-haiti-safe
