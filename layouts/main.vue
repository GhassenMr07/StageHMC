<script lang="ts" setup>
import HMCHeader from "~/components/HMCHeader.vue";
import HMCFooter from "~/components/HMCFooter.vue";
</script>

<template>
  <div class="flex flex-col grow">
    <HMCHeader />
    <main class="container mx-auto grow">
      <slot />
    </main>
    <HMCFooter />
  </div>
</template>
