<script lang="ts" setup>
import { getCategory } from "~/composables/api";
import BorderBox from "~/components/General/BorderBox.vue";
import ResultList from "~/components/MappingItemList/ResultList.vue";
import IPButton from "~/components/General/IPButton.vue";
import type { PaginationParameter } from "~/utils/types/APIInterfaces";
import { useLocalePath } from "#imports";

const route = useRoute();
const localePath = useLocalePath();
const category = route.params.category.toString();

const itemsPerPage = 16; // define the max numbers of items per page
const page = ref<number>(
  parseInt(route.query.page as string) || 1
); // init page number always with one

const params: PaginationParameter = {
  offset: computed(() => (page.value - 1) * itemsPerPage),
  limit: itemsPerPage
};

const { data: result, pending } = await getCategory(category, params);

/** Make result available for bookmark */
watch(
  page,
  async (newPage) => {
    await navigateTo({
      query: { page: newPage }
    });
  }
);

</script>

<template>
  <NuxtLayout name="main">
    <IPButton secondary @click.prevent="navigateTo(localePath('/'))">
      {{ $t("back_to_category_list") }}
    </IPButton>
    <IPButton secondary class="ml-5" @click.prevent="navigateTo(useLocalePath()(`/MappingItem/add/${category}`))">
      {{ $t("add_new_resource") }}
    </IPButton>
    <hr class="my-4" />
    <div v-if="result" class="my-4">
      <ResultList v-model="page" :result="result" :pending="pending" />
    </div>
    <BorderBox v-else>
      {{ $t("no_category_content") }}
    </BorderBox>
  </NuxtLayout>
</template>
