# Prompt for Codex: Generate and Integrate Images for the NSSF Uganda Center of Excellence Site

Copy everything below the line into Codex (or another coding agent with image-generation/sourcing capability), pointed at the project repository.

---

## Project context

This is a static HTML site — the NSSF Uganda "Center of Excellence" — built from a rebranded web template. The header, footer, colors, and fonts have already been reskinned to match NSSF Uganda's brand (primary blue `#145fa7`, navy `#0f1e45`, accent green `#8ec63e`, neutral grays, Open Sans body / Roboto Condensed headings). Text content is finished. **The one thing missing is real imagery** — every image currently on the site is a generic stock photo left over from the original template, and the 23 category learning pages have no images at all.

Your job: generate or source every image listed below, save it to the exact path specified, and update the corresponding HTML (or the page-generator scripts, where noted) to reference it. Do not touch text content, layout, or navigation — only images and the `<img>`/CSS `background-image` references that point to them.

## Hard rule on human imagery — follow exactly

- **Illustrative/non-factual images of people** (stock-style photos showing "a member," "a saver," "a staff member," generic scenes of people learning, working, or in an office) **must depict Black African individuals**, dressed and set in ways consistent with an East African / Ugandan professional and everyday context.
- **Factual images** — anything depicting an actual documented person, real event, or real place (e.g., a screenshot-style rendering of NSSF's real Kampala office building, an actual historical photo) — must stay factually accurate instead. Don't apply the diversity rule to override factual accuracy; if you're not generating a real documented image, treat it as illustrative and follow the rule above.
- When in doubt about whether an image is "illustrative" or "factual," default to illustrative (i.e., default to depicting Black African individuals) — nearly everything in this list is illustrative.
- Never use real, named public figures in generated imagery.

## Technical ground rules

- Match existing file formats: JPEG for photos, PNG for icons/logos with transparency, SVG preferred for diagrams/illustrations where practical (scales cleanly, small file size, matches the site's flat modern aesthetic).
- Preserve exact existing filenames and dimensions unless a task below says otherwise — the HTML already references these paths, so keeping names avoids extra markup edits.
- Compress photos reasonably (target under ~300KB each) — this is a public-facing informational site, not a portfolio site; load speed matters more than maximum resolution.
- Style direction across all images: clean, modern, optimistic, professional but approachable — not corporate-sterile, not clip-art. Use the site's brand colors as accents where a design/illustration (not photo) is being created. Avoid clichéd stock-photo tropes (fake handshakes, generic laptop-and-coffee shots, exaggerated smiling-at-camera poses).

---

## Part 1 — Header / hero images (highest priority)

### 1a. Homepage hero slider — 4 images, 1920×1280px, JPEG
Path: `images/slides/slides1.jpg` through `slides4.jpg`

These are the full-width rotating banner behind the homepage's headline text ("Knowledge Built for All Ugandans," "17 Learning Categories, One Hub," "Learn It. Know It. Prove It.," "#WeBelieveInU"). Each slide should be a distinct, high-quality photo illustrating everyday Ugandans engaging with learning, financial planning, or community/work life — not a literal screenshot of the website. Suggested subjects, one per slide:
1. A Ugandan professional or small business owner reviewing documents/a phone in a bright, modern setting (financial planning theme).
2. A small group of Ugandan colleagues in a discussion or training setting (workplace learning theme).
3. A Ugandan person using a phone or tablet outdoors or in transit — reflecting "learn anywhere" (mobile learning theme).
4. A warm, aspirational shot reflecting community/family financial security — e.g., an older and younger Ugandan generation together (ties to the "#WeBelieveInU / investing in our people" slide).

All four must depict Black African individuals per the rule above. Keep text-safe space on the left third of each image (the headline text overlays there) — avoid busy detail in that region.

### 1b. Homepage "Center of Excellence" banner — 1 image, 1166×596px, JPEG
Path: `images/11.jpg`

A single wide banner image for the "The Center of Excellence" section. Suggested: a bright, editorial-style photo of a Ugandan person reading or studying on a phone/tablet/laptop, calm and focused — representing self-paced learning. Depicts a Black African individual per the rule above.

---

## Part 2 — Homepage category-card images

### 2a. Featured Categories cards — 7 images, 330×238px, JPEG
Path: `images/portfolio/1.jpg` through `7.jpg` (1–6 exist and need replacing; **7.jpg is new** — also update `index.html`'s "General/Business" card, currently reusing `1.jpg`, to point at the new `7.jpg`)

Each image represents one featured category. These should be **simple, abstract or symbolic photos/illustrations tied to the topic**, not necessarily photos of people — think stock-photography-meets-icon:
1. `1.jpg` — Strategic Management: a compass, chess pieces, or a whiteboard/roadmap sketch (direction/planning metaphor).
2. `2.jpg` — Carbon Credits & Climate Finance: a forest canopy, solar panels, or a tree seedling in soil.
3. `3.jpg` — Investment & Pension Fund Management: an upward growth chart, coins/savings jar, or a simple bar-chart motif.
4. `4.jpg` — Corporate Governance & Ethics: a gavel, boardroom table, or scales-of-balance motif.
5. `5.jpg` — Financial Literacy & Personal Finance: a Ugandan person budgeting with a notebook/phone calculator — **this one depicts a person, so follow the human-imagery rule.**
6. `6.jpg` — Data Protection & Information Security: an abstract lock/shield motif, or a laptop with a subtle security icon overlay.
7. `7.jpg` — Business (General tier): a Ugandan small-business or market/storefront scene, or a handshake-free depiction of commerce (avoid the handshake cliché) — **depicts people, follow the rule.**

### 2b. Category Spotlight images — 4 images, 270×270px, JPEG
Path: `images/blog/list2/1.jpg` through `4.jpg`

Square images for the "Category Spotlight" cards: Project Management, Communication & Stakeholder Engagement, Occupational Health & Safety, Innovation & Entrepreneurship. Same symbolic/abstract approach as 2a — e.g., a Gantt-chart/checklist motif for Project Management, a megaphone or two people in conversation for Communication, a hard hat or safety signage for OHS, a lightbulb or sprouting plant for Innovation. Use people only where natural (e.g., Communication), and follow the human-imagery rule if you do.

---

## Part 3 — Category page header images (all 23 pages)

Every page at `coe/<slug>.html` currently has **zero images** — just the title and reading text. Add one header/banner image per category, inserted just below the page title and above the first reading section (`<div class="coe-lede">`).

- **File path convention:** `images/coe/<slug>.jpg` (new folder — create it)
- **Dimensions:** 1200×400px, JPEG, landscape banner
- **Markup:** find `render_category()` in `generate.py` (the page generator) and add the image there so it applies consistently across all pages — don't hand-edit each of the 23 HTML files individually, since they're generated from this script and would need regenerating anyway. After editing the generator, re-run `build.py` to regenerate all 23 pages plus the hub, matching the existing build pipeline already in the repo.
- **Style:** each should be a simple, symbolic/topical image (same spirit as Part 2a) tied to that category's subject — not a person's face as the default choice; reserve people-centric images for the categories where it's natural (Financial Literacy, HR Practices, Member Service Excellence, Leadership & People Development, Communication & Stakeholder Engagement) and follow the human-imagery rule for those.

Suggested subject per category (use judgment to adapt/improve):

| Slug | Suggested image subject |
|---|---|
| strategic-management | Compass / roadmap sketch / chess pieces |
| performance-management | Upward arrow / target with dart / progress checklist |
| carbon-credits | Forest canopy or solar panel field |
| innovation-entrepreneurship | Lightbulb, sprouting plant, or sketch-to-product motif |
| investment-pension-management | Growth chart / coin stack / seedling-to-tree growth metaphor |
| risk-management | Risk matrix grid or a tightrope/balance motif |
| regulatory-compliance | Gavel, scales, or a checklist/stamped-document motif |
| corporate-governance-ethics | Boardroom table or scales-of-balance |
| financial-literacy | **Person** budgeting/reviewing finances (follow human-imagery rule) |
| member-service-excellence | **Person(s)** in a helpful service interaction (follow rule) |
| hr-practices | **People** in an interview or team setting (follow rule) |
| sustainability-esg | Green leaf/plant integrated with a subtle chart or globe motif |
| leadership-development | **Person** mentoring/coaching another (follow rule) |
| project-management | Gantt chart / kanban board / checklist motif |
| communication-stakeholder-engagement | **People** in conversation, or a megaphone/speech-bubble motif |
| occupational-health-safety | Hard hat, safety signage, or hazard-pictogram motif |
| data-protection-security | Padlock/shield abstract motif |
| business | Market stall, storefront, or general commerce scene |
| management | Org-chart sketch or team-coordination motif |
| life-sciences | Abstract biology motif (leaf/cell pattern) or a stethoscope |
| medicine | Stethoscope, medical cross, or clinic-setting motif (non-graphic, non-clinical-gore) |
| arts | Paintbrush/palette or traditional Ugandan craft motif (drum, woven textile pattern) |
| humanities | Open book, historical building silhouette, or a library motif |

---

## Part 4 — In-content diagrams / illustrations for select categories

For the following categories, generate **one explanatory diagram** (SVG strongly preferred — it's code, renders crisply, and fits a coding agent's strengths better than a raster illustration) to insert within the reading material where it clarifies a concept discussed in the text. Insert it after the relevant paragraph in `content_tier1.py`, `content_tier2.py`, `content_tier3.py`, or `content_existing.py` (wherever that category's content lives), or directly in `generate.py`'s rendering if a shared diagram component makes more sense. Use the site's brand palette (`#145fa7` primary, `#0f1e45` navy, `#8ec63e` accent, neutral grays) for all diagram elements.

1. **Strategic Management** — a simple 4-box cycle diagram: Analyze → Formulate → Implement → Evaluate (looping back to Analyze), illustrating the strategic management cycle described in Reading Section 1.
2. **Performance Management** — a 4-stage cycle diagram: Plan → Monitor → Develop → Review, matching the continuous cycle described in Reading Section 1.
3. **Risk Management** — a simple 2×2 likelihood/impact risk matrix (axes labeled Likelihood and Impact, quadrants shaded from green/low to red/high) illustrating Reading Section 3.
4. **Carbon Credits & Climate Finance** — a linear flow diagram: Project Design → Validation → Verification → Credit Issuance → Retirement, illustrating the project lifecycle in Reading Section 2.
5. **Investment & Pension Fund Management** — a simple pie or bar chart illustrating asset allocation across equities/fixed income/real estate/alternatives, illustrating diversification in Reading Section 2 (values can be illustrative, not NSSF's actual real allocation, unless you have a real public figure to cite — if so, cite it).
6. **Occupational Health & Safety** — a 5-level pyramid diagram illustrating the hierarchy of controls (Elimination → Substitution → Engineering Controls → Administrative Controls → PPE), matching Reading Section 1.
7. **Corporate Governance & Ethics** — a simple org-structure diagram showing Board → Committees (Audit/Risk/Remuneration) → Management, illustrating Reading Section 2.
8. **Data Protection & Information Security** — a simple "need-to-know" access diagram (concentric circles or a funnel showing progressively restricted access), illustrating Reading Section 2.

Keep each diagram simple — one clear idea, minimal text, legible at the reading column's width (~700px). These are comprehension aids, not decorative filler.

---

## Part 5 — Lower priority / optional cleanup

These pages are not linked from the site's navigation (leftover template pages: `course-grid.html`, `blog-list01.html`, `gallery-grid01.html`, etc.) and are not part of the live user-facing site. **Skip these unless you finish everything above and want extra polish** — do not prioritize them over Parts 1–4.

---

## Deliverable checklist

- [ ] 4 hero slider images (`images/slides/slides1–4.jpg`)
- [ ] 1 homepage banner (`images/11.jpg`)
- [ ] 7 featured-category card images (`images/portfolio/1–7.jpg`), plus the `index.html` reference fix pointing the Business card at `7.jpg`
- [ ] 4 category-spotlight images (`images/blog/list2/1–4.jpg`)
- [ ] 23 category header images (`images/coe/<slug>.jpg`), plus the `generate.py` template edit and a `build.py` run to regenerate and redeploy all category pages
- [ ] 8 in-content diagrams (SVG) for the categories listed in Part 4
- [ ] Confirm every people-depicting image follows the human-imagery rule (Black African individuals for illustrative use; factual accuracy preserved for any real documented person/event)
- [ ] Validate all touched HTML still parses cleanly and no image path is broken (404) before calling this done

---

*(End of prompt for Codex.)*
