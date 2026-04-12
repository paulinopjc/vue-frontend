<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
      <h3 class="text-base font-semibold text-gray-900 mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-500 mb-5">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button @click="emit('cancel')" class="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50">Cancel</button>
        <button @click="emit('confirm')" class="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ open: boolean; title: string; message: string }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>
