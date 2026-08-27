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
| `/programs` | BLUF, CTA (program cards are real copy) | BLUF 40–60w | ⬜ awaiting copy |
| `/programs/community-outreach` | BLUF, BODY ×3, FAQ ×3, CTA | as above | ⬜ awaiting copy |
| `/donate/where-your-money-goes` | BLUF, BODY ×3, FAQ ×3, CTA | as above | ⬜ awaiting copy |
| `/donate/send-money-to-haiti` | BLUF, BODY ×3, FAQ ×3, CTA | as above | ⬜ awaiting copy |
| `/donate/memorial-giving` | BLUF, BODY ×3, FAQ ×3, CTA | as above | ⬜ awaiting copy |
| `/get-involved` | BLUF, BODY ×3, CTA | BLUF 40–60w; sections 60–100w | ⬜ awaiting copy |
| `/get-involved/mission-trips` | BLUF, BODY ×3, FAQ ×3, CTA | as above | ⬜ awaiting copy |

## Live pages with content notes (indexed, real copy)

| Page | Note |
|---|---|
| `/` | Existing copy preserved; no placeholders |
| `/donate` | Existing copy + FAQ preserved; FAQPage JSON-LD mirrors visible FAQ |
| `/why-haiti-is-poor` | Prose moved intact from `/articles/history`; H1 retargeted to "Why Is Haiti So Poor?"; BLUF answer-block can be added when copy team delivers |
| `/programs/education` | Prose moved intact. ⚠ H1/title now say "Sponsor a Child in Haiti" per brief §4 — **verify a sponsorship offering actually exists** before Ad Grant submission; body copy still describes general education outreach |
| `/programs/clean-water` | Prose moved intact from `/articles/wells-to-wellness` |
| `/programs/disaster-relief` | Prose moved intact; H1 retargeted to "Haiti Earthquake Relief" |
| `/about` | Composed only from existing site copy + approved `mission.md` (mission statement, Pelerin village, founder quote, org facts) |
| `/about/our-story` | Prose moved intact from `/articles/our-story` |
| `/contact` | Contact details from existing footer + privacy policy address |
| `/thank-you` | Transactional copy only; noindex permanently; GA4 conversion event to be added (README action items) |
