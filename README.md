# Jasmine Builds

The public project portfolio for [Jasmine Stock](https://github.com/jazzy15j),
founder of JDesigns Strategist.

The site brings Jasmine's public work into one place and explains each project
in plain language: what it does, who it helps, and why it matters.

## Project groups

- **Business AI systems** — Build Your Business Brain and its command packs
- **Useful everyday tools** — Concert Scout and Vacation Quest Generator
- **The studio** — JDesigns Strategist

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Then visit `http://localhost:3000`.

## Verify

```bash
npm run lint
npm test
npx next build
```

The GitHub Pages workflow publishes the static `out/` build automatically after
changes are pushed to `main`.
