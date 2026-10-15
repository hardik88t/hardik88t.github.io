<script setup lang="ts">
import { content } from '@/lib/content'
import BentoTile from './BentoTile.vue'

const { services } = content
</script>

<template>
  <BentoTile id="services" eyebrow="For clients" title="Services">
    <ul class="grid flex-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      <li
        v-for="(s, i) in services"
        :key="s.id"
        class="flex min-w-0 flex-col rounded-inner border border-line bg-surface-2 p-4"
      >
        <p class="mono-num text-[0.72rem] font-semibold text-muted">0{{ i + 1 }}</p>
        <h3 class="mt-1 text-[1rem] font-semibold leading-snug tracking-tight">{{ s.title }}</h3>
        <p class="mt-1.5 text-[0.84rem] leading-relaxed text-muted">{{ s.pitch }}</p>
        <ul class="mt-3 flex flex-col gap-1.5 border-t border-line pt-3 text-[0.8rem] text-ink">
          <li v-for="item in s.includes" :key="item" class="flex items-start gap-2">
            <span class="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-cobalt" aria-hidden="true" />
            <span class="min-w-0">{{ item }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </BentoTile>
</template>
