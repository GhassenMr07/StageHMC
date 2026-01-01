<script setup lang="ts">
import { rendererProps, useJsonFormsArrayControl, useJsonFormsControl } from "@jsonforms/vue";
import { type ControlElement, createDefaultValue, type JsonSchema, Resolve } from "@jsonforms/core";
import JFArrayItemRenderer from "~/components/MappingItem/IPJsonForm/JFArrayRenderer/JFArrayItemRenderer.vue";
import InputWithIPDropdown from "~/components/General/InputWithIPDropdown.vue";
import JFAddButton from "~/components/MappingItem/IPJsonForm/JFAddButton.vue";

const props = defineProps({
  ...rendererProps<ControlElement>(),
});
const { control, addItem, moveUp, moveDown, removeItems } = useJsonFormsArrayControl(props);
const { handleChange } = useJsonFormsControl(props);

const dateTypes = computed((): string[] =>
  control.value.schema.properties?.dateType.enum || []
);

type dateType = typeof dateTypes.value[number];

type Date = {
  resourceDate: string,
  dateType?: dateType
}

const dates = computed<Date[]>(() =>
  control.value.data ? control.value.data : []
);

const arraySchema = computed<JsonSchema | undefined>(() =>
  Resolve.schema(
    control.value.schema,
    control.value.uischema.scope,
    control.value.rootSchema
  )
);

const maxItemsReached = computed<boolean | undefined>(
  () =>
    arraySchema.value !== undefined &&
        arraySchema.value?.maxItems !== undefined &&
        control.value.data !== undefined &&
        control.value.data.length >= arraySchema.value?.maxItems
);

const minItemsReached = computed<boolean | undefined>(
  () =>
    arraySchema.value !== undefined &&
        arraySchema.value?.minItems !== undefined &&
        control.value.data !== undefined &&
        control.value.data.length <= arraySchema.value?.minItems
);

const update = (index: number, newDate: Date) => {
  const newDates = dates.value;
  newDates.splice(index, 1, newDate);
  handleChange(control.value.path, newDates);
};

const addButtonClick = () => {
  addItem(
    control.value.path,
    createDefaultValue(control.value.schema, control.value.rootSchema)
  )();
};

</script>
<template>
  <div class="flex flex-row">
    <label class="text-h-dark-blue-500">
      {{ control.label }}
    </label>
    <div class="flex flex-col">
      <JFArrayItemRenderer
        v-for="(date,index) in dates"
        :key="index"
        class="mb-4"
        :move-up-enabled="control.enabled && index > 0"
        :move-down-enabled="
          control.enabled && index < dates.length - 1
        "
        :delete-enabled="control.enabled && !minItemsReached"
        @move-up="() => moveUp?.(control.path, index)()"
        @move-down="() => moveDown?.(control.path, index)()"
        @delete="() => removeItems?.(control.path, [index])()"
      >
        <InputWithIPDropdown
          v-model:input="date.resourceDate"
          v-model:selected-left="date.dateType"
          :dropdown-left-values="dateTypes"
          input-type="date"
          @change="() => update(index, date)"
        />
      </JFArrayItemRenderer>
      <JFAddButton
        :disabled="!control.enabled || maxItemsReached"
        @click="addButtonClick"
      >
        + {{ control.label }}
      </JFAddButton>
    </div>
  </div>
</template>
