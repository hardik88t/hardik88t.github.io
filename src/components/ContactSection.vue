<script setup lang="ts">
import { ref } from 'vue'
import { content } from '@/lib/content'
import { pressHover, pressTap } from '@/composables/usePress'

const { profile } = content
const email = profile.email

const copyState = ref<'idle' | 'copied' | 'failed'>('idle')

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email)
    copyState.value = 'copied'
  } catch {
    // Fallback for browsers without the async clipboard API or outside a secure context.
    try {
      const ta = document.createElement('textarea')
      ta.value = email
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      copyState.value = ok ? 'copied' : 'failed'
    } catch {
      copyState.value = 'failed'
    }
  }
}

const projectTypes = [
  'Web application or SaaS',
  'UI/UX and design system',
  'Desktop or Android app',
  'AI features or agent workflow',
  'Something else',
]

const name = ref('')
const from = ref('')
const kind = ref(projectTypes[0] ?? '')
const message = ref('')
const notice = ref('')

function onSubmit(e: Event) {
  const form = e.currentTarget as HTMLFormElement
  if (!form.reportValidity()) return
  const subject = `Project enquiry: ${kind.value}`
  const body = [`Name: ${name.value}`, `Reply to: ${from.value}`, '', message.value].join('\n')
  // A mailto link is a convenience only. Nothing is sent from this page.
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  notice.value = 'Your email app should open with this draft. Nothing has been sent from this page. If nothing opens, write to the address above.'
}
</script>

<template>
  <section id="contact" aria-labelledby="contact-title" class="pt-20 pb-16 sm:pt-28">
    <div class="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div class="lg:col-span-5">
        <p class="eyebrow">Contact</p>
        <h2 id="contact-title" class="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Start a <em class="serif-accent text-[1.08em] font-normal tracking-normal text-cobalt-ink">project</em>
        </h2>
        <p class="mt-5 max-w-[46ch] text-[0.98rem] leading-relaxed text-muted">
          Tell me what you are building, who it is for and when you need it. I work on web apps, UI/UX and design systems, native apps, and AI features.
        </p>

        <div class="tile mt-8 p-5">
          <p class="eyebrow">Email</p>
          <p class="mt-2 flex flex-wrap items-center gap-3">
            <a :href="`mailto:${email}`" class="select-all break-all font-mono text-[1rem] font-semibold text-ink underline decoration-line-strong decoration-1 underline-offset-4">{{ email }}</a>
            <button
              type="button"
              class="btn btn-ghost min-h-11 px-3.5 text-[0.86rem]"
              v-motion
              :hover="pressHover"
              :tap="pressTap"
              @click="copyEmail"
            >
              Copy email
            </button>
          </p>
          <p class="mt-2 min-h-5 text-[0.82rem] text-muted" role="status" aria-live="polite">
            <template v-if="copyState === 'copied'">Copied to your clipboard.</template>
            <template v-else-if="copyState === 'failed'">Could not copy. Select the address and copy it by hand.</template>
          </p>

          <ul class="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
            <li>
              <a :href="profile.links.linkedin" target="_blank" rel="noopener noreferrer" class="chip min-h-11 px-3.5 text-[0.84rem] font-semibold">LinkedIn<span class="sr-only"> (opens in a new tab)</span></a>
            </li>
            <li>
              <a :href="profile.links.github" target="_blank" rel="noopener noreferrer" class="chip min-h-11 px-3.5 text-[0.84rem] font-semibold">GitHub<span class="sr-only"> (opens in a new tab)</span></a>
            </li>
            <li>
              <a :href="profile.links.cv" target="_blank" rel="noopener noreferrer" class="chip min-h-11 px-3.5 text-[0.84rem] font-semibold">CV (PDF)<span class="sr-only"> (opens in a new tab)</span></a>
            </li>
          </ul>
        </div>
      </div>

      <form class="tile min-w-0 lg:col-span-7" novalidate @submit.prevent="onSubmit" aria-describedby="form-note">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="grid gap-1.5 text-[0.85rem] font-medium">
            Name
            <input v-model="name" name="name" type="text" required autocomplete="name" class="field" />
          </label>
          <label class="grid gap-1.5 text-[0.85rem] font-medium">
            Email to reply to
            <input v-model="from" name="email" type="email" required autocomplete="email" class="field" />
          </label>
        </div>
        <label class="mt-4 grid gap-1.5 text-[0.85rem] font-medium">
          What kind of project
          <select v-model="kind" name="type" class="field">
            <option v-for="t in projectTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </label>
        <label class="mt-4 grid gap-1.5 text-[0.85rem] font-medium">
          Tell me about it
          <textarea v-model="message" name="message" rows="6" required minlength="10" class="field resize-y leading-relaxed" />
        </label>

        <div class="mt-5 flex flex-wrap items-center justify-between gap-4">
          <button type="submit" class="btn btn-primary min-h-11 px-5" v-motion :hover="pressHover" :tap="pressTap">
            Open draft in email
          </button>
          <p id="form-note" class="max-w-[38ch] text-[0.8rem] leading-snug text-muted" role="status" aria-live="polite">
            {{ notice || 'This opens your email app with the draft. Nothing is sent from this page.' }}
          </p>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.field {
  min-height: 2.75rem;
  width: 100%;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  color: var(--ink);
  padding: 0.6rem 0.8rem;
  font: inherit;
  font-weight: 400;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}
.field:focus {
  border-color: var(--accent);
  background: var(--surface);
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 25%, transparent);
}
</style>
