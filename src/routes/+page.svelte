<script lang="ts">
	import Contact from '$lib/components/Contact.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Offers from '$lib/components/Offers.svelte';
	import Principles from '$lib/components/Principles.svelte';
	import Process from '$lib/components/Process.svelte';

	let offerId = $state('');
	// A new object on every pick, so the offers section scrolls even when the same need is chosen twice.
	let request = $state({ id: '', n: 0 });

	function choose(id: string) {
		offerId = id;
		request = { id, n: request.n + 1 };
	}
</script>

<svelte:head>
	<title>Hardik Thanth, product engineer</title>
</svelte:head>

<a class="skip" href="#main">Skip to content</a>

<Header />

<main id="main">
	<Hero selected={offerId} onChoose={choose} />
	<Offers bind:offerId {request} />
	<Principles />
	<Process />
	<Faq />
	<Contact bind:offerId />
</main>

<Footer />
