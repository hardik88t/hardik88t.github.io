<script lang="ts">
	import { content } from '$lib/content';
	import { revealOnScroll } from '$lib/reveal';

	let { offerId = $bindable('') }: { offerId?: string } = $props();

	const { person, studio } = content;
	const offers = studio.offers;

	let name = $state('');
	let email = $state('');
	let message = $state('');

	let copied = $state(false);
	let copyStatus = $state('');
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	/** Opens a draft in the visitor's own email app. Never claims the message was sent. */
	function openDraft(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		if (!form.reportValidity()) return;

		const offer = offers.find((o) => o.id === offerId);
		const subject = offer ? `Project enquiry: ${offer.name}` : 'Project enquiry';
		const body = [
			`Name: ${name.trim()}`,
			`Email: ${email.trim()}`,
			`Offer: ${offer ? offer.name : 'Not sure yet'}`,
			'',
			message.trim()
		].join('\n');

		window.location.href = `mailto:${person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	}

	async function copyEmail() {
		let ok = false;
		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(person.email);
				ok = true;
			}
		} catch {
			ok = false;
		}

		if (!ok) {
			try {
				const field = document.createElement('textarea');
				field.value = person.email;
				field.setAttribute('readonly', '');
				field.style.position = 'fixed';
				field.style.opacity = '0';
				document.body.appendChild(field);
				field.select();
				ok = document.execCommand('copy');
				field.remove();
			} catch {
				ok = false;
			}
		}

		copied = ok;
		copyStatus = ok ? 'Email address copied.' : 'Copy failed. Select the address and copy it.';
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => {
			copied = false;
			copyStatus = '';
		}, 2400);
	}
</script>

<section id="contact" class="section" aria-labelledby="contact-title" use:revealOnScroll>
	<div class="wrap contact">
		<header class="section-head head">
			<p class="label">Contact</p>
			<h2 id="contact-title">Book a free call</h2>
			<p class="lede">
				Thirty minutes to talk through the problem. A few lines below is enough to start.
			</p>
		</header>

		<form class="form" onsubmit={openDraft} aria-describedby="form-help">
			<div class="field">
				<label for="c-name">Name</label>
				<input id="c-name" name="name" type="text" autocomplete="name" required bind:value={name} />
			</div>

			<div class="field">
				<label for="c-email">Email</label>
				<input
					id="c-email"
					name="email"
					type="email"
					autocomplete="email"
					inputmode="email"
					required
					bind:value={email}
				/>
			</div>

			<div class="field">
				<label for="c-offer">Which offer</label>
				<select id="c-offer" name="offer" bind:value={offerId}>
					<option value="">Not sure yet</option>
					{#each offers as offer (offer.id)}
						<option value={offer.id}>{offer.name}</option>
					{/each}
				</select>
			</div>

			<div class="field">
				<label for="c-message">Message</label>
				<textarea
					id="c-message"
					name="message"
					rows="4"
					placeholder="The problem, who uses it, and when you need it."
					bind:value={message}
				></textarea>
			</div>

			<button class="btn btn-primary btn-block" type="submit">Open email draft</button>
			<p id="form-help" class="help">
				Opens a draft in your email app. Nothing is sent from this page.
			</p>
		</form>

		<div class="direct">
			<p class="label">Email</p>
			<div class="email-row">
				<a class="email" href="mailto:{person.email}">{person.email}</a>
				<button class="btn btn-ghost btn-sm" type="button" onclick={copyEmail}>
					{copied ? 'Copied' : 'Copy email'}
				</button>
			</div>
			<p class="copy-status" role="status" aria-live="polite">{copyStatus}</p>

			<ul class="links" aria-label="Profiles">
				<li>
					<a href={person.links.linkedin} target="_blank" rel="noopener noreferrer">
						LinkedIn<span class="sr-only"> (opens in a new tab)</span><span aria-hidden="true">&nearr;</span>
					</a>
				</li>
				<li>
					<a href={person.links.github} target="_blank" rel="noopener noreferrer">
						GitHub<span class="sr-only"> (opens in a new tab)</span><span aria-hidden="true">&nearr;</span>
					</a>
				</li>
			</ul>

			<p class="avail">
				<span class="status-dot" aria-hidden="true"></span>
				{person.availability}
			</p>
		</div>
	</div>
</section>

<style>
	.contact {
		display: grid;
		gap: 34px;
	}

	.head {
		margin-bottom: 0;
	}

	.form {
		display: grid;
		gap: 16px;
		padding: 22px 18px 18px;
		border: 1px solid var(--line);
		border-radius: var(--radius-l);
		background: #ffffff;
	}

	.field {
		display: grid;
		gap: 8px;
	}

	label {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--ink);
	}

	input,
	select,
	textarea {
		width: 100%;
		min-height: 50px;
		padding: 12px 14px;
		border: 1.5px solid var(--line-strong);
		border-radius: 12px;
		background: #ffffff;
		color: var(--ink);
		font: 400 1rem/1.4 var(--font-sans);
		-webkit-appearance: none;
		appearance: none;
	}

	select {
		background-image: linear-gradient(45deg, transparent 50%, var(--ink) 50%),
			linear-gradient(135deg, var(--ink) 50%, transparent 50%);
		background-position:
			calc(100% - 20px) 52%,
			calc(100% - 14px) 52%;
		background-size:
			6px 6px,
			6px 6px;
		background-repeat: no-repeat;
		padding-right: 40px;
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	input::placeholder,
	textarea::placeholder {
		color: #6b7180;
	}

	input:focus-visible,
	select:focus-visible,
	textarea:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
		border-color: var(--accent);
	}

	.help {
		font-size: 1rem;
		color: var(--ink-2);
		text-align: center;
	}

	.direct {
		display: grid;
		gap: 14px;
		align-content: start;
	}

	.email-row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px 14px;
	}

	.email {
		font-size: 1.1875rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--ink);
		word-break: break-all;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}

	.copy-status {
		min-height: 1.2em;
		font-size: 1rem;
		color: var(--ink-2);
		margin-top: -6px;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 22px;
	}

	.links a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		font-weight: 600;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 4px;
	}

	.avail {
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--ink-2);
		font-size: 1rem;
	}

	.status-dot {
		flex: none;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent);
	}

	@media (min-width: 900px) {
		.contact {
			grid-template-columns: 1fr 1.05fr;
			column-gap: 96px;
			row-gap: 40px;
			align-items: start;
		}

		.head {
			grid-column: 1;
			grid-row: 1;
		}

		.direct {
			grid-column: 1;
			grid-row: 2;
			padding-top: 8px;
		}

		.form {
			grid-column: 2;
			grid-row: 1 / span 2;
			padding: 32px 32px 26px;
		}
	}
</style>
