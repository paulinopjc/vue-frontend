<template>
  <div>
    <LoadingSpinner v-if="store.loading && !store.current" />
    <div v-else-if="store.current">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ store.current.title }}</h3>
          <p class="text-2xl font-bold text-gray-800 mt-1">
            ₱{{ Number(store.current.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
          </p>
          <div class="flex items-center gap-2 mt-2">
            <StatusBadge :status="store.current.status" />
            <span class="text-sm text-gray-400">{{ store.current.category.name }}</span>
            <span class="text-sm text-gray-400">{{ store.current.date }}</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <router-link
            :to="`/expenses/${id}/edit`"
            class="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
          >
            Edit
          </router-link>
          <button
            @click="onDelete"
            :disabled="deleting"
            class="text-sm px-3 py-1.5 rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            {{ deleting ? 'Deleting…' : 'Delete' }}
          </button>
          <button @click="router.push('/expenses')" class="text-sm text-gray-400 hover:underline">← Back</button>
        </div>
      </div>

      <!-- Description -->
      <p v-if="store.current.description" class="text-sm text-gray-600 mb-6">{{ store.current.description }}</p>

      <!-- Rejection reason -->
      <div v-if="store.current.rejection_reason" class="bg-red-50 border border-red-200 rounded px-4 py-3 mb-6">
        <p class="text-sm text-red-700 font-medium">Rejected: {{ store.current.rejection_reason }}</p>
      </div>

      <!-- Approval actions -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h4 class="text-sm font-semibold text-gray-700 mb-3">Actions</h4>
        <ApprovalActions :expense="store.current" @update="reload" />
      </div>

      <!-- Receipts -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <ReceiptList :expense-id="store.current.id" :receipts="store.current.receipts" @update="reload" />
      </div>

      <!-- Comments -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <CommentSection :expense-id="store.current.id" :comments="comments" @update="reloadComments" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExpensesStore } from '@/stores/expenses'
import { expenseApi } from '@/api/expenseApi'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ApprovalActions from '@/components/expenses/ApprovalActions.vue'
import ReceiptList from '@/components/expenses/ReceiptList.vue'
import CommentSection from '@/components/expenses/CommentSection.vue'
import type { Comment } from '@/types/expense'

const route = useRoute()
const router = useRouter()
const store = useExpensesStore()
const comments = ref<Comment[]>([])
const deleting = ref(false)

const id = Number(route.params.id)

onMounted(() => {
  reload()
  reloadComments()
})

async function reload() {
  await store.fetchExpense(id)
}

async function reloadComments() {
  const res = await expenseApi.getComments(id)
  comments.value = res.data.data
}

async function onDelete() {
  if (!confirm('Delete this expense? This cannot be undone.')) return
  deleting.value = true
  try {
    await store.deleteExpense(id)
    router.push('/expenses')
  } catch {
    deleting.value = false
    alert('Failed to delete expense.')
  }
}
</script>
