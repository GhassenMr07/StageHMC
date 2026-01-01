<script setup lang="ts">
import type { JsonSchema7 } from "@jsonforms/core";
import BorderBox from "~/components/General/BorderBox.vue";
import IPButton from "~/components/General/IPButton.vue";
import LoginForm from "~/components/MappingItem/LoginForm.vue";
import ErrorInfoBox from "~/components/MappingItem/ErrorInfoBox.vue";
import IPJsonForms from "~/components/MappingItem/IPJsonForms.vue";
import { createItem, patchItem, validate } from "~/composables/api";
import type { IPBaseObject } from "~/utils/types/CommonProperties";

const item = defineModel<IPBaseObject>("item", { required: true });
const { schema } = defineProps<{ schema: JsonSchema7 }>();

const itemSchema = computed(() => item.value?.mappingCategory ?? "");
const validationFailed = ref(false);
const validationPending = ref(true);
const showErrorInfoBox = ref(false);
const userToken = ref(localStorage.getItem("authToken") || "");
const errorMessages = ref<string[]>([]);
const showLoginForm = ref(false);

type ErrorDetail = {
  "Document Type": string;
  "Schema Version": string;
  "Exception Type": string;
  "Exception Message": string;
  "Property impacted": string;
};

type ErrorType = {
  statusCode: number;
  data: { detail: ErrorDetail[] | string };
};

const closeLoginForm = async () => {
  showLoginForm.value = false;
  if (userToken.value) {
    await saveItem();
  }
};

const handleItemSave = async () => {
  if (item.value._id === "") {
    const response = await createItem(item.value, userToken.value);
    await useRouter().push(useLocalePath()("/MappingItem/" + response._id));
  } else {
    await patchItem(item.value, userToken.value);
  }
};

const saveItem = async () => {
  validationPending.value = true;

  if (!userToken.value) {
    showLoginForm.value = true;
    return;
  }

  try {
    await handleItemSave();
    errorMessages.value = [];
    validationFailed.value = false;
  } catch (error) {
    switch ((error as ErrorType).statusCode) {
      case 422:
        errorMessages.value = [(error as ErrorType).data?.detail as string];
        validationFailed.value = true;
        break;

      case 401:
        userToken.value = "";
        localStorage.removeItem("authToken");
        showLoginForm.value = true;
        break;

      default:
        showErrorInfoBox.value = true;
        break;
    }
  }

  validationPending.value = false;
};

const getMessagesFromError = (errors: ErrorDetail[]): string[] => {
  const messages: string[] = [];
  errors.forEach(error =>
    messages.push(error["Exception Message"].split("\n")[0])
  );
  return messages;
};

const changeFunction = async () => {
  validationPending.value = true;

  try {
    await validate(item.value, itemSchema.value);
    validationFailed.value = false;
    errorMessages.value = [];
    validationPending.value = false;
  } catch (error) {
    validationFailed.value = true;
    errorMessages.value =
      (error as ErrorType).statusCode === 422
        ? getMessagesFromError(
            (error as ErrorType).data.detail as ErrorDetail[]
        )
        : ["Unbekannter Fehler."];
  }
};
</script>

<template>
  <div class="flex flex-row">
    <BorderBox class="min-w-[800px]">
      <IPJsonForms v-model="item" :schema="schema" @change="changeFunction" />
    </BorderBox>
    <div>
      <div class="fixed pt-8 ml-4">
        <LoginForm
          v-model="userToken"
          :show="showLoginForm"
          :close-request-form="closeLoginForm"
        />
        <ErrorInfoBox
          :show="showErrorInfoBox"
          :close-error-info="() => (showErrorInfoBox = false)"
        />
        <IPButton
          secondary
          :title="
            validationPending
              ? $t('save_button_pending')
              : validationFailed
                ? $t('schema_invalid')
                : $t('save_resource')
          "
          :disabled="validationPending || validationFailed"
          @click="saveItem"
        >
          {{ item._id === "" ? $t("create_resource") : $t("save_resource") }}
        </IPButton>
        <BorderBox v-if="errorMessages.length > 0" warning>
          <ul>
            <li v-for="(errorMessage, index) in errorMessages" :key="index">
              {{ errorMessage }}
            </li>
          </ul>
        </BorderBox>
      </div>
    </div>
  </div>
</template>
