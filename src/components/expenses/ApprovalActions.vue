<template>
  <div class="flex gap-3 flex-wrap">
    <button
      v-if="expense.status === 'draft'"
      @click="submit"
      class="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
    >
      Submit for Approval
    </button>
    <template v-if="canReview && expense.status === 'pending'">
      <button @click="approve" class="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700">Approve</button>
      <button @click="showReject = true" class="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700">Reject</button>
    </template>

    <!-- Rejection reason dialog -->
    <div v-if="showReject" class="w-full mt-2">
      <textarea
        v-model="reason"
        rows="2"
        placeholder="Reason for rejection…"
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
      />
      <div class="flex gap-2 mt-2">
        <button @click="reject" class="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700">Confirm Reject</button>
        <button @click="showReject = false" class="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useExpenseAuthStore } from '@/stores/expenseAuth'
import type { Expense } from '@/types/expense'

const props = defineProps<{ expense: Expense }>()
const emit = defineEmits<{ update: [] }>()

const authStore = useExpenseAuthStore()
const canReview = computed(() => authStore.user?.role === 'admin' || authStore.user?.role === 'manager')

const showReject = ref(false)
const reason = ref('')

import { useExpensesStore } from '@/stores/expenses'
const store = useExpensesStore()

async function submit() {
  await store.submitExpense(props.expense.id)
  emit('update')
}

async function approve() {
  await store.approveExpense(props.expense.id)
  emit('update')
}

async function reject() {
  await store.rejectExpense(props.expense.id, reason.value)
  showReject.value = false
  reason.value = ''
  emit('update')
}
</script>
