<template>
  <div>
    <div class="flex flex-wrap gap-1 mb-2">
      <span
        v-for="tag in tags"
        :key="tag.id"
        class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-700"
      >
        {{ tag.name }}
        <button @click="emit('remove', tag.id)" class="hover:text-red-500">✕</button>
      </span>
    </div>
    <div class="flex gap-2">
      <select
        v-model="selectedId"
        class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
      >
        <option value="">Add tag…</option>
        <option v-for="t in availableTags" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
      <button
        @click="addTag"
        class="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Tag } from '@/types/task'

const props = defineProps<{ tags: Tag[]; allTags: Tag[] }>()
const emit = defineEmits<{ add: [id: number]; remove: [id: number] }>()

const selectedId = ref<number | ''>('')
const availableTags = computed(() => props.allTags.filter((t) => !props.tags.find((at) => at.id === t.id)))

function addTag() {
  if (!selectedId.value) return
  emit('add', selectedId.value as number)
  selectedId.value = ''
}
</script>
