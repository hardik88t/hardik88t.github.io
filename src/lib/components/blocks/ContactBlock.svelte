<script lang="ts">
	import { profile } from '$lib/content';
	import { copyText } from '$lib/format';
	import Heading, { type HLevel } from './Heading.svelte';
	import Icon from '../Icon.svelte';

	let { level = 2, compact = false }: { level?: HLevel; compact?: boolean } = $props();

	let copyState = $state<'idle' | 'copied' | 'failed'>('idle');
	let formNote = $state('');
	let name = $state('');
	let senderEmail = $state('');
	let message = $state('');
	let subject = $state('Project enquiry');

	async function copy() {
		const ok = await copyText(profile.email);
		copyState = ok ? 'copied' : 'failed';
		setTimeout(() => (copyState = 'idle'), 2400);
	}

	function draft(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		if (!form.reportValidity()) return;
		const body = [
			message.trim(),
			'',
			`From: ${name.trim()}${senderEmail.trim() ? ` <${senderEmail.trim()}>` : ''}`
		].join('\n');
		const url = `mailto:${profile.email}?subject=${encodeURIComponent(subject.trim() || 'Project enquiry')}&body=${encodeURIComponent(body)}`;
		formNote = 'Your mail app should open with this draft. Nothing is sent from this page.';
		window.location.href = url;
	}

	const subjectId = $derived(`subj-${level}-${compact ? 'c' : 'p'}`);
</script>

<div class="contact" class:compact>
	<Heading {level}>Let's talk about the product</Heading>
	<p class="intro">
		Tell me what you are building, the timeline and what success looks like.
	</p>

	<div class="mail-row">
		<p class="email" aria-label="Email address">{profile.email}</p>
		<div class="mail-actions">
			<button class="btn btn-sm" type="button" onclick={copy}>
				<Icon name="copy" size={15} />
				Copy email
			</button>
			<a class="btn btn-sm" href="mailto:{profile.email}">
				<Icon name="send" size={15} />
				Open in Mail
			</a>
		</div>
		<p class="copy-status" role="status" aria-live="polite">
			{#if copyState === 'copied'}
				Copied to clipboard.
			{:else if copyState === 'failed'}
				Copy was blocked. Select the address and copy it.
			{/if}
		</p>
	</div>

	<ul class="links">
		<li>
			<a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
				<Icon name="linkedin" size={18} />
				<span>LinkedIn</span>
				<span class="sr-only">(opens in a new tab)</span>
				<Icon name="arrow-up-right" size={14} />
			</a>
		</li>
		<li>
			<a href={profile.links.github} target="_blank" rel="noopener noreferrer">
				<Icon name="github" size={18} />
				<span>GitHub</span>
				<span class="sr-only">(opens in a new tab)</span>
				<Icon name="arrow-up-right" size={14} />
			</a>
		</li>
		<li>
			<a href={profile.links.cv} target="_blank" rel="noopener noreferrer">
				<Icon name="file" size={18} />
				<span>CV (PDF)</span>
				<span class="sr-only">(opens in a new tab)</span>
				<Icon name="arrow-up-right" size={14} />
			</a>
		</li>
	</ul>

	<form class="draft" onsubmit={draft} novalidate={false}>
		<p class="draft-title">Or draft a message</p>
		<div class="field">
			<label for="{subjectId}-name">Your name</label>
			<input id="{subjectId}-name" name="name" autocomplete="name" required bind:value={name} />
		</div>
		<div class="field">
			<label for="{subjectId}-email">Your email</label>
			<input id="{subjectId}-email" name="email" type="email" autocomplete="email" bind:value={senderEmail} />
		</div>
		<div class="field">
			<label for="{subjectId}-subject">Subject</label>
			<input id="{subjectId}-subject" name="subject" bind:value={subject} />
		</div>
		<div class="field">
			<label for="{subjectId}-msg">Message</label>
			<textarea id="{subjectId}-msg" name="message" rows="4" required bind:value={message}></textarea>
		</div>
		<div class="form-foot">
			<button class="btn btn-primary" type="submit">Open draft in Mail</button>
			<p class="form-note" role="status" aria-live="polite">{formNote}</p>
		</div>
	</form>
</div>

<style>
	.contact {
		display: grid;
		gap: 16px;
		container-type: inline-size;
	}
	.intro {
		font-size: 15px;
		color: var(--ink-2);
		line-height: 1.6;
		max-width: 56ch;
	}
	.mail-row {
		display: grid;
		gap: 10px;
		padding: 14px;
		border: 1px solid var(--line);
		border-radius: var(--r-md);
		background: var(--win-2);
	}
	.email {
		font-family: var(--font-mono);
		font-size: 15px;
		font-weight: 600;
		overflow-wrap: anywhere;
		user-select: text;
		-webkit-user-select: text;
	}
	.mail-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.copy-status {
		font-size: 13px;
		color: var(--ok);
		min-height: 1.2em;
	}
	.links {
		display: grid;
		gap: 0;
		border: 1px solid var(--line);
		border-radius: var(--r-md);
		overflow: hidden;
		background: var(--win);
	}
	.links li + li {
		border-top: 1px solid var(--line);
	}
	.links a {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr) auto;
		align-items: center;
		gap: 12px;
		min-height: var(--touch);
		padding: 10px 14px;
		color: var(--ink);
		text-decoration: none;
		font-weight: 600;
		font-size: 15px;
	}
	.links a:hover {
		background: var(--win-2);
	}
	.links a :global(svg:last-child) {
		color: var(--ink-3);
	}
	.draft {
		display: grid;
		gap: 12px;
		padding-top: 6px;
	}
	.draft-title {
		font-weight: 700;
		font-size: 14px;
		color: var(--ink-2);
	}
	.field {
		display: grid;
		gap: 6px;
	}
	.field label {
		font-size: 13px;
		font-weight: 600;
		color: var(--ink-2);
	}
	.field input,
	.field textarea {
		width: 100%;
		min-height: var(--touch);
		padding: 10px 12px;
		border-radius: var(--r-sm);
		border: 1px solid var(--win-line);
		background: var(--win);
		font-size: 15px;
		color: var(--ink);
	}
	.field textarea {
		min-height: 110px;
		resize: vertical;
		line-height: 1.5;
	}
	.field input:focus-visible,
	.field textarea:focus-visible {
		outline-offset: 0;
		border-color: var(--focus);
	}
	.form-foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px 14px;
	}
	.form-note {
		font-size: 12.5px;
		color: var(--ink-3);
		max-width: 46ch;
	}
</style>
