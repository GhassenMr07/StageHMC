<script setup lang="ts">
import {
  type JsonSchema7,
  isEnumControl,
  isStringControl,
  rankWith,
  schemaTypeIs,
  scopeEndIs,
  isBooleanControl
} from "@jsonforms/core";
import { JsonForms } from "@jsonforms/vue";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";

import JFApiForm from "~/components/MappingItem/IPJsonForm/JFApiForm.vue";
import JFArrayRenderer from "~/components/MappingItem/IPJsonForm/JFArrayRenderer.vue";
import JFBooleanRenderer from "~/components/MappingItem/IPJsonForm/JFBooleanRenderer.vue";
import JFContactForm from "~/components/MappingItem/IPJsonForm/JFContactForm.vue";
import JFDate from "~/components/MappingItem/IPJsonForm/JFDate.vue";
import JFDropdown from "~/components/MappingItem/IPJsonForm/JFDropdown.vue";
import JFIdentifier from "~/components/MappingItem/IPJsonForm/JFIdentifier.vue";
import JFRelatedCentre from "~/components/MappingItem/IPJsonForm/JFRelatedCentre.vue";
import JFResourceName from "~/components/MappingItem/IPJsonForm/JFResourceName.vue";
import JFTextarea from "~/components/MappingItem/IPJsonForm/JFTextarea.vue";
import { type IPBaseObject } from "~/utils/types/CommonProperties";

const data = defineModel<IPBaseObject>();

const jsonFormsChange = (event) => {
  data.value = event.data;
};

type Props = {
  schema?: JsonSchema7;
};

const { schema } = defineProps<Props>();

const fixSchema = (jsonSchema: JsonSchema7) => {
  const fixedSchema: JsonSchema7 = {
    ...jsonSchema,
    required: [
      ...(jsonSchema.required || []),
      ...(jsonSchema.definitions?.commonProperties.required || []),
    ],
    properties: {
      ...jsonSchema.definitions?.commonProperties.properties,
      ...jsonSchema.properties,
    },
  };
  delete fixedSchema.anyOf;
  delete fixedSchema.allOf;
  delete fixedSchema.definitions;
  delete fixedSchema.properties?.propertyNames;
  return fixedSchema;
};

const renderers = Object.freeze([
  ...vanillaRenderers,
  {
    renderer: JFApiForm,
    tester: rankWith(4, scopeEndIs("api")),
  },
  {
    renderer: JFArrayRenderer,
    tester: rankWith(3, schemaTypeIs("array")),
  },
  {
    renderer: JFBooleanRenderer,
    tester: rankWith(3, isBooleanControl),
  },
  {
    renderer: JFContactForm,
    tester: rankWith(4, scopeEndIs("contact")),
  },
  {
    renderer: JFDate,
    tester: rankWith(4, scopeEndIs("date")),
  },
  {
    renderer: JFDropdown,
    tester: rankWith(3, isEnumControl),
  },
  {
    renderer: JFIdentifier,
    tester: rankWith(4, scopeEndIs("identifier")),
  },
  {
    renderer: JFRelatedCentre,
    tester: rankWith(4, scopeEndIs("relatedHelmholtzCentre")),
  },
  {
    renderer: JFTextarea,
    tester: rankWith(2, isStringControl),
  },
  {
    renderer: JFResourceName,
    tester: rankWith(4, scopeEndIs("resourceName")),
  },
]);
</script>

<template>
  <JsonForms
    :data
    :schema="schema ? fixSchema(schema) : null"
    :renderers="renderers"
    @change="jsonFormsChange"
  />
</template>

<style>
main > * > * > * > * {
  border-bottom: 2px solid;
  border-color: #e5e7eb;
}

main > * > * > * > * > * > label {
  width: 25%;
}

main > * > * > * > * > * > * > * > label {
  width: 15%;
}

main > * > * > div.vertical-layout > div.vertical-layout-item {
  padding-bottom: 15px;
  margin-bottom: 15px;
}
</style>
