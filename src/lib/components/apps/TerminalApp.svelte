<script lang="ts">
	import { onDestroy } from 'svelte';
	import { agentic } from '$lib/content';
	import { complete, run, swarmScript, type Effect, type Line } from '$lib/terminal/engine';
	import { term } from '$lib/terminal/session.svelte';
	import { openApp } from '$lib/state/ui.svelte';

	let { compact = false }: { compact?: boolean } = $props();

	const uid = $props.id();
	let input = $state('');
	let histIdx = $state(-1);
	let logEl = $state<HTMLElement>();
	let inputEl = $state<HTMLInputElement>();
	let timers: ReturnType<typeof setTimeout>[] = [];

	const chips = ['help', 'whoami', 'work', 'agents', 'pipeline', 'services', 'stack', 'contact', 'cv', 'clear'];

	$effect(() => {
		void term.lines.length;
		if (logEl) logEl.scrollTop = logEl.scrollHeight;
	});

	function print(lines: Line[]) {
		if (lines.length) term.lines.push(...lines);
	}

	function apply(effect: Effect | undefined) {
		if (!effect) return;
		if (effect.type === 'clear') {
			term.lines.length = 0;
		} else if (effect.type === 'open') {
			openApp(effect.app, { project: effect.project });
		} else if (effect.type === 'swarm') {
			startSwarm(effect.task);
		}
	}

	function startSwarm(task: string) {
		if (term.busy) return;
		term.busy = true;
		let t = 0;
		const steps = swarmScript(task);
		steps.forEach((step, i) => {
			t += step.delay;
			timers.push(
				setTimeout(() => {
					term.lines.push(step.line);
					if (i === steps.length - 1) term.busy = false;
				}, t)
			);
		});
	}

	function execute(text: string) {
		const clean = text.trim();
		if (term.busy) return;
		if (clean) {
			term.history.push(clean);
			if (term.history.length > 60) term.history.shift();
		}
		histIdx = -1;
		term.lines.push({ kind: 'cmd', text: `$ ${clean}` });
		const res = run(clean);
		if (res.effect?.type === 'clear') {
			term.lines.length = 0;
			return;
		}
		print(res.lines);
		apply(res.effect);
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const text = input;
		input = '';
		execute(text);
	}

	function chip(name: string) {
		if (term.busy) return;
		if (name === 'swarm') {
			execute(`swarm run "${agentic.sampleTasks[0]}"`);
			return;
		}
		execute(name);
		inputEl?.focus();
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			const h = term.history;
			if (!h.length) return;
			histIdx = Math.min(histIdx + 1, h.length - 1);
			input = h[h.length - 1 - histIdx];
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			const h = term.history;
			histIdx = Math.max(histIdx - 1, -1);
			input = histIdx === -1 ? '' : h[h.length - 1 - histIdx];
		} else if (e.key === 'Tab') {
			const next = complete(input);
			if (next !== undefined) {
				e.preventDefault();
				input = next;
			}
		} else if (e.key === 'Escape' && input) {
			e.preventDefault();
			e.stopPropagation();
			input = '';
		} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
			e.preventDefault();
			term.lines.length = 0;
		}
	}

	onDestroy(() => {
		timers.forEach((t) => clearTimeout(t));
		timers = [];
		term.busy = false;
	});

</script>

<div class="term" class:compact>
	<h2 class="sr-only">Terminal</h2>
	<!-- The scrollable log must stay reachable by keyboard, so it takes tab focus. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="log"
		bind:this={logEl}
		role="log"
		aria-label="Terminal output"
		aria-busy={term.busy}
		tabindex="0"
	>
		{#each term.lines as l, i (i)}
			<p class="ln {l.kind}" class:pair={l.sub !== undefined}>
				{#if l.sub !== undefined}
					<span class="k">{l.text}</span>
					<span class="v">
						{#if l.kind === 'link' && l.href}
							<a href={l.href} target="_blank" rel="noopener noreferrer">{l.sub}<span class="sr-only"> (opens in a new tab)</span></a>
						{:else}
							{l.sub}
						{/if}
					</span>
				{:else if l.kind === 'link' && l.href}
					<a href={l.href} target="_blank" rel="noopener noreferrer">{l.text}<span class="sr-only"> (opens in a new tab)</span></a>
				{:else}
					{l.text}
				{/if}
			</p>
		{/each}
		{#if term.busy}
			<p class="ln dim blink" aria-hidden="true">working</p>
		{/if}
	</div>

	{#if compact}
		<div class="chips" role="group" aria-label="Quick commands">
			{#each chips as c (c)}
				<button type="button" class="cmd-chip" disabled={term.busy} onclick={() => chip(c)}>{c}</button>
			{/each}
			<button type="button" class="cmd-chip accent" disabled={term.busy} onclick={() => chip('swarm')}>
				swarm run
			</button>
		</div>
	{/if}

	<form class="prompt" onsubmit={submit} autocomplete="off">
		<label class="sr-only" for="term-{uid}">Command</label>
		<span class="ps1" aria-hidden="true">hardik@hardikos ~ %</span>
		<input
			bind:this={inputEl}
			id="term-{uid}"
			bind:value={input}
			onkeydown={onKey}
			type="text"
			autocapitalize="off"
			autocorrect="off"
			spellcheck="false"
			enterkeyhint="send"
			aria-describedby="term-hint-{uid}"
			disabled={term.busy}
		/>
		<span id="term-hint-{uid}" class="sr-only">Type help for commands. Tab completes. Up and Down recall history.</span>
	</form>
</div>

<style>
	.term {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		background: var(--term-bg);
		color: var(--term-ink);
		font-family: var(--font-mono);
		font-size: 12.5px;
		line-height: 1.6;
		border-radius: 0 0 var(--r-win) var(--r-win);
	}
	.log {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 14px 16px 6px;
		scrollbar-color: var(--term-line) transparent;
	}
	.log:focus-visible {
		outline-offset: -2px;
	}
	.ln {
		margin: 0;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.ln.cmd {
		color: var(--term-accent);
		margin-top: 6px;
	}
	.ln.head {
		color: var(--term-head);
		font-weight: 600;
	}
	.ln.dim {
		color: var(--term-dim);
	}
	.ln.ok {
		color: var(--term-ok);
	}
	.ln.err {
		color: var(--term-err);
	}
	.ln.link a {
		color: var(--term-accent);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.ln.pair {
		display: grid;
		grid-template-columns: minmax(0, 15ch) minmax(0, 1fr);
		column-gap: 14px;
	}
	.ln.pair .k {
		color: var(--term-ink);
		font-weight: 600;
	}
	.ln.pair .v {
		color: var(--term-dim);
	}
	.ln.pair.link .v a {
		color: var(--term-accent);
	}
	.blink {
		animation: blink 1.1s steps(2, start) infinite;
	}
	@keyframes blink {
		to {
			visibility: hidden;
		}
	}
	.prompt {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px 12px;
		border-top: 1px solid var(--term-line);
	}
	.ps1 {
		color: var(--term-ok);
		white-space: nowrap;
		font-size: 12px;
	}
	.prompt input {
		flex: 1;
		min-width: 0;
		background: transparent;
		border: 0;
		color: var(--term-ink);
		font-family: var(--font-mono);
		font-size: 12.5px;
		padding: 6px 0;
		caret-color: var(--term-accent);
	}
	.prompt input:focus-visible {
		outline: none;
	}
	.prompt:focus-within {
		box-shadow: inset 0 2px 0 var(--term-accent);
	}
	.prompt input:disabled {
		opacity: 0.5;
	}
	.chips {
		display: flex;
		gap: 8px;
		padding: 10px 12px;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scrollbar-width: none;
		border-top: 1px solid var(--term-line);
		background: var(--term-chips);
	}
	.chips::-webkit-scrollbar {
		display: none;
	}
	.cmd-chip {
		flex: none;
		min-height: var(--touch);
		padding: 8px 14px;
		border-radius: 999px;
		border: 1px solid var(--term-chip-line);
		background: var(--term-chip);
		color: var(--term-ink);
		font-family: var(--font-mono);
		font-size: 12px;
		white-space: nowrap;
	}
	.cmd-chip.accent {
		color: var(--term-ok);
		border-color: var(--term-chip-ok);
	}
	.cmd-chip:disabled {
		opacity: 0.45;
	}
	.compact .prompt input {
		font-size: 16px;
	}
	@media (prefers-reduced-motion: reduce) {
		.blink {
			animation: none;
		}
	}
</style>
