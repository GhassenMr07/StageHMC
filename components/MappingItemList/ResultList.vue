<script lang="ts" setup>
import BorderBox from "~/components/General/BorderBox.vue";
import ExternalLink from "~/components/General/ExternalLink.vue";
import InternalLink from "~/components/General/InternalLink.vue";
import PaginationContainer from "~/components/MappingItemList/PaginationContainer.vue";
import type { PaginationResult } from "~/utils/types/APIInterfaces";
import LoadingSpinner from "~/components/General/LoadingSpinner.vue";

const page = defineModel<number>({
  default: 0
});

type Props = {
  result: PaginationResult,
  pending: boolean
  itemsPerPage?: number
}

const { result, itemsPerPage = 16 } = defineProps<Props>();
</script>

<template>
  <PaginationContainer
    v-model="page"
    :total-count="result.totalCount"
    :items-per-page="itemsPerPage"
  />
  <LoadingSpinner v-if="pending" />
  <BorderBox v-else-if="result.count > 0">
    <table class="w-full table-fixed break-words">
      <thead class="text-xl font-black">
        <tr class="border-b-2 border-black">
          <td>Name</td>
          <td class="w-1/3">
            Keywords
          </td>
        </tr>
      </thead>
      <tbody class="text-base align-top">
        <tr
          v-for="listItem in result.data"
          :key="listItem._id"
          class="border-b"
        >
          <td class="pr-5 pt-2">
            <div v-if="listItem.resourceUri">
              <ExternalLink :href="listItem.resourceUri[0]">
                {{ listItem.resourceName[0].name }}
              </ExternalLink>
              <InternalLink
                class="mx-4 text-sm"
                :to="'../MappingItem/' + listItem._id"
              >
                Details
              </InternalLink>
            </div>
            <div v-else>
              {{ listItem.resourceName[0].name }}
              <InternalLink
                class="mx-4 text-sm"
                :to="'../MappingItem/' + listItem._id"
              >
                Details
              </InternalLink>
            </div>
            <div v-if="listItem.resourceDescription" class="text-sm pb-2">
              {{ listItem.resourceDescription }}
            </div>
          </td>
          <td class="pt-2">
            {{ listItem.keyword?.join() }}
          </td>
        </tr>
      </tbody>
    </table>
  </BorderBox>
  <BorderBox v-else>
    {{ $t("no_result") }}
  </BorderBox>
  <PaginationContainer
    v-model="page"
    :total-count="result.totalCount"
    :items-per-page="itemsPerPage"
  />
</template>
