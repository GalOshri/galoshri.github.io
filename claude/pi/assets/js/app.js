/* Codebase Academy runtime.
   Scope (deliberately small): build the sidebar from window.COURSE,
   mark the active lesson, inject breadcrumbs + lesson meta + prev/next,
   render the course syllabus on the landing page, run highlight.js.
   No router, no state, no storage. */

(() => {
	const course = window.COURSE;
	if (!course) return;

	// Flatten lessons with back-references to their module.
	const flat = [];
	for (const mod of course.modules) {
		for (const lesson of mod.lessons) {
			flat.push({ mod, lesson, href: `${mod.dir}/${lesson.file}` });
		}
	}

	// Where are we? Lesson pages live at <courseRoot>/<module-dir>/<file>.
	const segments = location.pathname.split("/").filter(Boolean);
	const last = decodeURIComponent(segments[segments.length - 1] || "");
	const parent = decodeURIComponent(segments[segments.length - 2] || "");
	const idx = flat.findIndex((e) => e.lesson.file === last && e.mod.dir === parent);
	const isLesson = idx !== -1;

	// Path prefixes relative to the current page.
	// This course is deployed standalone at /claude/pi/, so the course root is
	// one level up from a lesson and the site root is the /claude/ index that
	// lists the explainers — one level above the course.
	const toCourseRoot = isLesson ? "../" : "";
	const toSiteRoot = isLesson ? "../../" : "../";

	const el = (tag, attrs = {}, children = []) => {
		const node = document.createElement(tag);
		for (const [k, v] of Object.entries(attrs)) {
			if (k === "text") node.textContent = v;
			else if (k === "html") node.innerHTML = v;
			else node.setAttribute(k, v);
		}
		for (const child of children) node.appendChild(child);
		return node;
	};

	function buildSidebar() {
		const nav = el("nav", { class: "sidebar" });
		nav.appendChild(el("a", { class: "brand", href: `${toSiteRoot}index.html`, text: "Codebase Academy" }));
		nav.appendChild(el("a", { class: "course-title", href: `${toCourseRoot}index.html`, text: course.title }));

		const toggle = el("button", { class: "sidebar-toggle", type: "button", text: "Course contents" });
		toggle.addEventListener("click", () => {
			if (nav.hasAttribute("data-mobile-open")) nav.removeAttribute("data-mobile-open");
			else nav.setAttribute("data-mobile-open", "");
		});
		nav.appendChild(toggle);

		course.modules.forEach((mod, mi) => {
			const isCurrent = isLesson && flat[idx].mod === mod;
			const details = el("details", isCurrent ? { open: "" } : {});
			details.appendChild(
				el("summary", {}, [
					el("span", { class: "module-num", text: String(mi + 1) }),
					el("span", { text: mod.title }),
				]),
			);
			const list = el("ol");
			for (const lesson of mod.lessons) {
				const li = el("li");
				if (lesson.soon) {
					li.appendChild(el("span", { class: "soon", text: `${lesson.title} — soon` }));
				} else {
					const a = el("a", { href: `${toCourseRoot}${mod.dir}/${lesson.file}`, text: lesson.title });
					if (isLesson && flat[idx].mod === mod && flat[idx].lesson === lesson) a.className = "active";
					li.appendChild(a);
				}
				list.appendChild(li);
			}
			details.appendChild(list);
			nav.appendChild(details);
		});
		return nav;
	}

	function buildCrumbs(entry) {
		const crumbs = el("div", { class: "crumbs" });
		crumbs.appendChild(el("a", { href: `${toSiteRoot}index.html`, text: "Home" }));
		crumbs.appendChild(el("span", { class: "sep", text: "›" }));
		crumbs.appendChild(el("a", { href: `${toCourseRoot}index.html`, text: course.shortTitle || course.title }));
		crumbs.appendChild(el("span", { class: "sep", text: "›" }));
		crumbs.appendChild(el("span", { text: entry.mod.title }));
		return crumbs;
	}

	function buildMeta(entry) {
		const n = entry.mod.lessons.indexOf(entry.lesson) + 1;
		const total = entry.mod.lessons.length;
		const mins = entry.lesson.minutes ? ` · ~${entry.lesson.minutes} min read` : "";
		return el("p", {
			class: "lesson-meta",
			text: `Lesson ${n} of ${total} in ${entry.mod.title}${mins}`,
		});
	}

	function buildLessonNav() {
		const nav = el("nav", { class: "lesson-nav" });
		const prev = idx > 0 ? flat[idx - 1] : null;
		const next = idx < flat.length - 1 ? flat[idx + 1] : null;
		if (prev && !prev.lesson.soon) {
			nav.appendChild(
				el("a", { class: "prev", href: `${toCourseRoot}${prev.href}` }, [
					el("span", { class: "nav-dir", text: `← Previous · ${prev.mod.title}` }),
					el("span", { class: "nav-title", text: prev.lesson.title }),
				]),
			);
		}
		if (next && !next.lesson.soon) {
			nav.appendChild(
				el("a", { class: "next", href: `${toCourseRoot}${next.href}` }, [
					el("span", { class: "nav-dir", text: `Next · ${next.mod.title} →` }),
					el("span", { class: "nav-title", text: next.lesson.title }),
				]),
			);
		}
		return nav;
	}

	function buildFooter() {
		return el("footer", {
			class: "site-footer",
			html:
				`Codebase Academy · a self-contained course on <span class="muted">${course.repo}</span>` +
				` · excerpts © their authors (${course.license})`,
		});
	}

	function wrapLessonPage() {
		const article = document.querySelector("article.lesson");
		if (!article) return;
		const entry = flat[idx];

		const layout = el("div", { class: "layout" });
		const main = el("main");
		layout.appendChild(buildSidebar());
		layout.appendChild(main);

		main.appendChild(buildCrumbs(entry));
		main.appendChild(buildMeta(entry));
		main.appendChild(article);
		main.appendChild(buildLessonNav());
		main.appendChild(buildFooter());

		document.body.appendChild(layout);

		const active = layout.querySelector(".sidebar a.active");
		if (active) active.scrollIntoView({ block: "nearest" });
	}

	function renderSyllabus() {
		const mount = document.getElementById("syllabus");
		if (!mount) return;
		course.modules.forEach((mod, mi) => {
			const section = el("section", { class: "module" });
			section.appendChild(
				el("h2", {}, [
					el("span", { class: "module-num", text: `Module ${mi + 1}` }),
					el("span", { text: mod.title }),
				]),
			);
			if (mod.blurb) section.appendChild(el("p", { class: "module-blurb", text: mod.blurb }));
			const list = el("ol", { class: "lessons" });
			mod.lessons.forEach((lesson, li) => {
				const item = el("li");
				if (lesson.soon) {
					item.appendChild(
						el("a", { href: "#", "aria-disabled": "true" }, [
							el("span", { text: `${li + 1}. ${lesson.title}` }),
							el("span", { class: "mins", text: "coming soon" }),
						]),
					);
				} else {
					item.appendChild(
						el("a", { href: `${mod.dir}/${lesson.file}` }, [
							el("span", { text: `${li + 1}. ${lesson.title}` }),
							el("span", { class: "mins", text: lesson.minutes ? `${lesson.minutes} min` : "" }),
						]),
					);
				}
				list.appendChild(item);
			});
			section.appendChild(list);
			mount.appendChild(section);
		});
	}

	const run = () => {
		if (isLesson) wrapLessonPage();
		renderSyllabus();
		if (window.hljs) window.hljs.highlightAll();
	};

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
	else run();
})();
