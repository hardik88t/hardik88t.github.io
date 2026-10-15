<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import ProfileTile from '@/components/ProfileTile.vue'
import MetricsTile from '@/components/MetricsTile.vue'
import AgentBoard from '@/components/AgentBoard.vue'
import CommitStream from '@/components/CommitStream.vue'
import ChartTile from '@/components/ChartTile.vue'
import TokenPlayground from '@/components/TokenPlayground.vue'
import PhoneDemo from '@/components/PhoneDemo.vue'
import A11yTile from '@/components/A11yTile.vue'
import ServicesTile from '@/components/ServicesTile.vue'
import StackTile from '@/components/StackTile.vue'
import WorkflowSection from '@/components/WorkflowSection.vue'
import WorkSection from '@/components/WorkSection.vue'
import ExperienceSection from '@/components/ExperienceSection.vue'
import ContactSection from '@/components/ContactSection.vue'
</script>

<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-inner focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
  >
    Skip to content
  </a>

  <SiteHeader />

  <main id="main" class="mx-auto max-w-[80rem] px-4 pt-4 sm:px-6 sm:pt-6">
    <!-- Bento overview: the proof of work, as working mini-demos. Order is the mobile priority. -->
    <div class="bento" aria-label="Overview">
      <ProfileTile class="md:col-span-2 lg:col-span-7" />
      <MetricsTile class="md:col-span-2 lg:col-span-5" />
      <AgentBoard class="md:col-span-2 lg:col-span-8" />
      <CommitStream class="lg:col-span-4" />
      <TokenPlayground class="md:col-span-2 lg:col-span-5" />
      <PhoneDemo class="lg:col-span-3" />
      <!-- Chart and accessibility share one desktop column; on smaller screens they flow as separate tiles. -->
      <div class="contents lg:flex lg:col-span-4 lg:flex-col lg:gap-4">
        <ChartTile />
        <A11yTile class="lg:flex-1" />
      </div>
      <StackTile class="md:col-span-2 lg:col-span-12" />
      <ServicesTile class="md:col-span-2 lg:col-span-12" />
    </div>

    <WorkflowSection />
    <WorkSection />
    <ExperienceSection />
    <ContactSection />
  </main>

  <SiteFooter />
</template>
