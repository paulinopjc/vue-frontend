<template>
  <transition name="slide">
    <div
      v-if="visible"
      :class="['fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm text-white flex items-center gap-2', colorClass]"
    >
      {{ message }}
      <button @click="hide" class="ml-2 opacity-70 hover:opacity-100">✕</button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotification } from '@/composables/useNotification'

const { message, type, visible, hide } = useNotification()

const colorClass = computed(() => ({
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-gray-800',
}[type.value] ?? 'bg-gray-800'))
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
