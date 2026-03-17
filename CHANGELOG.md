# Kyle Changelog

## [v0.1.0] — 2026-03-16 00:00
### Added
- Initial Next.js scaffold
- Claude API route at /app/api/analyze
- Conflict input UI on homepage

## [v0.1.1] — 2026-03-16 19:07
### Added
This update focuses on making the analysis output easier to read, scan, and compare. Instead of a single blocky response area, results are now organized into clearly labeled sections that you can expand/collapse, which better matches how you’ll iterate on prompts and evaluate outputs over time.

It also improves the “in-flight” experience: while the model is running, the UI now communicates progress with a skeleton layout, keeping the page stable and reducing perceived latency.

- **Response UX**: Refactored the output display into three collapsible cards: **Strategic Analysis**, **Predicted Outcomes**, and **Market Impact**
- **Loading state**: Added a three-card skeleton placeholder while `POST /api/analyze` is running (prevents layout jump and makes latency feel intentional)
- **Markdown support**: Added proper markdown rendering for each section so lists, headings, and emphasis display as intended (via `react-markdown`)
- **Dependencies**: Installed `react-markdown` to render markdown safely and consistently in the client UI

## [v0.1.2] — 2026-03-16 19:48
### Added
This update tightens up “getting started” and deployment readiness. The README now explains exactly how to configure local environment variables for Anthropic, and it includes a one-click Vercel deploy flow so the project can be deployed immediately after pushing to GitHub.

It also improves build behavior in environments where multiple lockfiles exist above the project directory (common in monorepos or shared dev machines). Next is now explicitly pointed at this project root to avoid workspace inference warnings and make builds more predictable.

- **Docs**: Added an `.env.local` setup guide to `README.md` (copy from `.env.local.example`, set `ANTHROPIC_API_KEY`, then run `npm run dev`)
- **Deploy**: Added a **Deploy with Vercel** button to `README.md` (with a placeholder GitHub repo URL to replace after pushing)
- **Next/Vercel config**: Set `turbopack.root` in `next.config.mjs` to prevent incorrect workspace root inference when other lockfiles are present
- **Docs fix**: Updated the README edit hint to point at `src/app/page.js` (App Router + `src/` layout)
