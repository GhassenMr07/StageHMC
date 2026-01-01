<script lang="ts" setup>
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/20/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot, provideUseId
} from "@headlessui/vue";
import type { IPDropdownEvents, IPDropdownItemWrapper, IPDropdownProps } from "./Types/IPDropdownProps.ts";

provideUseId(() => useId());

const props = withDefaults(defineProps<IPDropdownProps<unknown>>(), {
  availableItems: () => [] as Array<unknown>,
  compareItems: (a: unknown, b: unknown) => a === b,
  extractDisplayValue: (item: unknown) => item as string,
  filterItems: (a: unknown, b: string) =>
    (a as string)
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(b.toLowerCase().replace(/\s+/g, "")),
  roundedL: false,
  roundedR: false,
  bgWhite: false,
  disabled: false,
});

/* Define Events fired by IPCombobox */
const emit = defineEmits<IPDropdownEvents<unknown>>();

/* Wraps all items into the IPCombobox data structure */
const wrappedItems = computed<IPDropdownItemWrapper<unknown>[]>(() => {
  return props.availableItems.map((item) => {
    return {
      _value: item,
      _displayValue: props.extractDisplayValue(item),
    };
  });
});

const wrappedCompareItems = (a: unknown, b: unknown) => {
  return props.compareItems(
    (a as IPDropdownItemWrapper<unknown>)._value,
    (b as IPDropdownItemWrapper<unknown>)._value
  );
};

/* Vue construct to use v-model on this component
 * Get: calculates which item should be shown as selected based on the value passed through the props
 * Set: return the user-selected item by firing an event
 */
const selectedModel = computed({
  get() {
    return wrappedItems.value.find((item) => {
      return props.compareItems(item._value, props.modelValue);
    }) ?? { _value: "", _displayValue: "" };
  },
  set(val: IPDropdownItemWrapper<unknown>) {
    emit("update:modelValue", val?._value);
  },
});

/* Initialize search text with empty string */
const searchText = ref("");

/* Filters the items according to the user's search input */
const filteredItems = computed(() => {
  return searchText.value === ""
    ? wrappedItems.value
    : wrappedItems.value.filter(wrappedItem =>
      props.filterItems(wrappedItem._value, searchText.value)
    );
});

/* Computed length of filteredItems list */
const filteredItemsLength = computed(() => filteredItems.value.length);
/* Computed number of grid columns for dropdown menu */
const numDropdownGridCols = computed<number>(() => {
  const numItems = filteredItemsLength.value;
  if (numItems < 6 || numItems > 60) {
    return 1;
  }

  return Math.ceil(Math.sqrt(numItems));
});

const dropDownWidth = () => {
  const stringLength: number[] = [];
  props.availableItems.forEach((item) => {
    stringLength.push(props.extractDisplayValue(item).length);
  });
  stringLength.sort((a, b) => a - b);
  const sliceLimit = Math.floor(0.1 * stringLength.length);
  stringLength.splice(-sliceLimit, sliceLimit);
  return Math.max(4, Math.ceil(Math.max(...stringLength)));
};
</script>

<template>
  <Combobox v-model="selectedModel" :by="wrappedCompareItems" nullable :disabled="props.disabled">
    <div class="flex flex-nowrap">
      <ComboboxInput
        class="w-[var(--customPadding)] truncate px-1"
        :style="`--customPadding:${dropDownWidth()}ch`"
        :class="{
          'bg-white': props.bgWhite && !props.disabled,
          'bg-gray-300': !props.bgWhite || props.disabled,
          'border-2 border-gray-300': props.bgWhite,
          'rounded-l': props.roundedL,
          'rounded-r': props.disabled,
        }"
        :display-value="(item: any) =>
          item?._displayValue"
        @change="searchText = $event.target.value"
        @focus="$event.target.select()"
      />
      <ComboboxButton
        v-if="!props.disabled"
        class="flex items-center px-1 bg-gray-300"
        :class="{
          'rounded-r': props.roundedR,
        }"
      >
        <ChevronDownIcon class="h-5 w-5" />
      </ComboboxButton>
      <TransitionRoot
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
        @after-leave="searchText = ''"
      >
        <ComboboxOptions
          class="absolute mt-1 max-h-60 w-max max-w-screen-lg overflow-auto z-10 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm bg-opacity-80 backdrop-blur-sm"
          :class="{
            'grid grid-cols-3': Math.abs(numDropdownGridCols - 3) < 0.1,
            'grid grid-cols-4': Math.abs(numDropdownGridCols - 4) < 0.1,
            'grid grid-cols-5':
              Math.abs(numDropdownGridCols - 5) < 0.1 ||
              Math.abs(numDropdownGridCols - 6) < 0.1,
          }"
        >
          <div
            v-if="filteredItemsLength === 0 && searchText !== ''"
            class="relative cursor-default select-none py-2 px-4 text-gray-700"
          >
            {{ $t("ip_dropdown_empty") }}
          </div>

          <ComboboxOption
            v-for="(item, idx) in filteredItems"
            :key="idx"
            v-slot="{ selected, active }"
            as="template"
            :value="item"
          >
            <li
              class="relative cursor-default select-none py-2 pl-10 pr-4"
              :class="{
                'bg-hmc-green text-white': active,
                'text-gray-900': !active,
              }"
            >
              <span
                class="block"
                :class="{ 'font-medium': selected, 'font-normal': !selected }"
              >
                {{ item._displayValue }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="{ 'text-white': active, 'text-hmc-green': !active }"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>
