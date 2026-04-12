<template>
  <div>
    <h4 class="text-sm font-semibold text-gray-700 mb-3">Receipts</h4>
    <FileUpload accept="image/*,application/pdf" @file="upload" class="mb-3" />
    <div v-if="uploading" class="text-xs text-gray-400 mb-2">Uploading…</div>
    <ul class="space-y-2">
      <li
        v-for="r in receipts"
        :key="r.id"
        class="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-2"
      >
        <span class="truncate text-gray-700">{{ r.original_name }}</span>
        <div class="flex gap-3 shrink-0">
          <button @click="download(r.id, r.original_name)" class="text-indigo-600 hover:underline text-xs">Download</button>
          <button @click="remove(r.id)" class="text-red-500 hover:underline text-xs">Delete</button>
        </div>
      </li>
    </ul>
    <p v-if="!receipts.length && !uploading" class="text-xs text-gray-400 mt-2">No receipts attached.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/shared/FileUpload.vue'
import { expenseApi } from '@/api/expenseApi'
import type { Receipt } from '@/types/expense'

const props = defineProps<{ expenseId: number; receipts: Receipt[] }>()
const emit = defineEmits<{ update: [] }>()

const uploading = ref(false)

async function upload(file: File) {
  uploading.value = true
  try {
    await expenseApi.uploadReceipt(props.expenseId, file)
    emit('update')
  } finally {
    uploading.value = false
  }
}

async function download(receiptId: number, name: string) {
  const res = await expenseApi.downloadReceipt(receiptId)
  const url = URL.createObjectURL(res.data as unknown as Blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

async function remove(receiptId: number) {
  await expenseApi.deleteReceipt(receiptId)
  emit('update')
}
</script>
