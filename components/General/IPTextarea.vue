<script setup lang="ts">
const text = defineModel<string>();

type Props = {
  roundedL?: boolean;
  roundedR?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  roundedL: true,
  roundedR: true,
});

const emit = defineEmits(["change"]);

// gives maximum 20 lines, but otherwise it depends on the number of characters and on the number of linebreaks
const calcNumTextLines = (text: string): number => {
  const newlineMatches = text.match(/\n/g);

  const numCharacters = text.length;
  const numNewlines = newlineMatches ? newlineMatches.length : 0;

  return Math.min(20, Math.max(Math.ceil(numCharacters / 50), numNewlines + 1));
};

const maxNumTextLines = ref(text.value ? calcNumTextLines(text.value) : 1);

const setNumTextLines = (event: Event) => {
  if (!event.target) {
    console.error(
      "Missing textarea in change event for setting text line number."
    );
    maxNumTextLines.value = 1;
    return;
  }

  const textarea = event.target as HTMLTextAreaElement;
  maxNumTextLines.value = Math.max(
    maxNumTextLines.value,
    calcNumTextLines(textarea.value)
  );
};
</script>

<template>
  <textarea
    v-model="text"
    class="px-1 border-2 border-gray-300 w-96 flex-1"
    :class="{
      'rounded-l': props.roundedL,
      'rounded-r': props.roundedR,
      'resize-none': maxNumTextLines <= 1,
      resize: maxNumTextLines > 1,
    }"
    :rows="maxNumTextLines"
    @change="emit('change')"
    @input="setNumTextLines"
  />
</template>
