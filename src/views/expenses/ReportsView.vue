<template>
  <div>
    <!-- Date filters -->
    <div class="flex gap-3 mb-6 flex-wrap items-end">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">From</label>
        <input v-model="dateFrom" type="date" class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">To</label>
        <input v-model="dateTo" type="date" class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
      </div>
      <button @click="load" class="px-4 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700">
        Apply
      </button>
    </div>

    <LoadingSpinner v-if="store.loading" />

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ReportCard title="Team Summary" :data="store.teamSummary" />
      <ReportCard title="By Category" :data="store.byCategory" />
      <ReportCard title="By Member" :data="store.byMember" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReportsStore } from '@/stores/reports'
import ReportCard from '@/components/expenses/ReportCard.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'

const store = useReportsStore()
const dateFrom = ref('')
const dateTo = ref('')

onMounted(() => load())

function load() {
  store.fetchAll({
    date_from: dateFrom.value || undefined,
    date_to: dateTo.value || undefined,
  })
}
</script>
