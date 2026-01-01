<script lang="ts" setup>
import BorderBox from "~/components/General/BorderBox.vue";
</script>

<template>
  <ClientOnly>
    <component :is="'noscript'">
      <BorderBox warning>
        {{ $t("no_javascript_message") }}
      </BorderBox>
    </component>
  </ClientOnly>
</template>
