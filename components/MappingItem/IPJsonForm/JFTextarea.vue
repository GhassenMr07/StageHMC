<script setup lang="ts">
import { rendererProps, useJsonFormsControl } from "@jsonforms/vue";
import type { ControlElement } from "@jsonforms/core";
import IPTextarea from "~/components/General/IPTextarea.vue";

const props = defineProps({
  ...rendererProps<ControlElement>(),
});
const { control, handleChange } = useJsonFormsControl(props);
const text = ref(control.value.data);
// const text = computed({
//   get: () => control.value.data,
//   set: newValue => handleChange(control.value.path, newValue),
// });

const update = () => {
  handleChange(control.value.path, text.value);
};
</script>

<template>
  <div class="flex flew-row">
    <label class="text-h-dark-blue-500">
      {{ control.label }}
    </label>
    <IPTextarea v-model.lazy="text" @change="update" />
  </div>
</template>
