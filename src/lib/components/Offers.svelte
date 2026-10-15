<script lang="ts">
	import { untrack } from 'svelte';
	import { content, exampleName, projectFor } from '$lib/content';
	import { revealOnScroll } from '$lib/reveal';
	import Mock from './Mock.svelte';

	type PickRequest = { id: string; n: number };

	let {
		offerId = $bindable(''),
		request
	}: {
		offerId?: string;
		request: PickRequest;
	} = $props();

	const { offers, retainer } = content.studio;

	let root: HTMLElement | undefined = $state();
	let track: HTMLUListElement | undefined = $state();
	let active = $state(0);
	let flashId = $state('');
	let flashTimer: ReturnType<typeof setTimeout> | undefined;

	const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const isCarousel = () => window.matchMedia('(max-width: 759px)').matches;
	const behavior = (): ScrollBehavior => (reduced() ? 'auto' : 'smooth');

	/** Scroll to an offer and flash it. Called when a need is picked in the hero. */
	function focusOffer(id: string) {
		if (!track || !root) return;
		const index = offers.findIndex((o) => o.id === id);
		const ticket = track.children[index] as HTMLElement | undefined;
		if (index < 0 || !ticket) return;

		if (isCarousel()) {
			root.scrollIntoView({ behavior: behavior(), block: 'start' });
			const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
			track.scrollTo({ left: ticket.offsetLeft - pad, behavior: behavior() });
		} else {
			ticket.scrollIntoView({ behavior: behavior(), block: 'center' });
		}

		flashId = id;
		clearTimeout(flashTimer);
		flashTimer = setTimeout(() => (flashId = ''), 1300);
	}

	$effect(() => {
		const { id, n } = request;
		if (n === 0) return;
		untrack(() => focusOffer(id));
	});

	function step(): number {
		if (!track || track.children.length < 2) return 0;
		const first = track.children[0] as HTMLElement;
		const second = track.children[1] as HTMLElement;
		return second.offsetLeft - first.offsetLeft;
	}

	function onTrackScroll() {
		const s = step();
		if (!track || s <= 0) return;
		active = Math.max(0, Math.min(offers.length - 1, Math.round(track.scrollLeft / s)));
	}

	function goTo(index: number) {
		if (!track) return;
		const ticket = track.children[index] as HTMLElement | undefined;
		if (!ticket) return;
		const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
		track.scrollTo({ left: ticket.offsetLeft - pad, behavior: behavior() });
	}
</script>

<section id="offers" class="section" aria-labelledby="offers-title" bind:this={root} use:revealOnScroll>
	<div class="wrap">
		<header class="section-head">
			<p class="label">Offers</p>
			<h2 id="offers-title">Four ways to work together</h2>
			<p class="lede">
				Each one has a fixed scope and price, agreed after a free call. Not sure which fits? Ask, and I'll
				suggest one.
			</p>
		</header>

		<ul class="tickets" bind:this={track} onscroll={onTrackScroll}>
			{#each offers as offer (offer.id)}
				{@const example = projectFor(offer.example)}
				<li
					id="offer-{offer.id}"
					class="ticket"
					class:is-on={offerId === offer.id}
					class:is-flash={flashId === offer.id}
				>
					<div class="ticket-head">
						<h3>{offer.name}</h3>
						<span class="timeline">{offer.timeline}</span>
					</div>

					<p class="what">{offer.what}</p>

					<div class="for">
						<p class="label">For</p>
						<p>{offer.for}</p>
					</div>

					<ul class="includes">
						{#each offer.includes as item (item)}
							<li>
								<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
									<path
										d="M4 9.5l3.2 3L14 5.5"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<span>{item}</span>
							</li>
						{/each}
					</ul>

					<div class="cta-row">
						<a class="ask" href="#contact" onclick={() => (offerId = offer.id)}>
							Ask about {offer.name}<span aria-hidden="true">&rarr;</span>
						</a>
					</div>

					<div class="perf" aria-hidden="true">
						<span class="notch l"></span>
						<span class="notch r"></span>
					</div>

					{#if example}
						<div class="example">
							<Mock slug={example.slug} accent={example.accent} />
							<div class="example-meta">
								<p class="label">Example</p>
								<p class="example-title">{exampleName(example)}</p>
								<p class="example-type">{example.type}</p>
							</div>
							<p class="example-line">{example.oneLiner}</p>
						</div>
					{/if}
				</li>
			{/each}
		</ul>

		<div class="dots" role="group" aria-label="Choose an offer to view">
			{#each offers as offer, i (offer.id)}
				<button
					type="button"
					class="dot"
					class:is-active={active === i}
					aria-label="Show {offer.name}"
					aria-current={active === i ? 'true' : undefined}
					onclick={() => goTo(i)}
				>
					<span></span>
				</button>
			{/each}
		</div>

		<div class="retainer">
			<div>
				<p class="label">Also available</p>
				<h3>{retainer.name}</h3>
			</div>
			<p>{retainer.what}</p>
		</div>
	</div>
</section>

<style>
	/* Phones: a snap carousel with a visible peek of the next ticket. */
	.tickets {
		position: relative;
		display: flex;
		gap: 14px;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: 20px;
		padding: 6px 20px 8px;
		margin-inline: -20px;
		scrollbar-width: none;
	}

	.tickets::-webkit-scrollbar {
		display: none;
	}

	.tickets > li {
		flex: 0 0 calc(100% - 28px);
		scroll-snap-align: start;
	}

	.ticket {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 22px 20px 18px;
		background: #ffffff;
		border: 1px solid var(--line);
		border-radius: var(--radius-l);
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.ticket.is-on {
		border-color: var(--accent);
		box-shadow: 0 0 0 4px var(--tint);
	}

	.ticket.is-flash {
		animation: pulse 1.2s ease-out;
	}

	@keyframes pulse {
		from {
			box-shadow: 0 0 0 0 rgb(43 75 255 / 0.35);
		}
		to {
			box-shadow: 0 0 0 16px rgb(43 75 255 / 0);
		}
	}

	.ticket-head {
		display: grid;
		justify-items: start;
		gap: 12px;
	}

	.ticket h3 {
		font-size: 1.75rem;
		line-height: 1.05;
		letter-spacing: -0.035em;
	}

	.timeline {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		line-height: 1;
		color: var(--accent);
		background: var(--tint);
		padding: 8px 11px;
		border-radius: 999px;
		white-space: nowrap;
	}

	.what {
		margin-top: 16px;
		font-size: 1.125rem;
		line-height: 1.4;
		font-weight: 500;
		letter-spacing: -0.01em;
	}

	.for {
		margin-top: 14px;
		display: grid;
		gap: 4px;
	}

	.for p:not(.label) {
		color: var(--ink-2);
		font-size: 1rem;
	}

	.includes {
		margin-top: 16px;
		display: grid;
		gap: 9px;
	}

	.includes li {
		display: grid;
		grid-template-columns: 18px 1fr;
		gap: 10px;
		align-items: start;
		font-size: 1rem;
		line-height: 1.4;
	}

	.includes svg {
		color: var(--accent);
		margin-top: 2px;
	}

	.cta-row {
		margin-top: auto;
		padding-top: 16px;
	}

	.ask {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		color: var(--accent);
		font-weight: 600;
		text-decoration: none;
	}

	.ask span {
		transition: transform 0.2s ease;
	}

	.ask:hover span {
		transform: translateX(3px);
	}

	/* Perforated edge: dashed line with notches cut into both sides. */
	.perf {
		position: relative;
		height: 0;
		margin: 14px -20px 18px;
	}

	.perf::before {
		content: '';
		position: absolute;
		left: 16px;
		right: 16px;
		top: 0;
		border-top: 2px dashed var(--line);
	}

	.notch {
		position: absolute;
		top: -12px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #ffffff;
	}

	.notch.l {
		left: -12px;
	}

	.notch.r {
		right: -12px;
	}

	.example {
		display: grid;
		grid-template-columns: 96px 1fr;
		gap: 14px 16px;
		align-items: start;
	}

	.example-meta {
		display: grid;
		gap: 6px;
		align-content: start;
		min-width: 0;
	}

	.example-title {
		font-weight: 700;
		font-size: 1.0625rem;
		line-height: 1.25;
		letter-spacing: -0.01em;
	}

	.example-type {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--ink-2);
	}

	.example-line {
		grid-column: 1 / -1;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--ink-2);
	}

	.dots {
		display: flex;
		justify-content: center;
		margin-top: 2px;
	}

	.dot {
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		display: grid;
		place-items: center;
		cursor: pointer;
	}

	.dot span {
		width: 8px;
		height: 8px;
		border-radius: 4px;
		background: var(--line-strong);
		transition:
			width 0.25s ease,
			background-color 0.25s ease;
	}

	.dot.is-active span {
		width: 24px;
		background: var(--accent);
	}

	.retainer {
		margin-top: 24px;
		display: grid;
		gap: 10px;
		padding: 18px 0;
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
	}

	.retainer p:not(.label) {
		color: var(--ink-2);
	}

	.retainer h3 {
		margin-top: 6px;
		font-size: 1.25rem;
	}

	@media (min-width: 760px) {
		.tickets {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 24px;
			overflow: visible;
			margin-inline: 0;
			padding: 0;
			scroll-snap-type: none;
		}

		.tickets > li {
			flex: none;
		}

		.ticket {
			padding: 30px 30px 24px;
		}

		.ticket h3 {
			font-size: 1.75rem;
		}

		@media (min-width: 1180px) {
			.ticket h3 {
				font-size: 2rem;
			}
		}

		.perf {
			margin: 18px -30px 24px;
		}

		/* Same stub height across a row, so the perforations line up. 184px fits the longest stub. */
		.example {
			height: 184px;
			align-content: start;
		}

		.dots {
			display: none;
		}

		.retainer {
			grid-template-columns: 1fr 1.4fr;
			align-items: center;
			gap: 32px;
			margin-top: 40px;
			padding: 28px 0;
		}
	}

	@media (min-width: 760px) {
		.retainer {
			gap: 32px;
		}
	}
</style>
