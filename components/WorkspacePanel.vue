<script lang="ts" setup>
import { ref, computed } from "vue";

interface WorkItem {
  id: string;
  title: string;
  description: string;
}

interface PanelProps {
  title: string;
  headerColor: string;
  items: WorkItem[];
}

const props = defineProps<PanelProps>();

const emit = defineEmits<{
  "item-dropped": [item: WorkItem];
  "item-removed": [itemId: string];
}>();

const dragOver = ref(false);

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  dragOver.value = true;
};

const handleDragLeave = () => {
  dragOver.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  dragOver.value = false;

  const data = e.dataTransfer?.getData("application/json");
  if (data) {
    try {
      const item = JSON.parse(data);
      emit("item-dropped", item);
    } catch (error) {
      console.error("Error parsing dragged item", error);
    }
  }
};

const handleDragStart = (item: WorkItem, e: DragEvent) => {
  e.dataTransfer!.effectAllowed = "move";
  e.dataTransfer!.setData("application/json", JSON.stringify(item));

  // Create a custom drag image showing only this item
  const dragImage = document.createElement("div");
  dragImage.className = "bg-white border border-hmc-grey p-3 rounded shadow-lg";
  dragImage.style.position = "absolute";
  dragImage.style.left = "-9999px";
  dragImage.textContent = item.title;
  document.body.appendChild(dragImage);

  e.dataTransfer!.setDragImage(dragImage, 0, 0);

  // Clean up the temporary element after drag starts
  setTimeout(() => document.body.removeChild(dragImage), 0);
};

const itemCount = computed(() => props.items.length);
</script>

<template>
  <div class="flex flex-col h-full border-2 border-hmc-grey rounded-lg overflow-hidden">
    <!-- Header -->
    <div :class="headerColor" class="text-white p-4 flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold">
          {{ title }}
        </h2>
        <p class="text-sm opacity-90">
          {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
        </p>
      </div>
      <slot name="header-action" />
    </div>

    <!-- Content Area -->
    <div
      :class="{ 'bg-hmc-grey-light border-dashed border-2 border-hmc-blue': dragOver }"
      class="flex-1 overflow-y-auto p-4 space-y-3 transition-colors"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div
        v-if="items.length === 0"
        class="h-full flex items-center justify-center text-hmc-grey"
      >
        <p class="text-center">
          {{ dragOver ? 'Drop items here' : 'No items yet' }}
        </p>
      </div>

      <div
        v-for="item in items"
        :key="item.id"
        draggable="true"
        class="bg-white border border-hmc-grey p-3 rounded cursor-move hover:shadow-md transition-shadow hover:border-hmc-blue"
        @dragstart="handleDragStart(item, $event)"
      >
        <div class="flex justify-between items-start gap-2">
          <div class="flex-1">
            <h3 class="font-semibold text-hmc-black text-sm">
              {{ item.title }}
            </h3>
            <p class="text-xs text-hmc-grey mt-1">
              {{ item.description }}
            </p>
          </div>
          <button
            class="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
            aria-label="Remove item"
            @click="emit('item-removed', item.id)"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
div::-webkit-scrollbar {
  width: 8px;
}

div::-webkit-scrollbar-track {
  background: #f1f1f1;
}

div::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

div::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
