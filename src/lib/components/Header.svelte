<script lang="ts">
	import { content } from '$lib/content';

	const { person } = content;

	const links = [
		{ href: '#offers', label: 'Offers' },
		{ href: '#process', label: 'Process' },
		{ href: '#faq', label: 'FAQ' }
	];

	let menuOpen = $state(false);
	let menuButton: HTMLButtonElement | undefined = $state();

	function closeMenu(restoreFocus = false) {
		menuOpen = false;
		if (restoreFocus) menuButton?.focus();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && menuOpen) closeMenu(true);
	}
</script>

<svelte:window onkeydown={onKeydown} />

<header class="site-header" id="top">
	<div class="wrap bar">
		<a class="brand" href="#top" aria-label="{person.name}, back to top" onclick={() => closeMenu()}>
			<span class="mark" aria-hidden="true">{person.monogram}</span>
			<span class="brand-name">{person.name}</span>
		</a>

		<nav class="nav" aria-label="Sections">
			{#each links as link (link.href)}
				<a href={link.href}>{link.label}</a>
			{/each}
		</nav>

		<div class="actions">
			<a class="btn btn-primary btn-sm" href="#contact">Book a call</a>
			<button
				class="menu-toggle"
				type="button"
				aria-expanded={menuOpen}
				aria-controls="mobile-menu"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				bind:this={menuButton}
				onclick={() => (menuOpen = !menuOpen)}
			>
				<span class="bars" aria-hidden="true"><span></span><span></span></span>
			</button>
		</div>
	</div>

	<div id="mobile-menu" class="sheet" hidden={!menuOpen}>
		<nav aria-label="Sections, mobile">
			{#each links as link (link.href)}
				<a href={link.href} onclick={() => closeMenu()}>{link.label}</a>
			{/each}
			<a href="#contact" onclick={() => closeMenu()}>Contact</a>
		</nav>
	</div>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 30;
		background: rgb(255 255 255 / 0.94);
		-webkit-backdrop-filter: saturate(1.1) blur(10px);
		backdrop-filter: saturate(1.1) blur(10px);
		border-bottom: 1px solid var(--line);
	}

	.bar {
		height: var(--header-h);
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		text-decoration: none;
		color: var(--ink);
		border-radius: 10px;
	}

	.mark {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: var(--ink);
		color: #ffffff;
		display: grid;
		place-items: center;
		font: 700 0.8rem/1 var(--font-sans);
		letter-spacing: 0.02em;
		flex: none;
	}

	.brand-name {
		font-weight: 700;
		font-size: 1rem;
		letter-spacing: -0.01em;
		white-space: nowrap;
	}

	.nav {
		display: none;
	}

	.actions {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.menu-toggle {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		border: 1px solid var(--line-strong);
		background: #ffffff;
		display: grid;
		place-items: center;
		cursor: pointer;
		padding: 0;
	}

	.bars {
		display: grid;
		gap: 5px;
		width: 18px;
	}

	.bars span {
		display: block;
		height: 2px;
		border-radius: 2px;
		background: var(--ink);
		transition:
			transform 0.2s ease,
			opacity 0.2s ease;
	}

	.menu-toggle[aria-expanded='true'] .bars span:first-child {
		transform: translateY(3.5px) rotate(45deg);
	}

	.menu-toggle[aria-expanded='true'] .bars span:last-child {
		transform: translateY(-3.5px) rotate(-45deg);
	}

	.sheet {
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		background: #ffffff;
		border-bottom: 1px solid var(--line);
		box-shadow: 0 18px 32px -28px rgb(17 19 26 / 0.35);
		padding: 4px 20px 16px;
		animation: sheet-in 0.2s ease-out;
	}

	.sheet nav {
		display: grid;
	}

	.sheet a {
		display: flex;
		align-items: center;
		min-height: 54px;
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--ink);
		text-decoration: none;
		border-bottom: 1px solid var(--line);
	}

	.sheet a:last-child {
		border-bottom: 0;
	}

	@keyframes sheet-in {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@media (max-width: 419px) {
		.brand-name {
			display: none;
		}
	}

	@media (min-width: 900px) {
		.nav {
			display: flex;
			gap: 30px;
			margin-left: auto;
			margin-right: 20px;
		}

		.nav a {
			padding: 10px 0;
			font-size: 0.95rem;
			color: var(--ink-2);
			text-decoration: none;
		}

		.nav a:hover {
			color: var(--ink);
		}

		.actions {
			margin-left: 0;
		}

		.menu-toggle,
		.sheet {
			display: none !important;
		}
	}
</style>
