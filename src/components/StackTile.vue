<script setup lang="ts">
import { content } from '@/lib/content'
import BentoTile from './BentoTile.vue'

const groups = Object.entries(content.profile.skills)
const tone = ['text-cobalt-ink', 'text-sage-ink', 'text-marigold-ink', 'text-plum-ink', 'text-cobalt-ink', 'text-sage-ink', 'text-plum-ink']
</script>

<template>
  <BentoTile id="stack" eyebrow="Stack and skills" title="What I build with">
    <div class="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="([group, items], i) in groups" :key="group" class="min-w-0">
        <h3 class="mb-2 text-[0.8rem] font-semibold" :class="tone[i % tone.length]">{{ group }}</h3>
        <ul class="flex flex-wrap gap-1.5">
          <li v-for="item in items" :key="item" class="chip text-[0.78rem]">{{ item }}</li>
        </ul>
      </div>
    </div>
  </BentoTile>
</template>
