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

const languages = computed((): string[] =>
  control.value.schema?.properties?.nameLanguage.enum || []
);

const nameTypes = computed((): string[] =>
  control.value.schema?.properties?.nameType.enum || []
);

type NameType = typeof nameTypes.value[number];
type Language = typeof languages.value[number];

type Resource = {
  name: string,
  nameType: NameType,
  nameLanguage?: Language
}

const resources = computed<Resource[]>(() =>
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
const update = (index: number, newResource: Resource) => {
  const newResources = resources.value;
  newResources.splice(index, 1, newResource);
  handleChange(control.value.path, newResources);
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
        v-for="(resource,index) in resources"
        :key="index"
        class="mb-4"
        :move-up-enabled="control.enabled && index > 0"
        :move-down-enabled="
          control.enabled && index < resources.length - 1
        "
        :delete-enabled="control.enabled && !minItemsReached"
        @move-up="() => moveUp?.(control.path, index)()"
        @move-down="() => moveDown?.(control.path, index)()"
        @delete="() => removeItems?.(control.path, [index])()"
      >
        <InputWithIPDropdown
          v-model:input="resource.name"
          v-model:selected-left="resource.nameType"
          v-model:selected-right="resource.nameLanguage"
          :dropdown-left-values="nameTypes"
          :dropdown-right-values="languages"
          @change="() => update(index, resource)"
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
