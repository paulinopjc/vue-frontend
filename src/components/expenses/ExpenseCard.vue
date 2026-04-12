<template>
  <div
    class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer"
    @click="emit('click', expense)"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">{{ expense.title }}</p>
        <p class="text-base font-semibold text-gray-800 mt-0.5">₱{{ Number(expense.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p>
        <div class="flex items-center gap-2 mt-1 flex-wrap">
          <StatusBadge :status="expense.status" />
          <span class="text-xs text-gray-400">{{ expense.category.name }}</span>
          <span class="text-xs text-gray-400">{{ expense.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/shared/StatusBadge.vue'
import type { Expense } from '@/types/expense'

defineProps<{ expense: Expense }>()
const emit = defineEmits<{ click: [expense: Expense] }>()
</script>
