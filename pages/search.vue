<script lang="ts" setup>
import SearchInput from "~/components/Header/SearchInput.vue";
import ResultList from "~/components/MappingItemList/ResultList.vue";
import type { SearchParameter } from "~/utils/types/APIInterfaces";
import IPButton from "~/components/General/IPButton.vue";
import BorderBox from "~/components/General/BorderBox.vue";
import { search } from "~/composables/api";

const route = useRoute();
const localePath = useLocalePath();
const searchText = ref<string>(
    route.query.searchText as string
);
const itemsPerPage = 20; // define the max numbers of items per page
const page = ref<number>(
  parseInt(route.query.page as string) || 1
); // init page number always with one

const params: SearchParameter = {
  offset: computed(() => (page.value - 1) * itemsPerPage),
  limit: itemsPerPage,
  searchText,
};

const { data: result, pending } = await search(params);

/** Make result available for bookmark */
watch(
  [page, searchText],
  async ([newPage, newSearchText]) => {
    await navigateTo({
      query: {
        searchText: newSearchText,
        page: newPage,
      }
    });
  }
);

</script>

<template>
  <NuxtLayout name="main">
    <IPButton secondary @click.prevent="navigateTo(localePath('/'))">
      {{ $t("back_to_category_list") }}
    </IPButton>
    <hr class="my-4" />
    <SearchInput v-model="searchText" />
    <div v-if="!pending && !result">
      {{ $t("search_typing_hint") }}
    </div>
    <div v-else-if="result" class="my-4">
      <ResultList v-model="page" :result="result" :pending="pending" />
    </div>
    <BorderBox v-else>
      {{ $t("no_category_content") }}
    </BorderBox>
  </NuxtLayout>
</template>
