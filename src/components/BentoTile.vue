<script setup lang="ts">
defineProps<{
  id: string
  eyebrow: string
  title: string
  /** Tailwind classes that set the tile's span at each breakpoint. */
  span?: string
}>()
</script>

<template>
  <section :id="id" :aria-labelledby="`${id}-title`" :class="['tile', span]">
    <header class="mb-4 flex min-w-0 items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2 :id="`${id}-title`" class="mt-1 text-[1.08rem] font-semibold leading-snug tracking-tight text-ink">
          {{ title }}
        </h2>
      </div>
      <slot name="action" />
    </header>
    <slot />
  </section>
</template>
