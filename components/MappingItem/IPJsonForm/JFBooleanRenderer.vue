<script setup lang="ts">
import type { ControlElement } from "@jsonforms/core";
import { rendererProps, useJsonFormsControl } from "@jsonforms/vue";

const props = defineProps({
  ...rendererProps<ControlElement>(),
});

const { control, handleChange } = useJsonFormsControl(props);
</script>

<template>
  <div class="flex flew-row">
    <label class="text-h-dark-blue-500">
      {{ control.label }}
    </label>
    <input
      type="checkbox"
      :checked="control.data"
      @change="handleChange(control.path, !control.data)"
    />
  </div>
</template>
