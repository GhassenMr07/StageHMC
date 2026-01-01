<script lang="ts" setup>
import type { InputTypeHTMLAttribute } from "vue";
import IPDropdown from "~/components/General/IPDropdown.vue";

const input = defineModel<string>("input");
const selectedLeft = defineModel<string>("selectedLeft");
const selectedRight = defineModel<string>("selectedRight");

type Props = {
  dropdownLeftValues?: string[]
  dropdownRightValues?: string[]
  inputType?: InputTypeHTMLAttribute
};

const props = withDefaults(defineProps<Props>(), {
  dropdownLeftValues: () => [] as string[],
  dropdownRightValues: () => [] as string[],
  inputType: "text",
});

const emit = defineEmits(["change"]);
</script>

<template>
  <div class="flex flex-row flex-nowrap">
    <IPDropdown
      v-if="props.dropdownLeftValues.length"
      ref="IPDropDownLeft"
      v-model="selectedLeft"
      rounded-l
      :available-items="props.dropdownLeftValues"
      @update:model-value="emit('change')"
    />
    <input
      v-model="input"
      class="border-2 border-gray-300 h-6 flex-1 pl-1"
      :type="props.inputType"
      :class="{
        'rounded-l': !props.dropdownLeftValues.length,
        'rounded-r': !props.dropdownRightValues.length
      }"
      @change="emit('change')"
    />
    <IPDropdown
      v-if="props.dropdownRightValues.length"
      v-model="selectedRight"
      rounded-r
      :available-items="props.dropdownRightValues"
      @update:model-value="emit('change')"
    />
  </div>
</template>
