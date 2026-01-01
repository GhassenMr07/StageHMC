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

const identifierTypes = computed((): string[] =>
  control.value.schema.properties?.identifierType.enum || []
);

type identifierType = typeof identifierTypes.value[number];

type Identifier = {
  id: string,
  identifierType?: identifierType
}

const identifiers = computed<Identifier[]>(() =>
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

const update = (index: number, newIdentifier: Identifier) => {
  const newIdentifiers = identifiers.value;
  newIdentifiers.splice(index, 1, newIdentifier);
  handleChange(control.value.path, newIdentifiers);
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
        v-for="(identifier,index) in identifiers"
        :key="index"
        class="mb-4"
        :move-up-enabled="control.enabled && index > 0"
        :move-down-enabled="
          control.enabled && index < identifiers.length - 1
        "
        :delete-enabled="control.enabled && !minItemsReached"
        @move-up="() => moveUp?.(control.path, index)()"
        @move-down="() => moveDown?.(control.path, index)()"
        @delete="() => removeItems?.(control.path, [index])()"
      >
        <InputWithIPDropdown
          v-model:input="identifier.id"
          v-model:selected-left="identifier.identifierType"
          :dropdown-left-values="identifierTypes"
          @change="() => update(index, identifier)"
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
