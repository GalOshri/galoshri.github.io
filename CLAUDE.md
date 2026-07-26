# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal portfolio site for Gal Oshri, hosted on GitHub Pages with custom domain (www.galoshri.com). Single-page HTML/CSS site with no build system, no package manager, and no framework dependencies.

## Architecture

- `index.html` — Landing page. Uses a centered cover-page layout with Bootstrap 3.1.1 and jQuery 1.11.0 loaded from CDN.
- `static/base.css` — Custom styles for layout (CSS table/cell vertical centering), profile picture (circular with shadow), and responsive breakpoints.
- `static/profile_pic.jpg` — Profile image.
- `CNAME` — Custom domain config for GitHub Pages.
- `.nojekyll` — Disables Jekyll so GitHub Pages serves files verbatim. **Required**: course content contains `{{ ... }}` sequences inside code samples that Liquid would otherwise strip.
- `box/` — Hidden box-breathing animation page.
- `claude/` — Codebase Academy: two self-contained courses on real codebases. Independent of the rest of the site; each course carries its own CSS/JS and works offline.
  - `claude/index.html` — Hub listing both courses. Self-contained (inline CSS) so it survives changes to either course.
  - `claude/pi/` — 10 modules, 58 lesson pages, sidebar navigation. Vendored from the `codebase-academy` project; paths were flattened from `courses/pi/` (lesson pages reference `../assets/`, and `app.js` resolves the site root to `/claude/`).
  - `claude/codex/` — 12 module pages, sticky-header navigation, one page per module. Vendored from the `codex-explainer` project; the pinned upstream commit is recorded in `claude/codex/manifest.js` and shown in every page footer.

## Development

No build step. Edit HTML/CSS directly and push to `main` to deploy via GitHub Pages. Open `index.html` in a browser to preview locally.

### Editing the courses

Both courses under `claude/` are deployed copies. Their upstream projects live outside this repo (`~/Projects/codebase-academy` and `~/Projects/codex-explainer`), which is where the authoring tooling and verification scripts are. Edits made here will not flow back, so prefer editing upstream and re-copying — but note that `claude/pi/` has two deployment-specific changes that must be re-applied: flattened asset paths, and `100dvh` plus a narrow-screen table-scroll rule in its `site.css`.

## External Dependencies (CDN)

- Bootstrap 3.1.1 (CSS + JS)
- jQuery 1.11.0
- Google Analytics (UA-53662827-1)
