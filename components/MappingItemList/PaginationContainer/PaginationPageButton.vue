<script lang="ts" setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  }
});
</script>

<template>
  <div
    :class="{'pointer-events-none bg-hmc-grey font-bold' : props.disabled}"
    class="h-11 px-2 border border-hmc-blue-dark rounded-lg text-hmc-blue-dark flex items-center justify-center select-none hover:bg-hmc-blue-light hover:text-white hover:cursor-pointer"
  >
    <slot />
  </div>
</template>
