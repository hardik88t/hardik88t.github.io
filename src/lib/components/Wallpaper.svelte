<div class="wallpaper" aria-hidden="true">
	<span class="blob b1"></span>
	<span class="blob b2"></span>
	<span class="blob b3"></span>
	<span class="blob b4"></span>
</div>

<style>
	.wallpaper {
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		background: var(--desk);
		isolation: isolate;
	}
	.wallpaper::after {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(120% 90% at 50% 0%, transparent 55%, color-mix(in srgb, var(--desk) 70%, transparent) 100%);
		pointer-events: none;
	}
	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
		opacity: 0.8;
		will-change: transform;
		animation: drift 28s ease-in-out infinite alternate;
	}
	.b1 {
		width: 62vmax;
		height: 48vmax;
		left: -14%;
		top: -16%;
		background: var(--mesh-a);
	}
	.b2 {
		width: 52vmax;
		height: 42vmax;
		right: -16%;
		top: 8%;
		background: var(--mesh-b);
		animation-duration: 33s;
		animation-delay: -7s;
	}
	.b3 {
		width: 50vmax;
		height: 40vmax;
		left: 18%;
		bottom: -28%;
		background: var(--mesh-c);
		animation-duration: 30s;
		animation-delay: -12s;
	}
	.b4 {
		width: 34vmax;
		height: 30vmax;
		right: 14%;
		bottom: -6%;
		background: var(--mesh-d);
		opacity: 0.7;
		animation-duration: 24s;
		animation-delay: -4s;
	}
	@keyframes drift {
		from {
			transform: translate3d(0, 0, 0) scale(1);
		}
		to {
			transform: translate3d(3vmax, -2.5vmax, 0) scale(1.08);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.blob {
			animation: none;
		}
	}
</style>
