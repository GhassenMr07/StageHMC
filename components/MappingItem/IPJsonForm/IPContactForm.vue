<script setup lang="ts">
import IPDropdown from "~/components/General/IPDropdown.vue";
import IPTextarea from "~/components/General/IPTextarea.vue";
import InputWithIPDropdown from "~/components/General/InputWithIPDropdown.vue";

export type Contact = {
  contactName?: string;
  contactIdentifier?: string;
  contactIdentifierSystem?: string;
  contactUri?: string;
  contactRole?: string;
};

const contact = defineModel<Contact>({ required: true });

type Props = {
  contactIdentifierSystems: string[];
  contactRoles: string[];
};

const props = defineProps<Props>();
const emit = defineEmits(["change"]);
</script>

<template>
  <div class="pl-4 grid grid-cols-5 gap-y-2 mb-4">
    {{ $t("contactName") }}
    <IPTextarea v-model="contact.contactName" class="col-span-4" @change="emit('change')" />
    {{ $t("contactIdentifier") }}
    <InputWithIPDropdown
      v-model:input="contact.contactIdentifier"
      v-model:selected-left="contact.contactIdentifierSystem"
      :dropdown-left-values="props.contactIdentifierSystems"
      class="col-span-4"
      @change="emit('change')"
    />
    {{ $t("contactUri") }}
    <IPTextarea v-model="contact.contactUri" class="col-span-4" @change="emit('change')" />
    {{ $t("contactRole") }}
    <IPDropdown
      v-model="contact.contactRole"
      :available-items="props.contactRoles"
      :bg-white="true"
      class="col-span-4"
      @update:model-value="emit('change')"
    />
  </div>
</template>
