<template>
  <div class="flex gap-3 flex-wrap">
    <select
      v-model="filters.status"
      class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
      @change="emit('change', { ...filters })"
    >
      <option value="">All statuses</option>
      <option value="draft">Draft</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </select>
    <select
      v-model="filters.category_id"
      class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
      @change="emit('change', { ...filters })"
    >
      <option value="">All categories</option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
    </select>
    <input
      v-model="filters.date_from"
      type="date"
      class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
      @change="emit('change', { ...filters })"
    />
    <input
      v-model="filters.date_to"
      type="date"
      class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
      @change="emit('change', { ...filters })"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { ExpenseFilters, Category } from '@/types/expense'

defineProps<{ categories: Category[] }>()
const emit = defineEmits<{ change: [filters: ExpenseFilters] }>()
const filters = reactive<ExpenseFilters>({ status: '', category_id: '', date_from: '', date_to: '' })
</script>
