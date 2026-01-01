<script lang="ts" setup>
import { getSchema } from "~/composables/api";
import BorderBox from "~/components/General/BorderBox.vue";
import IPButton from "~/components/General/IPButton.vue";
import type { IPBaseObject } from "~/utils/types/CommonProperties";
import MappingItemEditForm from "~/components/General/MappingItemEditForm.vue";

const route = useRoute();
const category = route.params.category.toString();
const { data: schema, error: errorSchema } = await getSchema(category);
const item = ref<IPBaseObject>({ _id: "", mappingCategory: category });
</script>

<template>
  <NuxtLayout name="main">
    <IPButton secondary @click.prevent="useRouter().back()">
      {{ $t("back_to_category_prefix", { category: $t(category) }) }}
    </IPButton>
    <BorderBox v-if="errorSchema">
      {{ $t("resource_unloadable_notice") }}
    </BorderBox>
    <MappingItemEditForm v-model:item="item" :schema="schema" />
  </NuxtLayout>
</template>
