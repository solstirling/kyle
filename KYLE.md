# Kyle

## Stack
- **Framework**: Next.js (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **LLM provider**: Anthropic Claude via `@anthropic-ai/sdk`

## Key files
- **Homepage UI**: `src/app/page.js`
  - Textarea for conflict description
  - Submit button
  - Response area rendering `{ strategic_analysis, predicted_outcomes, market_impacts }`
- **API route**: `src/app/api/analyze/route.js`
  - `POST /api/analyze`
  - Calls Anthropic Claude with a system prompt defining Kyle as a military strategy analyst
  - Returns structured JSON: `{ strategic_analysis, predicted_outcomes, market_impacts }`

## Environment
- **Required**: `ANTHROPIC_API_KEY`
- **Optional**: `ANTHROPIC_MODEL` (default: `claude-3-5-sonnet-latest`)

## Current phase
Initial scaffold complete: UI + API route wired end-to-end for conflict analysis.

