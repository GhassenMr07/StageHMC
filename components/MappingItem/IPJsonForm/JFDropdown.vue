<script lang="ts" setup>
import { rendererProps, useJsonFormsEnumControl } from "@jsonforms/vue";
import { type ControlElement, type EnumOption } from "@jsonforms/core";
import IPDropdown from "~/components/General/IPDropdown.vue";

const props = defineProps({
  ...rendererProps<ControlElement>(),
});
const { control, handleChange } = useJsonFormsEnumControl(props);
const disabled = computed(() => {
  return control.value.path === "mappingCategory";
});

type JFDropdownOption = EnumOption;

const selectedDropdownOption = ref<JFDropdownOption | undefined>(undefined);
watchEffect(() => {
  selectedDropdownOption.value = control.value.options?.find(
    option => option.value === (control.value.data as string)
  );
});

const update = (newSelectedDropdownOption: unknown) => {
  const res = (newSelectedDropdownOption as JFDropdownOption)?.value;
  handleChange(control.value.path, res);
};

const compareItems = (a: unknown, b: unknown) => (a as JFDropdownOption)?.value === (b as JFDropdownOption)?.value;
</script>

<template>
  <div class="flex flex-row items-center">
    <label class="text-h-dark-blue-500">
      {{ control.label }}
    </label>
    <IPDropdown
      v-model="selectedDropdownOption"
      class="inline-block"
      :available-items="control.options"
      :compare-items="compareItems"
      :extract-display-value="(item: unknown) => (item as JFDropdownOption).label"
      :filter-items="(item: unknown, filter: string) =>
        (item as JFDropdownOption).label
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(filter.toLowerCase().replace(/\s+/g, ''))"
      rounded-l
      bg-white
      :disabled="disabled"
      @update:model-value="update"
    />
  </div>
</template>
