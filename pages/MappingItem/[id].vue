<script lang="ts" setup>
import { useRoute, useLocalePath } from "#imports";
import { getItem, getSchema } from "~/composables/api";
import IPButton from "~/components/General/IPButton.vue";
import MappingItemEditForm from "~/components/General/MappingItemEditForm.vue";
import BorderBox from "~/components/General/BorderBox.vue";

const route = useRoute();

const itemId = route.params.id.toString();
const { data: item, error: errorItem } = await getItem(itemId);
const currentSchema = computed(() => item.value?.mappingCategory ?? "");
const { data: schema, error: errorSchema } = await getSchema(
  currentSchema.value
);
</script>

<template>
  <NuxtLayout name="main">
    <IPButton
      secondary
      @click.prevent="
        navigateTo(useLocalePath()(`/MappingItemList/${currentSchema}`))
      "
    >
      {{ $t("back_to_category_prefix", { category: $t(currentSchema) }) }}
    </IPButton>
    <IPButton
      secondary
      class="ml-5"
      @click.prevent="
        navigateTo(useLocalePath()(`/MappingItem/add/${currentSchema}`))
      "
    >
      {{ $t("add_new_resource") }}
    </IPButton>
    <BorderBox v-if="errorItem || errorSchema">
      {{ $t("resource_unloadable_notice") }}
    </BorderBox>
    <MappingItemEditForm v-model:item="item" :schema="schema" />
  </NuxtLayout>
</template>
