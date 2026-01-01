<script lang="ts" setup>
import { ArrowUpCircleIcon, ArrowDownCircleIcon, TrashIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["moveUp", "moveDown", "delete"]);

const { moveUpEnabled, moveDownEnabled, deleteEnabled } = defineProps({
  moveUpEnabled: {
    required: false,
    type: Boolean,
    default: true,
  },
  moveDownEnabled: {
    required: false,
    type: Boolean,
    default: true,
  },
  deleteEnabled: {
    required: false,
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div class="flex flex-row gap-2">
    <slot />
    <div class="text-h-dark-blue flex flex-row gap-1">
      <button
        :disabled="!moveUpEnabled"
        :class="{ 'text-hmc-grey': !moveUpEnabled }"
        type="button"
        @click="emit('moveUp')"
      >
        <ArrowUpCircleIcon class="h-6 w-6" />
      </button>
      <button
        :disabled="!moveDownEnabled"
        type="button"
        :class="{ 'text-hmc-grey': !moveDownEnabled }"
        @click="emit('moveDown')"
      >
        <ArrowDownCircleIcon class="h-6 w-6" />
      </button>
      <button
        :disabled="!deleteEnabled"
        :class="{ 'text-hmc-grey': !deleteEnabled }"
        type="button"
        @click="emit('delete')"
      >
        <TrashIcon class="h-6 w-6" />
      </button>
    </div>
  </div>
</template>
