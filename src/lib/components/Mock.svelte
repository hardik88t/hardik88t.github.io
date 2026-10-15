<script lang="ts">
	// Decorative, code-drawn thumbnail of each example project's UI. The text beside it says what it is.
	let { slug, accent }: { slug: string; accent: string } = $props();
</script>

<div class="mock" style="--accent: {accent}" aria-hidden="true">
	{#if slug === 'wholesale-os'}
		<div class="dash">
			<div class="side">
				<i class="on"></i>
				<i></i>
				<i></i>
				<i></i>
			</div>
			<div class="main">
				<i class="title"></i>
				<div class="row"><i class="w60"></i><b class="pill"></b></div>
				<div class="row"><i class="w40"></i><b class="pill ok"></b></div>
				<div class="row"><i class="w50"></i><b class="pill"></b></div>
				<div class="stock"><span style="width: 72%"></span></div>
				<div class="stock soft"><span style="width: 46%"></span></div>
			</div>
		</div>
	{:else if slug === 'fieldbook'}
		<div class="phones">
			<div class="phone">
				<i class="w70"></i>
				<i class="w50"></i>
				<i class="w60"></i>
				<i class="w40"></i>
			</div>
			<div class="phone grid">
				<span></span><span></span>
				<span></span><span></span>
			</div>
			<div class="phone cart">
				<i class="w60"></i>
				<i class="w40"></i>
				<b></b>
			</div>
		</div>
	{:else if slug === 'footnote'}
		<div class="chat">
			<div class="bubble">
				<i class="w90"></i>
				<i class="w70"></i>
				<div class="chips"><span>1</span><span>2</span></div>
			</div>
			<div class="doc">
				<i class="w80"></i>
				<i class="hl"></i>
				<i class="w60"></i>
				<i class="w90"></i>
			</div>
		</div>
	{:else}
		<div class="tokens">
			<div class="swatches">
				<span style="background: var(--accent)"></span>
				<span class="s2"></span>
				<span class="s3"></span>
				<span class="s4"></span>
			</div>
			<div class="scale">
				<b>Aa</b>
				<i class="w60"></i>
			</div>
			<div class="ui">
				<span class="btn"></span>
				<span class="field"></span>
				<span class="toggle"><em></em></span>
			</div>
		</div>
	{/if}
</div>

<style>
	.mock {
		position: relative;
		width: 96px;
		aspect-ratio: 4 / 3;
		flex: none;
		border-radius: 12px;
		border: 1px solid var(--line);
		background: #f5f6fa;
		overflow: hidden;
	}

	i,
	b,
	span,
	em {
		display: block;
	}

	/* shared bars */
	i {
		height: 4px;
		border-radius: 2px;
		background: #d9dee9;
	}

	.w40 {
		width: 40%;
	}
	.w50 {
		width: 50%;
	}
	.w60 {
		width: 60%;
	}
	.w70 {
		width: 70%;
	}
	.w80 {
		width: 80%;
	}
	.w90 {
		width: 90%;
	}

	/* Dashboard */
	.dash {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: 26% 1fr;
	}

	.side {
		background: #ffffff;
		border-right: 1px solid var(--line);
		padding: 9px 6px;
		display: grid;
		align-content: start;
		gap: 6px;
	}

	.side i.on {
		background: var(--accent);
	}

	.main {
		padding: 9px 8px;
		display: grid;
		align-content: start;
		gap: 6px;
	}

	.main .title {
		width: 55%;
		height: 5px;
		background: #11131a;
		opacity: 0.8;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
	}

	.row i {
		flex: 0 0 auto;
	}

	.pill {
		width: 16px;
		height: 6px;
		border-radius: 3px;
		background: var(--accent);
	}

	.pill.ok {
		background: #10b981;
	}

	.stock {
		height: 4px;
		border-radius: 2px;
		background: #d9dee9;
		margin-top: 2px;
	}

	.stock span {
		height: 100%;
		border-radius: 2px;
		background: var(--accent);
	}

	.stock.soft span {
		background: #9fb2ff;
	}

	/* Phones */
	.phones {
		position: absolute;
		inset: 10px 8px 0;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 4px;
	}

	.phone {
		width: 30%;
		height: 88%;
		border-radius: 9px;
		border: 2px solid #11131a;
		background: #ffffff;
		padding: 7px 5px;
		display: grid;
		align-content: start;
		gap: 5px;
	}

	.phone.grid {
		grid-template-columns: 1fr 1fr;
		gap: 4px;
		align-content: start;
	}

	.phone.grid span {
		height: 14px;
		border-radius: 3px;
		background: var(--tint-accent, #e8ecf6);
	}

	.phone.grid span:nth-child(2n) {
		background: #d9dee9;
	}

	.phone.cart b {
		margin-top: auto;
		height: 9px;
		border-radius: 4px;
		background: var(--accent);
	}

	/* Chat with citations */
	.chat {
		position: absolute;
		inset: 0;
		padding: 8px;
		display: grid;
		gap: 6px;
		align-content: center;
	}

	.bubble {
		background: #ffffff;
		border: 1px solid var(--line);
		border-radius: 8px 8px 8px 2px;
		padding: 7px;
		display: grid;
		gap: 5px;
	}

	.chips {
		display: flex;
		gap: 4px;
	}

	.chips span {
		display: grid;
		place-items: center;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: var(--accent);
		color: #ffffff;
		font: 700 7px/1 var(--font-mono);
	}

	.doc {
		background: #ffffff;
		border: 1px solid var(--line);
		border-radius: 8px;
		padding: 7px;
		display: grid;
		gap: 5px;
	}

	.doc .hl {
		width: 85%;
		height: 6px;
		background: color-mix(in srgb, var(--accent) 22%, #ffffff);
	}

	/* Token sheet */
	.tokens {
		position: absolute;
		inset: 0;
		padding: 9px;
		display: grid;
		gap: 7px;
		align-content: start;
	}

	.swatches {
		display: flex;
		gap: 4px;
	}

	.swatches span {
		flex: 1 1 0;
		min-width: 0;
		height: 14px;
		border-radius: 4px;
		background: #c9cedb;
	}

	.swatches .s2 {
		background: #11131a;
	}

	.swatches .s3 {
		background: #ffffff;
		border: 1px solid var(--line);
	}

	.swatches .s4 {
		background: #9fb2ff;
	}

	.scale {
		display: flex;
		align-items: center;
		gap: 7px;
	}

	.scale b {
		font: 700 15px/1 var(--font-sans);
		letter-spacing: -0.03em;
		color: var(--ink);
	}

	.scale i {
		flex: 1;
	}

	.ui {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.ui .btn {
		width: 26px;
		height: 10px;
		border-radius: 3px;
		background: var(--accent);
	}

	.ui .field {
		width: 22px;
		height: 10px;
		border-radius: 3px;
		border: 1px solid var(--line-strong);
		background: #ffffff;
	}

	.ui .toggle {
		width: 18px;
		height: 10px;
		border-radius: 6px;
		background: #11131a;
		position: relative;
	}

	.ui .toggle em {
		position: absolute;
		top: 2px;
		right: 2px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #ffffff;
	}
</style>
