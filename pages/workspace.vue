<script lang="ts" setup>
import { ref, onMounted } from "vue";
import WorkspacePanel from "~/components/WorkspacePanel.vue";
import { getProjects } from "~/composables/projects";

/**
 * WORKSPACE DATA FLOW EXPLANATION
 * ================================
 *
 * CURRENT IMPLEMENTATION (Local Mock API):
 * -----------------------------------------
 * 1. Page mounts → onMounted() hook runs
 * 2. Calls getProjects() from composables/projects.ts
 * 3. That composable makes HTTP GET request to: http://localhost:3000/api/projects
 * 4. Nuxt intercepts request and calls server/api/projects.ts
 * 5. Mock API returns hardcoded sample project data
 * 6. Frontend receives JSON and fills inbox array
 * 7. Vue reactivity updates the UI automatically
 *
 * WHEN BACKEND IS READY:
 * ----------------------
 * Same flow, but:
 * - Update API_BASE_URL in composables/projects.ts
 * - Points to: https://your-company-api.com
 * - Backend returns real project data
 * - Everything else stays the same!
 * - No changes needed to this file!
 */

interface WorkItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  status?: string;
}

// Loading state to show while fetching from API
const isLoading = ref(false);
const error = ref<string | null>(null);

// Three-panel workspace data
const inbox = ref<WorkItem[]>([]);
const working = ref<WorkItem[]>([]);
const outbox = ref<WorkItem[]>([]);

/**
 * Load projects from API on component mount
 * This function demonstrates the API integration pattern
 */
const loadProjects = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // Call the API through the composable
    // CURRENT: Uses local mock API (server/api/projects.ts)
    // FUTURE: Will use real backend API when available
    const { data, error: fetchError } = await getProjects();

    if (fetchError.value) {
      throw new Error("Failed to load projects from API");
    }

    if (data.value) {
      // Sort projects by status to populate panels
      inbox.value = data.value.filter(p => p.status === "inbox" || !p.status);
      working.value = data.value.filter(p => p.status === "working");
      outbox.value = data.value.filter(p => p.status === "outbox");
    }
  } catch (err) {
    console.error("Error loading projects:", err);
    error.value = err instanceof Error ? err.message : "An error occurred";
  } finally {
    isLoading.value = false;
  }
};

// Load projects when component mounts
onMounted(() => {
  loadProjects();
});

const newItemTitle = ref("");
const newItemDescription = ref("");

// Toggle to show the "Add New Task" section in the UI.
const showAddTask = ref(false);

const handleAddItem = () => {
  if (newItemTitle.value.trim()) {
    const newItem: WorkItem = {
      id: Date.now().toString(),
      title: newItemTitle.value,
      description: newItemDescription.value,
    };
    inbox.value.push(newItem);
    newItemTitle.value = "";
    newItemDescription.value = "";
  }
};

const handleItemDropped = (
  sourceArray: WorkItem[],
  targetArray: WorkItem[],
  item: WorkItem
) => {
  const index = sourceArray.findIndex(i => i.id === item.id);
  if (index !== -1) {
    sourceArray.splice(index, 1);
  }
  targetArray.push(item);
};

const handleItemRemoved = (
  array: WorkItem[],
  itemId: string
) => {
  const index = array.findIndex(i => i.id === itemId);
  if (index !== -1) {
    array.splice(index, 1);
  }
};
</script>

<template>
  <NuxtLayout name="main">
    <NuxtLoadingIndicator :height="5" />

    <!-- Error Message Display -->
    <div v-if="error" class="border-2 border-red-500 bg-red-50 p-4 mb-6 rounded-lg">
      <p class="text-red-700 font-semibold">
        Error loading projects: {{ error }}
      </p>
    </div>

    <!-- Page Title -->
    <h1 class="text-4xl font-bold mb-2">
      {{ $t("information_portal_name") }}
    </h1>
    <p class="text-hmc-grey mb-6">
      Workflow Management - Organize your sprint tasks
    </p>

    <!-- Loading State -->
    <div v-if="isLoading" class="border-2 border-hmc-grey p-6 mb-6 rounded-lg bg-hmc-grey-light text-center">
      <p class="text-hmc-grey">
        Loading projects from API...
      </p>
    </div>

    <!-- Add New Item Section (hidden by default) -->
    <div v-if="!isLoading && showAddTask" class="border-2 border-hmc-grey p-6 mb-6 rounded-lg bg-hmc-grey-light">
      <h2 class="text-xl font-bold mb-4 text-hmc-black">
        Add New Task
      </h2>
      <div class="space-y-3">
        <div>
          <input
            v-model="newItemTitle"
            type="text"
            placeholder="Task title..."
            class="w-full border border-hmc-grey p-2 rounded focus:outline-none focus:border-hmc-blue"
          />
        </div>
        <div>
          <input
            v-model="newItemDescription"
            type="text"
            placeholder="Task description..."
            class="w-full border border-hmc-grey p-2 rounded focus:outline-none focus:border-hmc-blue"
          />
        </div>
        <button
          class="bg-hmc-blue hover:bg-hmc-blue-dark text-white px-6 py-2 rounded font-semibold transition-colors"
          @click="handleAddItem"
        >
          Add to Inbox
        </button>
      </div>
    </div>

    <!-- Three Panel Workspace -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      <!-- Inbox Panel -->
      <WorkspacePanel
        title="Inbox"
        header-color="bg-hmc-blue"
        :items="inbox"
        @item-dropped="
          (item) => {
            if (working.find((i) => i.id === item.id)) {
              handleItemDropped(working, inbox, item);
            } else if (outbox.find((i) => i.id === item.id)) {
              handleItemDropped(outbox, inbox, item);
            }
          }
        "
        @item-removed="handleItemRemoved(inbox, $event)"
      />

      <!-- Working Panel -->
      <WorkspacePanel
        title="Working Zone"
        header-color="bg-amber-500"
        :items="working"
        @item-dropped="
          (item) => {
            if (inbox.find((i) => i.id === item.id)) {
              handleItemDropped(inbox, working, item);
            } else if (outbox.find((i) => i.id === item.id)) {
              handleItemDropped(outbox, working, item);
            }
          }
        "
        @item-removed="handleItemRemoved(working, $event)"
      />

      <!-- Outbox Panel -->
      <WorkspacePanel
        title="Outbox"
        header-color="bg-hmc-green"
        :items="outbox"
        @item-dropped="
          (item) => {
            if (inbox.find((i) => i.id === item.id)) {
              handleItemDropped(inbox, outbox, item);
            } else if (working.find((i) => i.id === item.id)) {
              handleItemDropped(working, outbox, item);
            }
          }
        "
        @item-removed="handleItemRemoved(outbox, $event)"
      />
    </div>
  </NuxtLayout>
</template>
