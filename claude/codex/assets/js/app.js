/* Codex Explainer runtime.

   Scope (deliberately small):
     - module pages: sticky header, section jump menu, in-page contents,
       prev/next module links, footer, scroll-spy
     - landing page: the module cards
     - highlight.js

   No router, no state, no storage, no build step.

   Source of truth is split on purpose:
     - window.COURSE (manifest.js) owns the module ORDER and blurbs.
     - the page's own <section class="lesson-section"> elements own the
       section list, so the in-page contents can never drift from the
       headings actually on the page. scripts/verify.mjs checks the two
       against each other. */

(() => {
	const course = window.COURSE;
	if (!course) return;

	const el = (tag, attrs = {}, children = []) => {
		const node = document.createElement(tag);
		for (const [k, v] of Object.entries(attrs)) {
			if (v === null || v === undefined) continue;
			if (k === "text") node.textContent = v;
			else if (k === "html") node.innerHTML = v;
			else node.setAttribute(k, v);
		}
		for (const child of children) if (child) node.appendChild(child);
		return node;
	};

	const article = document.querySelector("article.lesson[data-module]");
	const modFile = article ? article.getAttribute("data-module") : null;
	const modIdx = modFile ? course.modules.findIndex((m) => m.file === modFile) : -1;
	const mod = modIdx !== -1 ? course.modules[modIdx] : null;

	/* ---------- shared bits ---------- */

	function buildFooter() {
		const short = (course.commit || "").slice(0, 7);
		return el("footer", {
			class: "site-footer",
			html:
				`A self-contained course on <span class="muted">${course.repo}</span> · ` +
				`code excerpts © their authors (${course.license}) · ` +
				`pinned at <code>${short}</code>`,
		});
	}

	/* ---------- module page ---------- */

	// Every <section class="lesson-section"> becomes a contents entry.
	function readSections() {
		return Array.from(article.querySelectorAll("section.lesson-section")).map((sec, i) => {
			const h2 = sec.querySelector("h2");
			return {
				id: sec.id || `s${i + 1}`,
				title: h2 ? h2.textContent.trim() : `Section ${i + 1}`,
				minutes: sec.getAttribute("data-minutes"),
				node: sec,
			};
		});
	}

	function buildTopbar(sections) {
		const panel = el(
			"ul",
			{ class: "secnav-panel" },
			sections.map((s) => el("li", {}, [el("a", { href: `#${s.id}`, text: s.title, "data-spy": s.id })])),
		);

		const secnav = el("details", { class: "secnav" }, [
			el("summary", { text: "Sections", "aria-label": "Jump to a section" }),
			panel,
		]);

		// Tapping an entry jumps and closes the menu.
		panel.addEventListener("click", (e) => {
			if (e.target.closest("a")) secnav.removeAttribute("open");
		});
		// Tapping anywhere else closes it too.
		document.addEventListener("click", (e) => {
			if (secnav.hasAttribute("open") && !secnav.contains(e.target)) secnav.removeAttribute("open");
		});
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") secnav.removeAttribute("open");
		});

		return el("div", { class: "topbar" }, [
			el("div", { class: "topbar-inner" }, [
				el("a", { class: "back", href: "index.html", "aria-label": "Back to contents", text: "‹" }),
				el("span", { class: "mod-chip", text: `M${mod.num}` }),
				el("span", { class: "mod-title", text: mod.title }),
				secnav,
			]),
		]);
	}

	function buildToc(sections) {
		return el("nav", { class: "toc", "aria-label": "In this module" }, [
			el("span", { class: "toc-label", text: "In this module" }),
			el(
				"ol",
				{},
				sections.map((s) =>
					el("li", {}, [
						el("a", { href: `#${s.id}`, "data-spy": s.id }, [
							el("span", { text: s.title }),
							s.minutes ? el("span", { class: "toc-mins", text: `${s.minutes} min` }) : null,
						]),
					]),
				),
			),
		]);
	}

	function buildModuleNav() {
		const prev = modIdx > 0 ? course.modules[modIdx - 1] : null;
		const next = modIdx < course.modules.length - 1 ? course.modules[modIdx + 1] : null;
		const nav = el("nav", { class: "module-nav" });
		if (prev) {
			nav.appendChild(
				el("a", { class: "prev", href: prev.file }, [
					el("span", { class: "nav-dir", text: `← Module ${prev.num}` }),
					el("span", { class: "nav-title", text: prev.title }),
				]),
			);
		}
		if (next) {
			nav.appendChild(
				el("a", { class: "next", href: next.file }, [
					el("span", { class: "nav-dir", text: `Module ${next.num} →` }),
					el("span", { class: "nav-title", text: next.title }),
				]),
			);
		}
		return nav;
	}

	// Highlight whichever section is currently at the top of the viewport.
	function startScrollSpy(sections) {
		const links = Array.from(document.querySelectorAll("[data-spy]"));
		if (!links.length || !("IntersectionObserver" in window)) return;

		const visible = new Set();
		const mark = () => {
			// Topmost visible section wins; if none, keep the last one passed.
			let current = null;
			for (const s of sections) {
				if (visible.has(s.id)) {
					current = s.id;
					break;
				}
			}
			if (!current) {
				for (const s of sections) {
					if (s.node.getBoundingClientRect().top <= 80) current = s.id;
				}
			}
			for (const a of links) a.classList.toggle("active", a.getAttribute("data-spy") === current);
		};

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) visible.add(entry.target.id);
					else visible.delete(entry.target.id);
				}
				mark();
			},
			{ rootMargin: "-72px 0px -60% 0px", threshold: 0 },
		);
		for (const s of sections) io.observe(s.node);
		mark();
	}

	function buildModulePage() {
		const sections = readSections();

		document.body.insertBefore(buildTopbar(sections), document.body.firstChild);

		const page = el("div", { class: "page has-header" });
		const crumbs = el("p", { class: "crumbs" }, [
			el("a", { href: "index.html", text: "Contents" }),
			el("span", { class: "sep", text: "›" }),
			el("span", { text: `Module ${mod.num}` }),
		]);

		// Slot the contents list in right after the lede.
		const lede = article.querySelector("p.lede");
		const toc = buildToc(sections);
		if (lede && lede.nextSibling) article.insertBefore(toc, lede.nextSibling);
		else article.appendChild(toc);

		// Number each section heading.
		sections.forEach((s, i) => {
			const h2 = s.node.querySelector("h2");
			if (h2 && !s.node.querySelector(".section-num")) {
				s.node.insertBefore(
					el("span", { class: "section-num", text: `${mod.num}.${i + 1}` }),
					h2,
				);
			}
		});

		article.parentNode.removeChild(article);
		page.appendChild(crumbs);
		page.appendChild(article);
		page.appendChild(buildModuleNav());
		page.appendChild(buildFooter());
		document.body.appendChild(page);

		startScrollSpy(sections);
	}

	/* ---------- landing page ---------- */

	function renderSyllabus() {
		const mount = document.getElementById("syllabus");
		if (!mount) return;
		for (const m of course.modules) {
			mount.appendChild(
				el("a", { class: "module-card", href: m.file }, [
					el("div", { class: "mc-head" }, [
						el("span", { class: "mc-num", text: `M${m.num}` }),
						el("h2", { text: m.title }),
					]),
					m.blurb ? el("p", { text: m.blurb }) : null,
					el(
						"ul",
						{ class: "mc-sections" },
						(m.sections || []).map((s) => el("li", { text: s })),
					),
				]),
			);
		}
		const footMount = document.getElementById("footer");
		if (footMount) footMount.appendChild(buildFooter());
	}

	const run = () => {
		if (mod) buildModulePage();
		renderSyllabus();
		if (window.hljs) window.hljs.highlightAll();
	};

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
	else run();
})();
