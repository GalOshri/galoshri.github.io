# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal portfolio site for Gal Oshri, hosted on GitHub Pages with custom domain (www.galoshri.com). Single-page HTML/CSS site with no build system, no package manager, and no framework dependencies.

## Architecture

- `index.html` — Entire site in one file. Uses a centered cover-page layout with Bootstrap 3.1.1 and jQuery 1.11.0 loaded from CDN.
- `static/base.css` — Custom styles for layout (CSS table/cell vertical centering), profile picture (circular with shadow), and responsive breakpoints.
- `static/profile_pic.jpg` — Profile image.
- `CNAME` — Custom domain config for GitHub Pages.

## Development

No build step. Edit HTML/CSS directly and push to `main` to deploy via GitHub Pages. Open `index.html` in a browser to preview locally.

## External Dependencies (CDN)

- Bootstrap 3.1.1 (CSS + JS)
- jQuery 1.11.0
- Google Analytics (UA-53662827-1)
