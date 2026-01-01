<script setup lang="ts">
import { type ControlElement, createDefaultValue, type JsonSchema, Resolve } from "@jsonforms/core";
import { rendererProps, useJsonFormsArrayControl, useJsonFormsControl } from "@jsonforms/vue";

import IPDropdown from "~/components/General/IPDropdown.vue";
import JFAddButton from "~/components/MappingItem/IPJsonForm/JFAddButton.vue";
import JFArrayItemRenderer from "~/components/MappingItem/IPJsonForm/JFArrayRenderer/JFArrayItemRenderer.vue";

const props = defineProps({
  ...rendererProps<ControlElement>(),
});
const { control, addItem, moveUp, moveDown, removeItems } = useJsonFormsArrayControl(props);
const { handleChange } = useJsonFormsControl(props);

const centers = computed(
  (): string[] => control.value.schema.properties?.helmholtzCentre.enum || []
);

const relationTypes = computed(
  (): string[] => control.value.schema.properties?.relationType.enum || []
);

type Center = (typeof centers.value)[number];
type RelationType = (typeof relationTypes.value)[number];

type RelatedCenter = {
  helmholtzCentre: Center;
  relationType?: RelationType;
};

const relatedCenters = computed<RelatedCenter[]>(() =>
  control.value.data ? control.value.data : []
);

const arraySchema = computed<JsonSchema | undefined>(() =>
  Resolve.schema(control.value.schema, control.value.uischema.scope, control.value.rootSchema)
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

const update = () => {
  handleChange(control.value.path, control.value.data);
};

const addButtonClick = () => {
  addItem(control.value.path, createDefaultValue(control.value.schema, control.value.rootSchema))();
};
</script>
<template>
  <div class="flex flex-row">
    <label class="text-h-dark-blue-500">
      {{ control.label }}
    </label>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-4 gap-2">
        <div class="col-span-1">
          {{ $t("relatedHelmholtzCentre") }}
        </div>
        <div class="col-span-2">
          {{ $t("relationType") }}
        </div>
        <div class="col-span-1" />
        <template v-for="(relatedCenter, index) in relatedCenters" :key="index">
          <IPDropdown
            v-model="relatedCenter.helmholtzCentre"
            rounded-l
            :available-items="centers"
            bg-white
            class="col-span-1"
            @update:model-value="update"
          />
          <IPDropdown
            v-model="relatedCenter.relationType"
            rounded-l
            bg-white
            :available-items="relationTypes"
            class="col-span-2 w-max"
            @update:model-value="update"
          />
          <JFArrayItemRenderer
            :move-up-enabled="control.enabled && index > 0"
            :move-down-enabled="control.enabled && index < relatedCenters.length - 1"
            :delete-enabled="control.enabled && !minItemsReached"
            class="col-span-1"
            @move-up="() => moveUp?.(control.path, index)()"
            @move-down="() => moveDown?.(control.path, index)()"
            @delete="() => removeItems?.(control.path, [index])()"
          />
        </template>
      </div>

      <JFAddButton :disabled="!control.enabled || maxItemsReached" @click="addButtonClick">
        + {{ control.label }}
      </JFAddButton>
    </div>
  </div>
</template>

<style>
td {
  width: auto;
}
td + td + td {
  width: 20%;
}
</style>
