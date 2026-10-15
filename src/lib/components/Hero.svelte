<script lang="ts">
	import { content } from '$lib/content';

	let {
		selected = '',
		onChoose
	}: {
		selected?: string;
		onChoose: (id: string) => void;
	} = $props();

	const { person, headlines, studio } = content;

	// Four needs, each mapped to one offer id in content-v2.json.
	const choices = [
		{ id: 'launch', label: 'A new web app' },
		{ id: 'mobile', label: 'A mobile app' },
		{ id: 'ai', label: 'AI in my product' },
		{ id: 'system', label: 'A design system' }
	];

	const offerFor = (id: string) => studio.offers.find((o) => o.id === id);

	function lowerFirst(text: string) {
		return text.charAt(0).toLowerCase() + text.slice(1);
	}

	const current = $derived(offerFor(selected));
</script>

<section class="hero" aria-labelledby="hero-title">
	<div class="wrap hero-grid">
		<div class="hero-copy">
			<p class="eyebrow">
				{person.name} <span aria-hidden="true">·</span> {person.title}
			</p>
			<h1 id="hero-title">{headlines.studio}</h1>
			<p class="promise">{headlines.promise}</p>
			<div class="ctas">
				<a class="btn btn-primary" href="#contact">Book a free call</a>
				<a class="btn btn-ghost" href="#offers">See offers</a>
			</div>
		</div>

		<div class="picker">
			<fieldset class="need">
				<legend>What do you need?</legend>
				{#each choices as choice (choice.id)}
					{@const offer = offerFor(choice.id)}
					<label class="choice" class:is-on={selected === choice.id}>
						<input
							type="radio"
							name="need"
							value={choice.id}
							checked={selected === choice.id}
							onchange={() => onChoose(choice.id)}
						/>
						<span class="ring" aria-hidden="true"></span>
						<span class="choice-copy">
							<span class="choice-text">{choice.label}</span>
							{#if offer}
								<span class="choice-meta">{offer.timeline}</span>
							{/if}
						</span>
					</label>
				{/each}
			</fieldset>

			<p class="readout" aria-live="polite">
				{#if current}
					<strong>{current.name}</strong> is for {lowerFirst(current.for)}.
				{:else}
					Choose one to jump to the matching offer.
				{/if}
			</p>
		</div>
	</div>
</section>

<style>
	.hero {
		padding-block: 28px 44px;
	}

	.hero-grid {
		display: grid;
		gap: 44px;
		align-items: start;
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink-2);
		margin-bottom: 20px;
	}

	h1 {
		margin-bottom: 22px;
		max-width: 14ch;
	}

	.promise {
		font-size: 1.1875rem;
		line-height: 1.4;
		color: var(--ink-2);
		max-width: 30ch;
		margin-bottom: 30px;
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.ctas .btn {
		flex: 1 1 auto;
	}

	.picker {
		border: 1px solid var(--line);
		border-radius: var(--radius-l);
		padding: 22px 18px 16px;
		background: #ffffff;
	}

	.need {
		border: 0;
		margin: 0;
		padding: 0;
		min-width: 0;
		display: grid;
		gap: 8px;
	}

	legend {
		font-size: 1.0625rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--ink);
		padding: 0;
		margin-bottom: 12px;
	}

	.choice {
		position: relative;
		display: flex;
		align-items: center;
		gap: 14px;
		min-height: 56px;
		padding: 0 14px;
		border: 1px solid var(--line);
		border-radius: var(--radius-m);
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.choice:hover {
		border-color: var(--line-strong);
	}

	.choice.is-on {
		background: var(--tint);
		border-color: var(--accent);
	}

	.choice input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
		margin: 0;
		pointer-events: none;
	}

	.choice:has(input:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.ring {
		flex: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1.5px solid var(--line-strong);
		display: grid;
		place-items: center;
		transition: border-color 0.2s ease;
	}

	.ring::after {
		content: '';
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--accent);
		transform: scale(0);
		transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.3, 1.2);
	}

	.choice.is-on .ring {
		border-color: var(--accent);
	}

	.choice.is-on .ring::after {
		transform: scale(1);
	}

	.choice-text {
		font-size: 1.0625rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--ink);
	}

	.choice-copy {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
		padding-block: 10px;
	}

	.choice-meta {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--ink-2);
	}

	.readout {
		margin-top: 14px;
		min-height: 3em;
		padding: 0 4px;
		font-size: 1rem;
		color: var(--ink-2);
	}

	.readout strong {
		color: var(--ink);
	}

	@media (min-width: 900px) {
		.hero {
			padding-block: 84px 110px;
		}

		.hero-grid {
			grid-template-columns: 1.2fr 0.8fr;
			gap: 80px;
			align-items: center;
		}

		.picker {
			padding: 28px 28px 22px;
		}

		.ctas .btn {
			flex: 0 0 auto;
		}

		.choice-text {
			font-size: 1.125rem;
		}

		.choice-copy {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			padding-block: 0;
		}

		.choice-meta {
			text-align: right;
		}
	}
</style>
