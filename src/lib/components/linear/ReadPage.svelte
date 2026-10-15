<script lang="ts">
	import { agentic, content, profile } from '$lib/content';
	import { setView } from '$lib/state/ui.svelte';
	import About from '../blocks/About.svelte';
	import ContactBlock from '../blocks/ContactBlock.svelte';
	import Experience from '../blocks/Experience.svelte';
	import Hero from '../blocks/Hero.svelte';
	import Services from '../blocks/Services.svelte';
	import Stack from '../blocks/Stack.svelte';
	import Workflow from '../blocks/Workflow.svelte';
	import WorkList from '../blocks/WorkList.svelte';
	import Monogram from '../Monogram.svelte';
</script>

<div class="read-page">
	<header class="page-top">
		<a class="brand" href="#top">
			<Monogram size={30} label={false} />
			<span>{profile.name}</span>
		</a>
		<nav class="page-nav" aria-label="On this page">
			<ul>
				<li><a href="#workflow">Workflow</a></li>
				<li><a href="#work">Work</a></li>
				<li><a href="#services">Services</a></li>
				<li><a href="#stack">Stack</a></li>
				<li><a href="#experience">Experience</a></li>
				<li><a href="#contact">Contact</a></li>
			</ul>
		</nav>
		<button class="btn btn-sm" type="button" onclick={() => setView('os')}>Open HardikOS</button>
	</header>

	<main id="main" class="page-main">
		<Hero variant="page" />

		<section class="sec" id="about" aria-labelledby="about-h">
			<p class="sec-kicker eyebrow">00 · About</p>
			<h2 id="about-h" class="sec-title">About Hardik</h2>
			<About level={2} showId={false} />
		</section>

		<section class="sec" id="workflow" aria-labelledby="workflow-h">
			<p class="sec-kicker eyebrow">01 · Process</p>
			<h2 id="workflow-h" class="sec-title">{agentic.title}</h2>
			<Workflow level={2} />
		</section>

		<section class="sec" id="work" aria-labelledby="work-h">
			<p class="sec-kicker eyebrow">02 · Projects</p>
			<h2 id="work-h" class="sec-title">Selected work</h2>
			<p class="sec-intro">Each project is a card. Open one to read the full description, stack and highlights.</p>
			<WorkList />
		</section>

		<section class="sec" id="services" aria-labelledby="services-h">
			<p class="sec-kicker eyebrow">03 · Services</p>
			<h2 id="services-h" class="sec-title">Services for clients</h2>
			<Services level={2} cta="page" />
		</section>

		<section class="sec" id="stack" aria-labelledby="stack-h">
			<p class="sec-kicker eyebrow">04 · Skills</p>
			<h2 id="stack-h" class="sec-title">Stack and skills</h2>
			<Stack level={2} />
		</section>

		<section class="sec" id="experience" aria-labelledby="experience-h">
			<p class="sec-kicker eyebrow">05 · Background</p>
			<h2 id="experience-h" class="sec-title">Experience</h2>
			<Experience level={2} />
		</section>

		<section class="sec" id="contact" aria-labelledby="contact-h">
			<p class="sec-kicker eyebrow">06 · Contact</p>
			<ContactBlock level={2} />
		</section>
	</main>

	<footer class="page-foot">
		<div class="page-foot-in">
			<p>{content.footer}</p>
			<a href="#top">Back to top</a>
		</div>
	</footer>
</div>

<style>
	.read-page {
		min-height: 100vh;
		min-height: 100dvh;
		background: var(--desk);
	}
	.page-top {
		position: sticky;
		top: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 10px var(--gutter);
		background: color-mix(in srgb, var(--desk) 86%, transparent);
		backdrop-filter: saturate(160%) blur(16px);
		-webkit-backdrop-filter: saturate(160%) blur(16px);
		border-bottom: 1px solid var(--line);
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: var(--touch);
		color: var(--ink);
		font-weight: 700;
		text-decoration: none;
		font-size: 15px;
	}
	.page-nav ul {
		display: none;
		gap: 4px;
	}
	.page-nav li {
		display: contents;
	}
	.page-nav a {
		display: inline-flex;
		align-items: center;
		min-height: var(--touch);
		padding: 0 10px;
		border-radius: 999px;
		color: var(--ink-2);
		text-decoration: none;
		font-size: 14px;
		font-weight: 550;
	}
	.page-nav a:hover {
		background: var(--chip);
		color: var(--ink);
	}
	.page-main {
		max-width: 1080px;
		margin: 0 auto;
		padding: 40px var(--gutter) 24px;
		display: grid;
		gap: 0;
	}
	.sec {
		padding: 56px 0 8px;
		border-top: 1px solid var(--line);
		scroll-margin-top: 72px;
		display: grid;
		gap: 16px;
		align-content: start;
	}
	.sec:first-of-type {
		border-top: 0;
	}
	.sec-kicker {
		color: var(--accent-ink);
	}
	.sec-title {
		font-size: clamp(1.7rem, 3.6vw, 2.5rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.1;
		max-width: 22ch;
		text-wrap: balance;
	}
	.sec-intro {
		color: var(--ink-2);
		font-size: 15.5px;
		max-width: 60ch;
	}
	.page-foot {
		border-top: 1px solid var(--line);
		color: var(--ink-3);
		font-size: 14px;
	}
	.page-foot-in {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 10px 20px;
		padding: 28px var(--gutter) 40px;
		max-width: 1080px;
		margin: 0 auto;
	}
	.page-foot a {
		color: var(--accent-ink);
		font-weight: 600;
		min-height: var(--touch);
		display: inline-flex;
		align-items: center;
	}
	@media (min-width: 760px) {
		.page-nav ul {
			display: flex;
		}
	}
	@media (min-width: 1024px) {
		.page-main {
			padding-top: 56px;
		}
		.sec {
			padding-top: 72px;
		}
	}
</style>
