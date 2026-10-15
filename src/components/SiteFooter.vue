<script setup lang="ts">
import { content } from '@/lib/content'
</script>

<template>
  <footer class="mt-20 border-t border-line sm:mt-28">
    <div class="mx-auto flex max-w-[80rem] flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
      <p class="max-w-[60ch] text-[0.95rem] text-ink">{{ content.footer }}</p>
      <p class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.84rem] text-muted">
        <span>{{ content.profile.location }}, {{ content.profile.timezone }}</span>
        <a href="#top" class="inline-flex min-h-10 items-center font-semibold text-ink underline decoration-line-strong underline-offset-4">Back to top</a>
      </p>
    </div>
  </footer>
</template>
