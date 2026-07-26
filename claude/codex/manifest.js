/* Course manifest — the single source of truth for module ORDER.

   The runtime (assets/js/app.js) builds the landing page, the sticky
   header, and prev/next links from this object. The in-page contents of
   each module is read from that page's own <section> elements, not from
   here; `sections` below exists so the landing page can preview them, and
   scripts/verify.mjs checks the two lists against each other.

   `commit` pins the openai/codex checkout every excerpt was copied from.
   If you re-clone at a newer SHA, expect excerpts to drift. */

window.COURSE = {
	id: "codex",
	title: "Codex: Anatomy of OpenAI's Coding Agent",
	repo: "github.com/openai/codex",
	license: "Apache-2.0",
	commit: "61a44880a85d2fd0d8770908dea5733495e571c8",
	modules: [
		{
			file: "m01-orientation.html",
			num: 1,
			title: "Orientation",
			blurb:
				"What Codex is, the four products built from one binary, how ~100 Rust crates are laid out, and how the project keeps itself honest.",
			sections: [
				"What Codex actually is",
				"A tour of the repository",
				"One binary, many front doors",
				"The layered architecture",
				"How the project keeps itself honest",
			],
		},
		{
			file: "m02-reading-rust.html",
			num: 2,
			title: "Reading Rust When You Know Python",
			blurb:
				"Just enough Rust to read every excerpt in this course: structs and enums, ownership, Result and ?, traits, and async/tokio.",
			sections: [
				"Structs, enums, and the compiler as pair programmer",
				"Ownership and borrowing",
				"Result, Option, and the ? operator",
				"Traits and generics",
				"async, tokio, and channels",
			],
		},
		{
			file: "m03-trace.html",
			num: 3,
			title: "One Message Through the System",
			blurb:
				"You type a prompt; Codex reads a file and runs a command. This module follows that single message through every layer — the map for everything after it.",
			sections: [
				"You press Enter",
				"From argv to a Config",
				"A thread is born",
				"Building the turn",
				"Talking to the model",
				"The model asks to run a command",
				"The paper trail",
			],
		},
		{
			file: "m04-protocol.html",
			num: 4,
			title: "protocol/ — The Shared Vocabulary",
			blurb:
				"The types every other crate speaks: submissions, events, and the item model that describes everything a turn produces.",
			sections: [
				"Op and Event: the submission queue",
				"The item model",
				"Turns, threads, and their states",
				"app-server-protocol: the JSON-RPC dialect",
				"Why a protocol crate exists",
			],
		},
		{
			file: "m05-core-session.html",
			num: 5,
			title: "core/ — Session, Thread, and Turn",
			blurb:
				"The 180,000-line heart of Codex: how a thread is managed, how a turn runs, and what the model is actually shown.",
			sections: [
				"Mapping a crate this big",
				"ThreadManager: threads and their lifetimes",
				"CodexThread: the submission loop",
				"The turn task",
				"The context manager",
				"Compaction: forgetting gracefully",
			],
		},
		{
			file: "m06-model-client.html",
			num: 6,
			title: "core/ — Talking to the Model",
			blurb:
				"Where the abstraction meets the network: the Responses API request, SSE streaming, providers, retries, and authentication.",
			sections: [
				"Building the request",
				"Streaming: SSE to events",
				"Providers: OpenAI, Ollama, LM Studio",
				"Retries, rate limits, and errors",
				"Auth: ChatGPT sign-in vs API key",
			],
		},
		{
			file: "m07-tools.html",
			num: 7,
			title: "Tools — Giving the Model Hands",
			blurb:
				"The tools that let a language model touch your filesystem and shell, how they are declared to the model, and how results come back.",
			sections: [
				"The tool registry",
				"The shell tool",
				"apply_patch: the edit format",
				"Reading, planning, searching",
				"MCP tools as first-class tools",
				"Anatomy of a tool definition",
			],
		},
		{
			file: "m08-sandboxing.html",
			num: 8,
			title: "Sandboxing & Safety",
			blurb:
				"The most distinctive part of Codex: deciding whether a command is safe, then running it inside an OS-level cage on three platforms.",
			sections: [
				"The threat model and approval modes",
				"The safety decision",
				"execpolicy: a language for judging commands",
				"macOS: Seatbelt",
				"Linux: Landlock, seccomp, and bwrap",
				"Windows and the network proxy",
			],
		},
		{
			file: "m09-tui.html",
			num: 9,
			title: "tui/ — The Terminal Interface",
			blurb:
				"The largest crate in the repo. A full application built on ratatui: an event loop, a chat transcript, a text composer, and approval dialogs.",
			sections: [
				"ratatui and the app shell",
				"The event loop",
				"The chat transcript",
				"The composer",
				"Approvals and diffs",
				"Slash commands, themes, onboarding",
			],
		},
		{
			file: "m10-front-doors.html",
			num: 10,
			title: "The Other Front Doors",
			blurb:
				"The same core, driven by something other than a human at a terminal: scripts, IDEs, the desktop app, MCP clients, and two SDKs.",
			sections: [
				"codex exec: the non-interactive mode",
				"app-server: the JSON-RPC daemon",
				"Codex as an MCP server",
				"Codex as an MCP client",
				"The Python and TypeScript SDKs",
				"Codex Cloud",
			],
		},
		{
			file: "m11-state-config.html",
			num: 11,
			title: "State, Config & Extension",
			blurb:
				"How conversations persist, how configuration is layered, and the five separate ways the project lets you extend it without forking.",
			sections: [
				"config: layers, profiles, overrides",
				"Rollouts: how conversations persist",
				"AGENTS.md and project context",
				"Skills and prompts",
				"Hooks and plugins",
				"Memories, telemetry, analytics",
			],
		},
		{
			file: "m12-appendix.html",
			num: 12,
			title: "Appendix — The Whole Map",
			blurb:
				"Every crate in one table, how to build and debug Codex locally, and where to go next.",
			sections: [
				"The complete crate map",
				"Building, running, and debugging",
				"Where to go from here",
			],
		},
	],
};
