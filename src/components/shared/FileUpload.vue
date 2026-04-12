<template>
  <div
    class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer"
    @click="input?.click()"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <p class="text-sm text-gray-500">Drag a file here or <span class="text-indigo-600 underline">click to select</span></p>
    <input ref="input" type="file" class="hidden" :accept="accept" @change="onChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ accept?: string }>()
const emit = defineEmits<{ file: [file: File] }>()
const input = ref<HTMLInputElement | null>(null)

function onChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('file', file)
}

function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files[0]
  if (file) emit('file', file)
}

// suppress unused prop warning
void props.accept
</script>
