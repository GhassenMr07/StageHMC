<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import {
  type ControlElement,
  createDefaultValue,
  type JsonSchema,
  Resolve
} from "@jsonforms/core";
import {
  rendererProps,
  useJsonFormsArrayControl,
  useJsonFormsControl
} from "@jsonforms/vue";

import IPContactForm, {
  type Contact
} from "~/components/MappingItem/IPJsonForm/IPContactForm.vue";
import JFAddButton from "~/components/MappingItem/IPJsonForm/JFAddButton.vue";
import JFArrayItemRenderer from "~/components/MappingItem/IPJsonForm/JFArrayRenderer/JFArrayItemRenderer.vue";

const props = defineProps({ ...rendererProps<ControlElement>() });
const { control, moveUp, moveDown, removeItems, addItem } =
  useJsonFormsArrayControl(props);
const { handleChange } = useJsonFormsControl(props);

const contacts = computed<Contact[]>(() =>
  control.value.data ? control.value.data : []
);

const contactRoles = computed(
  () => control.value.schema?.properties?.contactRole.enum || []
);

const contactIdentifiers = computed(
  () => control.value.schema?.properties?.contactIdentifierSystem.enum || []
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

const update = () => {
  handleChange(control.value.path, control.value.data);
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
      <Disclosure
        v-for="(contact, index) in contacts"
        v-slot="{ open }"
        :key="index"
      >
        <JFArrayItemRenderer
          class="mb-4"
          :move-up-enabled="control.enabled && index > 0"
          :move-down-enabled="control.enabled && index < contacts.length - 1"
          :delete-enabled="control.enabled && !minItemsReached"
          @move-up="() => moveUp?.(control.path, index)()"
          @move-down="() => moveDown?.(control.path, index)()"
          @delete="() => removeItems?.(control.path, [index])()"
        >
          <DisclosureButton
            class="flex flex-1 w-full justify-between rounded-lg bg-hmc-grey px-4 py-2 text-left text-sm font-medium accent-hmc-black hover:bg-hmc-blue-light focus:outline-none focus-visible:ring"
          >
            <span>{{
              contact.contactName ||
                contact.contactUri ||
                $t("emptyContactName")
            }}</span>
            <ChevronDownIcon
              :class="open ? 'rotate-180 transform' : ''"
              class="h-5 w-5"
            />
          </DisclosureButton>
        </JFArrayItemRenderer>
        <DisclosurePanel
          class="pl-2 pb-2 text-sm text-gray-500 "
        >
          <IPContactForm
            v-model="contacts[index]"
            :contact-identifier-systems="contactIdentifiers"
            :contact-roles="contactRoles"
            @change="update"
          />
        </DisclosurePanel>
      </Disclosure>
      <JFAddButton
        :disabled="!control.enabled || maxItemsReached"
        @click="addButtonClick"
      >
        + {{ control.label }}
      </JFAddButton>
    </div>
  </div>
</template>
