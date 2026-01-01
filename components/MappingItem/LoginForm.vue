<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { login } from "~/composables/api";

const model = defineModel<string>();
const { closeRequestForm } = defineProps<{ closeRequestForm:() => void }>();

const username = ref("");
const password = ref("");
const showLoginFailed = ref(false);
const disableForm = ref(false);

const tryLogin = async () => {
  try {
    disableForm.value = true;
    const token = await login(username.value, password.value);
    localStorage.setItem("authToken", token.access_token);
    model.value = token.access_token;
    closeRequestForm();
  } catch (e) {
    showLoginFailed.value = true;
  }
  disableForm.value = false;
};
</script>

<template>
  <TransitionRoot appear as="template">
    <Dialog as="div" class="relative z-10" @close="closeRequestForm">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                {{ $t("login_form_header") }}
              </DialogTitle>
              <form @submit.prevent="tryLogin">
                <fieldset :disabled="disableForm">
                  <div class="mt-2">
                    <div v-show="showLoginFailed" class="text-red-600 pb-1">
                      {{ $t('login_failed') }}
                    </div>
                    <input v-model="username" autocomplete="on" :placeholder="$t('login_username')" class="border w-full px-0.5" />
                    <input v-model="password" autocomplete="on" :placeholder="$t('login_password')" type="password" class="border w-full px-0.5" />
                  </div>

                  <div class="mt-4">
                    <input
                      type="submit"
                      :value="$t('login_submit')"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    />
                  </div>
                </fieldset>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>

</style>
