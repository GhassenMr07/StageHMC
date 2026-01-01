<script lang="ts" setup>
import {
  composePaths,
  createDefaultValue,
  type ControlElement,
  Resolve,
  type JsonSchema
} from "@jsonforms/core";
import { DispatchRenderer, rendererProps, useJsonFormsArrayControl } from "@jsonforms/vue";
import { useVanillaArrayControl } from "@jsonforms/vue-vanilla";

import JFAddButton from "~/components/MappingItem/IPJsonForm/JFAddButton.vue";
import JFArrayItemRenderer from "~/components/MappingItem/IPJsonForm/JFArrayRenderer/JFArrayItemRenderer.vue";

const props = defineProps({
  ...rendererProps<ControlElement>(),
});

const { control, childUiSchema, addItem, moveDown, moveUp, removeItems } = useVanillaArrayControl(
  useJsonFormsArrayControl(props)
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

const addButtonClick = () => {
  addItem(control.value.path, createDefaultValue(control.value.schema, control.value.rootSchema))();
};
</script>

<template>
  <div class="flex flex-row">
    <label class="text-h-dark-blue-500">
      {{ control.label }}
    </label>
    <div v-if="control.visible">
      <div
        v-for="(element, index) in control.data"
        :key="`${control.path}-${element}`"
        class="mb-4"
      >
        <JFArrayItemRenderer
          :move-up-enabled="control.enabled && index > 0"
          :move-down-enabled="control.enabled && index < control.data.length - 1"
          :delete-enabled="control.enabled && !minItemsReached"
          @move-up="() => moveUp?.(control.path, index)()"
          @move-down="() => moveDown?.(control.path, index)()"
          @delete="() => removeItems?.(control.path, [index])()"
        >
          <DispatchRenderer
            :schema="control.schema"
            :uischema="childUiSchema"
            :path="composePaths(control.path, `${index}`)"
            :enabled="control.enabled"
            :renderers="control.renderers"
            :cells="control.cells"
          />
        </JFArrayItemRenderer>
      </div>

      <JFAddButton :disabled="!control.enabled || maxItemsReached" @click="addButtonClick">
        + {{ control.label }}
      </JFAddButton>
    </div>
  </div>
</template>
