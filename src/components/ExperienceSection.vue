<script setup lang="ts">
import { content } from '@/lib/content'

const { profile } = content
</script>

<template>
  <section id="experience" aria-labelledby="experience-title" class="pt-20 sm:pt-28">
    <div class="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div class="lg:col-span-5">
        <p class="eyebrow">Experience</p>
        <h2 id="experience-title" class="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Experience <em class="serif-accent text-[1.08em] font-normal tracking-normal text-sage-ink">shipping</em> with teams and clients
        </h2>
        <div class="mt-6 space-y-4 text-[0.98rem] leading-relaxed text-muted">
          <p v-for="para in profile.about" :key="para">{{ para }}</p>
        </div>
      </div>

      <div class="min-w-0 lg:col-span-7">
        <ol class="relative ml-2 border-l border-line">
          <li v-for="job in profile.experience" :key="`${job.company}-${job.role}-${job.from}`" class="relative pb-10 pl-7 last:pb-0">
            <span class="absolute -left-[5px] top-2 size-2.5 rounded-full bg-accent ring-4 ring-bg" aria-hidden="true" />
            <p class="mono-num text-[0.78rem] font-semibold text-muted">{{ job.from }} to {{ job.to }}</p>
            <h3 class="mt-1 text-[1.12rem] font-semibold leading-snug tracking-tight">
              {{ job.role }}
              <span class="font-normal text-muted">at {{ job.company }}</span>
            </h3>
            <p class="text-[0.84rem] text-muted">{{ job.location }}</p>
            <ul class="mt-3 space-y-2 text-[0.92rem] leading-relaxed text-ink">
              <li v-for="h in job.highlights" :key="h" class="flex gap-2.5">
                <span class="mt-[0.6em] size-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
                <span class="min-w-0">{{ h }}</span>
              </li>
            </ul>
            <ul class="mt-3 flex flex-wrap gap-1.5" aria-label="Stack used">
              <li v-for="tech in job.stack" :key="tech" class="chip px-2 py-0 text-[0.72rem]">{{ tech }}</li>
            </ul>
          </li>
        </ol>

        <div class="tile mt-10">
          <p class="eyebrow">Education</p>
          <ul class="mt-3">
            <li v-for="ed in profile.education" :key="ed.institution" class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span class="font-semibold">{{ ed.institution }}</span>
              <span class="mono-num text-[0.8rem] text-muted">{{ ed.from }} to {{ ed.to }}</span>
              <span class="w-full text-[0.9rem] text-muted">{{ ed.degree }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
