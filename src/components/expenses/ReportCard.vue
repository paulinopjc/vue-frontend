<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4">
    <h4 class="text-sm font-semibold text-gray-700 mb-3">{{ title }}</h4>
    <table class="w-full text-sm">
      <thead>
        <tr class="text-left text-xs text-gray-500 border-b border-gray-100">
          <th class="pb-2 font-medium">Name</th>
          <th class="pb-2 font-medium text-right">Count</th>
          <th class="pb-2 font-medium text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.name" class="border-b border-gray-50 last:border-0">
          <td class="py-2 text-gray-800">{{ row.name }}</td>
          <td class="py-2 text-right text-gray-500">{{ row.count }}</td>
          <td class="py-2 text-right font-medium text-gray-800">
            ₱{{ Number(row.total).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
          </td>
        </tr>
        <tr v-if="!data.length">
          <td colspan="3" class="py-4 text-center text-gray-400 text-xs">No data</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  data: { name: string; count: number; total: number }[]
}>()
</script>
