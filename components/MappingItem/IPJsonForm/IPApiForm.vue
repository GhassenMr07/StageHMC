<script setup lang="ts">
import IPDropdown from "~/components/General/IPDropdown.vue";
import IPTextarea from "~/components/General/IPTextarea.vue";
import InputWithIPDropdown from "~/components/General/InputWithIPDropdown.vue";

type Api = {
  apiProtocol?: string;
  apiBaseUri?: string;
  apiDocumentationUri?: string;
};

const api = defineModel<Api>({ required: true });

type Props = {
  apiProtocols: string[];
};

const props = defineProps<Props>();
const emit = defineEmits(["change"]);
</script>

<template>
  <div class="pl-4 grid grid-cols-5 gap-y-2 mb-4">
    {{ $t("apiProtocol") }}
    <IPDropdown
      v-model="api.apiProtocol"
      :available-items="props.apiProtocols"
      :bg-white="true"
      class="col-span-4"
      @update:model-value="emit('change')"
    />
    {{ $t("apiBaseUri") }}
    <InputWithIPDropdown
      v-model:input="api.apiBaseUri"
      class="col-span-4"
      @change="emit('change')"
    />
    {{ $t("apiDocumentationUri") }}
    <IPTextarea v-model="api.apiDocumentationUri" class="col-span-4" @change="emit('change')" />
  </div>
</template>
