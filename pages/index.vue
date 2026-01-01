<script lang="ts" setup>
import NoScriptMessage from "~/components/NoScriptMessage.vue";
import BorderBox from "~/components/General/BorderBox.vue";
import IPButton from "~/components/General/IPButton.vue";

// Sample categories for template - replace with your own data
const categories = ref(["Category 1", "Category 2", "Category 3", "Category 4"]);
</script>

<template>
  <NuxtLayout name="main">
    <NuxtLoadingIndicator :height="5" />
    <h1 class="text-4xl font-bold">
      {{ $t("information_portal_name") }}
    </h1>
    <NoScriptMessage />
    <BorderBox>
      {{ $t("intro_text") }}
    </BorderBox>
    <BorderBox class="grid grid-cols-4 gap-8">
      <IPButton
        v-for="(value, index) in categories"
        :key="index"
        secondary
      >
        {{ value }}
      </IPButton>
    </BorderBox>
  </NuxtLayout>
</template>
