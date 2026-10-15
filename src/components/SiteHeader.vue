<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'
import { content } from '@/lib/content'
import { pressHover, pressTap } from '@/composables/usePress'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#services', label: 'Services' },
  { href: '#stack', label: 'Stack' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

const THEME_KEY = 'ht-theme'
const theme = ref<'light' | 'dark'>('light')

function systemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function currentTheme(): 'light' | 'dark' {
  const explicit = document.documentElement.dataset.theme
  return explicit === 'light' || explicit === 'dark' ? explicit : systemTheme()
}

function toggleTheme() {
  const next = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = next
  theme.value = next
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    // Storage can be blocked (private mode). The toggle still works for this visit.
  }
}

const menu = useTemplateRef<HTMLDialogElement>('menu')
const menuOpen = ref(false)

function openMenu() {
  menu.value?.showModal()
  menuOpen.value = true
}
function closeMenu() {
  menu.value?.close()
}
watch(menuOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') document.documentElement.dataset.theme = stored
  } catch {
    // ignore
  }
  theme.value = currentTheme()
})
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-line/80 bg-bg/85 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-[80rem] items-center justify-between gap-3 px-4 sm:px-6">
      <a href="#top" class="group flex min-w-0 items-center gap-2.5 rounded-inner">
        <span class="grid size-9 shrink-0 place-items-center rounded-[calc(var(--radius-inner)*0.9)] bg-accent text-[0.8rem] font-semibold text-on-accent transition-transform duration-500 ease-spring group-hover:-rotate-6" aria-hidden="true">
          {{ content.profile.monogram }}
        </span>
        <span class="truncate text-[0.95rem] font-semibold">{{ content.profile.name }}</span>
        <span class="sr-only">, back to top</span>
      </a>

      <nav aria-label="Primary" class="hidden lg:block">
        <ul class="flex items-center gap-1">
          <li v-for="l in links" :key="l.href">
            <a :href="l.href" class="inline-flex min-h-11 items-center rounded-full px-3 text-[0.9rem] font-medium text-muted transition-colors hover:bg-surface hover:text-ink">{{ l.label }}</a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="grid size-11 place-items-center rounded-inner border border-line bg-surface text-ink transition-colors hover:border-line-strong"
          :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          v-motion
          :tap="pressTap"
          @click="toggleTheme"
        >
          <svg v-if="theme === 'dark'" class="size-[1.05rem]" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="10" cy="10" r="3.6" /><path d="M10 2.5v1.6M10 15.9v1.6M2.5 10h1.6M15.9 10h1.6M4.6 4.6l1.1 1.1M14.3 14.3l1.1 1.1M4.6 15.4l1.1-1.1M14.3 5.7l1.1-1.1" /></svg>
          <svg v-else class="size-[1.05rem]" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M16.5 11.6A6.8 6.8 0 0 1 8.4 3.5a6.8 6.8 0 1 0 8.1 8.1Z" /></svg>
        </button>

        <a href="#contact" class="btn btn-primary hidden min-h-11 px-4 text-[0.9rem] sm:inline-flex" v-motion :hover="pressHover" :tap="pressTap">Start a project</a>

        <button
          type="button"
          class="grid h-11 place-items-center rounded-inner border border-line bg-surface px-3.5 text-[0.9rem] font-semibold lg:hidden"
          aria-controls="mobile-menu"
          :aria-expanded="menuOpen"
          @click="openMenu"
        >
          Menu
        </button>
      </div>
    </div>
  </header>

  <dialog
    id="mobile-menu"
    ref="menu"
    class="mobile-menu"
    aria-label="Site menu"
    @close="menuOpen = false"
  >
    <div class="flex h-full flex-col px-4 pb-8 pt-4 sm:px-6">
      <div class="flex h-12 items-center justify-between">
        <span class="text-[0.95rem] font-semibold">{{ content.profile.name }}</span>
        <button type="button" class="btn btn-ghost min-h-11 px-4 text-[0.9rem]" @click="closeMenu">Close</button>
      </div>
      <nav aria-label="Mobile" class="mt-8 flex-1">
        <ul class="divide-y divide-line border-y border-line">
          <li v-for="(l, i) in links" :key="l.href">
            <a :href="l.href" class="flex min-h-14 items-center justify-between text-[1.4rem] font-semibold tracking-tight" @click="closeMenu">
              <span>{{ l.label }}</span>
              <span class="mono-num text-[0.78rem] font-medium text-muted">0{{ i + 1 }}</span>
            </a>
          </li>
        </ul>
      </nav>
      <a href="#contact" class="btn btn-primary min-h-12 w-full text-[1rem]" @click="closeMenu">Start a project</a>
      <p class="mt-4 text-center text-[0.8rem] text-muted">{{ content.profile.location }}</p>
    </div>
  </dialog>
</template>

<style scoped>
.mobile-menu {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: var(--bg);
  color: var(--ink);
}
.mobile-menu[open] {
  animation: menu-in 0.35s var(--ease-out-quint);
}
.mobile-menu::backdrop {
  background: var(--bg);
}
@keyframes menu-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
