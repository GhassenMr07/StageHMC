<script lang="ts" setup>
import PaginationPageButton from "~/components/MappingItemList/PaginationContainer/PaginationPageButton.vue";

const currentPage = defineModel<number>({
  default: 0
});

const props = defineProps({
  totalCount: {
    type: Number,
    required: true,
    default: 0,
  },
  itemsPerPage: {
    type: Number,
    required: true,
    default: 20,
  },
});

/** Determines how many pages must at least exists to allow pagination by pageInput element */
const minPagesForPageInput = 3;

/** Calculate maximum number of pages */
const totalPages = computed(() => {
  return Math.ceil(props.totalCount / props.itemsPerPage);
});

/** Calculates the number of the next page, if next page would be greater than totalPages 'null' is returned */
const nextPage = computed(() => {
  return currentPage.value + 1 > totalPages.value
    ? null
    : currentPage.value + 1;
});

/** Calculates the number of the previous page, if previous page would be lower than 1 'null' is returned */
const prevPage = computed(() => {
  return currentPage.value - 1 < 1 ? null : currentPage.value - 1;
});

/** Indicates if the pageInput element is shown ('true') or the pageInfo element ('false') */
const showPageInputElement = ref<boolean>(false);
/** References the pageInput element for autofocus and text selection */
const pageInputRef = ref<HTMLInputElement>();

/** If clicking on pageInfo element, the element hides and the pageInput element is shown */
const clickOnPageInfoHandler = async () => {
  if (totalPages.value < minPagesForPageInput) {
    return;
  }
  showPageInputElement.value = true;
  await nextTick(() => {
    if (pageInputRef.value) {
      pageInputRef.value.focus();
      pageInputRef.value.select();
    }
  });
};

/** Register outside click handler */
onMounted(() => {
  if (process.client) {
    document.addEventListener("click", boundingBoxClickHandler);
  }
});
/** Deregister outside click handler */
onUnmounted(() => {
  if (process.client) {
    document.removeEventListener("click", boundingBoxClickHandler);
  }
});

/** Handler for the outside click event */
const boundingBoxClickHandler = (e: MouseEvent) => {
  if (
    showPageInputElement.value &&
    isClickOutSideOfPageInputRefContainer(e.clientX, e.clientY)
  ) {
    showPageInputElement.value = false;
  }
};

/** Checks if a mouse-click is made outside the pageInput element */
const isClickOutSideOfPageInputRefContainer = (cX: number, cY: number) => {
  const bbox = pageInputRef.value!.getBoundingClientRect();
  return !(
    cX >= bbox.x && // check left
    cX <= bbox.x + bbox.width && // check right
    cY >= bbox.y && // check top
    cY <= bbox.y + bbox.height
  );
};

/** handle input given by the pageInput element...do page changes programmatically */
const handlePageInputChange = (e: Event) => {
  const el = e.target as HTMLInputElement;
  const newPage = parseInt(el.value);
  if (newPage < 1 || newPage > totalPages.value) {
    return;
  }
  showPageInputElement.value = false;
  currentPage.value = newPage;
};
</script>

<template>
  <div v-show="totalPages > 1" class="flex flex-wrap flex-row w-full justify-center lg:gap-x-14 gap-3">
    <PaginationPageButton
      :disabled="currentPage === 1"
      :title="$t('first_page')"
      @click.stop="currentPage=1"
    >
      |&lsaquo;&lsaquo;
      <span class="md:inline-block hidden">{{ $t("first_page") }}</span>
    </PaginationPageButton>
    <PaginationPageButton
      v-show="totalPages > 1"
      :disabled="prevPage === null"
      :title="$t('prev_page')"
      @click.stop="currentPage--"
    >
      &lsaquo; <span class="md:inline-block hidden">{{ $t("prev_page") }}</span>
    </PaginationPageButton>
    <input
      v-if="showPageInputElement"
      ref="pageInputRef"
      class="block w-24 rounded-lg focus-hmc-blue-dark text-center"
      type="number"
      :value="currentPage"
      min="1"
      :max="totalPages"
      step="1"
      @change.prevent="handlePageInputChange"
    />
    <div
      v-else
      class="py-2 h-11 cursor-default select-none w-24 text-center"
      :class="{
        'cursor-pointer border border-hmc-blue-dark rounded-lg hover:bg-hmc-blue-light':
          totalPages > minPagesForPageInput,
      }"
      :title="$t('page_info', { currentPage, totalPages })"
      @click.stop="clickOnPageInfoHandler"
    >
      {{ `${currentPage} / ${totalPages}` }}
    </div>
    <PaginationPageButton
      :disabled="nextPage === null"
      :title="$t('next_page')"
      @click.stop="currentPage++"
    >
      <span class="md:inline-block hidden">{{ $t("next_page") }}</span> &rsaquo;
    </PaginationPageButton>
    <PaginationPageButton
      :disabled="currentPage === totalPages"
      :title="$t('last_page')"
      @click.prevent="currentPage=totalPages"
    >
      <span class="md:inline-block hidden">{{ $t("last_page") }}</span>
      &rsaquo;&rsaquo;|
    </PaginationPageButton>
  </div>
</template>
