<script setup lang="ts">
import { computed } from 'vue'

// Code-drawn stand-ins for screenshots (none exist yet). Each is a wireframe sketch tinted with the project accent.
const props = defineProps<{ categories: string[]; accent: string }>()

const variant = computed(() => {
  const c = props.categories
  if (c.includes('cli')) return 'terminal'
  if (c.includes('agentic')) return 'pipeline'
  if (c.includes('native-mobile')) return 'phone'
  if (c.includes('data-viz')) return 'chart'
  if (c.includes('desktop')) return 'window'
  if (c.includes('web-app') || c.includes('ai')) return 'window'
  return 'page'
})

const style = computed(() => ({
  background: `linear-gradient(135deg, color-mix(in oklab, ${props.accent} 26%, var(--surface)) 0%, var(--surface-2) 70%)`,
}))
</script>

<template>
  <div class="relative h-36 w-full overflow-hidden border-b border-line" :style="style" aria-hidden="true">
    <svg viewBox="0 0 320 144" class="absolute inset-0 size-full" preserveAspectRatio="xMidYMid meet" fill="none">
      <!-- window / dashboard -->
      <g v-if="variant === 'window'">
        <rect x="34" y="18" width="252" height="112" rx="10" fill="var(--surface)" stroke="var(--line-strong)" />
        <circle cx="50" cy="31" r="3" fill="var(--line-strong)" />
        <circle cx="60" cy="31" r="3" fill="var(--line-strong)" />
        <circle cx="70" cy="31" r="3" fill="var(--line-strong)" />
        <rect x="34" y="42" width="58" height="88" fill="var(--surface-2)" />
        <rect x="46" y="54" width="34" height="5" rx="2.5" fill="var(--line-strong)" />
        <rect x="46" y="66" width="26" height="5" rx="2.5" fill="var(--line)" />
        <rect x="46" y="78" width="30" height="5" rx="2.5" fill="var(--line)" />
        <rect x="104" y="54" width="72" height="44" rx="6" fill="var(--accent)" fill-opacity="0.85" />
        <rect x="186" y="54" width="90" height="44" rx="6" fill="var(--surface-2)" stroke="var(--line)" />
        <rect x="104" y="106" width="172" height="8" rx="4" fill="var(--line)" />
        <rect x="104" y="120" width="120" height="6" rx="3" fill="var(--line)" />
      </g>
      <!-- phone -->
      <g v-else-if="variant === 'phone'">
        <rect x="118" y="10" width="92" height="128" rx="16" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1.5" />
        <rect x="128" y="26" width="72" height="8" rx="4" fill="var(--line-strong)" />
        <rect x="128" y="44" width="72" height="22" rx="6" fill="var(--accent)" fill-opacity="0.85" />
        <rect x="128" y="72" width="72" height="16" rx="5" fill="var(--surface-2)" stroke="var(--line)" />
        <rect x="128" y="94" width="72" height="16" rx="5" fill="var(--surface-2)" stroke="var(--line)" />
        <rect x="128" y="118" width="72" height="8" rx="4" fill="var(--line)" />
      </g>
      <!-- terminal -->
      <g v-else-if="variant === 'terminal'">
        <rect x="50" y="22" width="220" height="104" rx="10" fill="#0f1512" />
        <rect x="64" y="40" width="56" height="5" rx="2.5" fill="var(--accent)" />
        <rect x="64" y="54" width="140" height="5" rx="2.5" fill="#ffffff" fill-opacity="0.35" />
        <rect x="64" y="68" width="108" height="5" rx="2.5" fill="#ffffff" fill-opacity="0.22" />
        <rect x="64" y="82" width="152" height="5" rx="2.5" fill="#ffffff" fill-opacity="0.35" />
        <rect x="64" y="96" width="36" height="5" rx="2.5" fill="#7fd3b0" />
      </g>
      <!-- agent pipeline -->
      <g v-else-if="variant === 'pipeline'">
        <path d="M46 72 H274" stroke="var(--line-strong)" stroke-width="2" stroke-dasharray="4 5" />
        <g v-for="(x, i) in [46, 104, 162, 220, 274]" :key="x">
          <rect :x="x - 18" y="56" width="36" height="32" rx="9" fill="var(--surface)" stroke="var(--line-strong)" />
          <circle :cx="x" cy="72" r="4" :fill="i < 4 ? 'var(--accent)' : 'var(--sage)'" />
        </g>
        <rect x="58" y="104" width="206" height="8" rx="4" fill="var(--line)" />
        <rect x="58" y="118" width="130" height="6" rx="3" fill="var(--line)" />
      </g>
      <!-- chart -->
      <g v-else-if="variant === 'chart'">
        <path d="M52 118 H270" stroke="var(--line-strong)" />
        <rect x="70" y="84" width="22" height="34" rx="4" fill="var(--line-strong)" />
        <rect x="104" y="68" width="22" height="50" rx="4" fill="var(--accent)" fill-opacity="0.8" />
        <rect x="138" y="52" width="22" height="66" rx="4" fill="var(--line-strong)" />
        <rect x="172" y="74" width="22" height="44" rx="4" fill="var(--line-strong)" />
        <rect x="206" y="40" width="22" height="78" rx="4" fill="var(--accent)" fill-opacity="0.8" />
        <path d="M81 74 L115 58 L149 44 L183 62 L217 30" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <!-- page -->
      <g v-else>
        <rect x="52" y="20" width="216" height="104" rx="10" fill="var(--surface)" stroke="var(--line-strong)" />
        <rect x="70" y="36" width="104" height="10" rx="5" fill="var(--ink)" fill-opacity="0.75" />
        <rect x="70" y="54" width="150" height="6" rx="3" fill="var(--line-strong)" />
        <rect x="70" y="66" width="122" height="6" rx="3" fill="var(--line)" />
        <rect x="70" y="84" width="58" height="18" rx="6" fill="var(--accent)" fill-opacity="0.85" />
        <rect x="136" y="84" width="58" height="18" rx="6" fill="var(--surface-2)" stroke="var(--line)" />
        <rect x="200" y="36" width="54" height="66" rx="6" fill="var(--surface-2)" />
      </g>
    </svg>
  </div>
</template>
