<script setup lang="ts">
import { computed, ref } from 'vue'
import { content } from '@/lib/content'
import { pressTap } from '@/composables/usePress'
import BentoTile from './BentoTile.vue'

// A concept demo of a native habit app. It is not a shipped product: the tile says so.
type TabId = 'today' | 'week' | 'settings'
const tabs: { id: TabId; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'settings', label: 'Settings' },
]
const tab = ref<TabId>('today')
const nativeCapabilities = content.services.find((s) => s.id === 'native')?.includes ?? []

const habits = ref([
  { id: 'walk', name: 'Morning walk', done: true },
  { id: 'water', name: 'Two litres of water', done: false },
  { id: 'read', name: 'Read ten pages', done: true },
  { id: 'stretch', name: 'Stretch for five minutes', done: false },
])
const doneCount = computed(() => habits.value.filter((h) => h.done).length)
const percent = computed(() => Math.round((doneCount.value / habits.value.length) * 100))
const ringLen = computed(() => 2 * Math.PI * 30 * (percent.value / 100))

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const week = ref<boolean[]>([true, true, false, true, true, false, false])
const weekDone = computed(() => week.value.filter(Boolean).length)

const settings = ref([
  { id: 'remind', label: 'Daily reminder', on: true },
  { id: 'haptics', label: 'Haptic feedback', on: true },
  { id: 'summary', label: 'Weekly summary', on: false },
])
const reminderTime = ref<'08:00' | '20:00'>('08:00')

function toggleHabit(id: string) {
  const h = habits.value.find((x) => x.id === id)
  if (h) h.done = !h.done
}
function toggleSetting(id: string) {
  const s = settings.value.find((x) => x.id === id)
  if (s) s.on = !s.on
}
</script>

<template>
  <BentoTile id="native-demo" eyebrow="Native apps / concept demo" title="Habit app, phone build">
    <div class="flex flex-1 flex-col items-center gap-4">
      <div class="phone relative w-full max-w-[17.5rem] rounded-[2.4rem] border border-line-strong bg-term p-2.5 shadow-[var(--shadow-lift)]">
        <div class="relative flex h-[33rem] flex-col overflow-hidden rounded-[1.9rem] bg-bg text-ink">
          <div class="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-term" aria-hidden="true" />

          <header class="px-5 pb-2 pt-10">
            <p class="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted">
              {{ tab === 'today' ? 'Today' : tab === 'week' ? 'This week' : 'Preferences' }}
            </p>
            <h3 class="text-[1.2rem] font-semibold tracking-tight">
              {{ tab === 'today' ? 'Daily routine' : tab === 'week' ? `${weekDone} of 7 days` : 'Settings' }}
            </h3>
          </header>

          <div class="flex-1 overflow-y-auto px-4 pb-3">
            <!-- Today -->
            <div v-if="tab === 'today'" class="flex flex-col gap-3">
              <div class="flex items-center gap-3 rounded-[var(--radius-sm)] bg-surface p-3 ring-1 ring-line">
                <svg viewBox="0 0 72 72" class="size-14 shrink-0 -rotate-90" aria-hidden="true">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="var(--surface-2)" stroke-width="7" />
                  <circle cx="36" cy="36" r="30" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" :stroke-dasharray="`${ringLen} 999`" class="transition-[stroke-dasharray] duration-500 ease-out" />
                </svg>
                <div class="min-w-0">
                  <p class="mono-num text-[1.3rem] font-semibold leading-none">{{ percent }}%</p>
                  <p class="mt-1 text-[0.75rem] text-muted">{{ doneCount }} of {{ habits.length }} done</p>
                </div>
              </div>
              <ul class="flex flex-col gap-2">
                <li v-for="h in habits" :key="h.id">
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="h.done"
                    class="flex min-h-12 w-full items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-surface px-3 py-2 text-left ring-1 ring-line"
                    @click="toggleHabit(h.id)"
                  >
                    <span class="min-w-0 text-[0.84rem] leading-snug" :class="h.done ? 'text-muted line-through decoration-muted/60' : 'text-ink'">{{ h.name }}</span>
                    <span class="switch" aria-hidden="true" :aria-checked="h.done" />
                  </button>
                </li>
              </ul>
            </div>

            <!-- Week -->
            <div v-else-if="tab === 'week'" class="flex flex-col gap-3">
              <ul class="grid grid-cols-4 gap-2" aria-label="Days completed this week">
                <li v-for="(d, i) in days" :key="d">
                  <button
                    type="button"
                    :aria-pressed="week[i]"
                    :aria-label="`${d}: ${week[i] ? 'done' : 'not done'}`"
                    class="flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-[calc(var(--radius-sm)*0.8)] text-[0.72rem] font-semibold transition-colors duration-300 ease-out"
                    :class="week[i] ? 'bg-accent text-on-accent' : 'bg-surface text-muted ring-1 ring-line'"
                    @click="week[i] = !week[i]"
                  >
                    <span>{{ d }}</span>
                    <svg v-if="week[i]" viewBox="0 0 16 16" class="size-3.5" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5 6.5 12 13 4.5" /></svg>
                  </button>
                </li>
              </ul>
              <p class="rounded-[var(--radius-sm)] bg-surface p-3 text-[0.8rem] leading-snug text-muted ring-1 ring-line">
                Tap a day to toggle it. The count in the header updates with it.
              </p>
            </div>

            <!-- Settings -->
            <div v-else class="flex flex-col gap-3">
              <ul class="flex flex-col gap-2">
                <li v-for="s in settings" :key="s.id">
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="s.on"
                    class="flex min-h-12 w-full items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-surface px-3 py-2 text-left ring-1 ring-line"
                    @click="toggleSetting(s.id)"
                  >
                    <span class="text-[0.84rem]">{{ s.label }}</span>
                    <span class="switch" aria-hidden="true" :aria-checked="s.on" />
                  </button>
                </li>
              </ul>
              <fieldset class="rounded-[var(--radius-sm)] bg-surface p-3 ring-1 ring-line">
                <legend class="px-1 text-[0.8rem] font-medium">Reminder time</legend>
                <div class="mt-1 grid grid-cols-2 gap-1.5">
                  <button
                    v-for="t in ['08:00', '20:00'] as const"
                    :key="t"
                    type="button"
                    :aria-pressed="reminderTime === t"
                    class="min-h-10 rounded-[calc(var(--radius-sm)*0.8)] text-[0.82rem] font-semibold"
                    :class="reminderTime === t ? 'bg-accent text-on-accent' : 'bg-surface-2 text-ink ring-1 ring-line'"
                    @click="reminderTime = t"
                  >
                    {{ t }}
                  </button>
                </div>
              </fieldset>
            </div>
          </div>

          <nav class="grid grid-cols-3 gap-1 border-t border-line bg-surface px-2 pb-3 pt-2" aria-label="App sections">
            <button
              v-for="t in tabs"
              :key="t.id"
              type="button"
              :aria-current="tab === t.id ? 'page' : undefined"
              class="flex min-h-11 flex-col items-center justify-center rounded-[calc(var(--radius-sm)*0.8)] text-[0.72rem] font-semibold transition-colors duration-200"
              :class="tab === t.id ? 'text-accent' : 'text-muted'"
              v-motion
              :tap="pressTap"
              @click="tab = t.id"
            >
              <span class="mb-0.5 block size-1.5 rounded-full" :class="tab === t.id ? 'bg-accent' : 'bg-transparent'" aria-hidden="true" />
              {{ t.label }}
            </button>
          </nav>
        </div>
      </div>
      <p class="max-w-[34ch] text-center text-[0.76rem] leading-snug text-muted">
        Concept demo, not a shipped app. It shows the kind of native UI I build with Kotlin and Jetpack Compose, and with Tauri 2 on desktop.
      </p>
      <ul class="grid w-full gap-x-4 gap-y-2 border-t border-line pt-4 text-[0.8rem] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <li v-for="item in nativeCapabilities" :key="item" class="flex items-start gap-2">
          <span class="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-plum" aria-hidden="true" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>
  </BentoTile>
</template>
