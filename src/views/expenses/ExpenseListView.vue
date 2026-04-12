<template>
  <div>
    <div class="flex items-center justify-between mb-5">
      <ExpenseFilters :categories="categories" @change="onFilter" />
      <router-link to="/expenses/create" class="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700">
        + New Expense
      </router-link>
    </div>

    <LoadingSpinner v-if="store.loading && !store.expenses.length" />
    <EmptyState v-else-if="!store.loading && !store.expenses.length" message="No expenses found." />

    <div v-else class="space-y-3">
      <ExpenseCard
        v-for="expense in store.expenses"
        :key="expense.id"
        :expense="expense"
        @click="(e) => router.push(`/expenses/${e.id}`)"
      />
    </div>

    <div v-if="hasMore" class="mt-6 text-center">
      <button @click="loadMore" :disabled="store.loading" class="px-5 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
        {{ store.loading ? 'Loading…' : 'Load more' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExpensesStore } from '@/stores/expenses'
import { expenseApi } from '@/api/expenseApi'
import ExpenseCard from '@/components/expenses/ExpenseCard.vue'
import ExpenseFilters from '@/components/expenses/ExpenseFilters.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import type { Category, ExpenseFilters as EFilters } from '@/types/expense'

const store = useExpensesStore()
const router = useRouter()
const hasMore = computed(() => !!store.nextCursor)

const categories = ref<Category[]>([])
let activeFilters: EFilters = {}

onMounted(async () => {
  store.fetchExpenses()
  try {
    const res = await expenseApi.getCategories()
    categories.value = res.data.data
  } catch {
    // categories filter unavailable; expense list still works
  }
})

function onFilter(filters: EFilters) {
  activeFilters = filters
  store.fetchExpenses(filters)
}

function loadMore() {
  store.fetchExpenses(activeFilters, true)
}
</script>
