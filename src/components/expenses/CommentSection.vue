<template>
  <div>
    <h4 class="text-sm font-semibold text-gray-700 mb-3">Comments</h4>
    <ul class="space-y-3 mb-4">
      <li v-for="c in comments" :key="c.id" class="bg-gray-50 rounded px-3 py-2">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-medium text-gray-700">{{ c.user.name }}</span>
          <div class="flex gap-2 items-center">
            <span class="text-xs text-gray-400">{{ new Date(c.created_at).toLocaleDateString() }}</span>
            <button @click="remove(c.id)" class="text-xs text-red-400 hover:underline">Delete</button>
          </div>
        </div>
        <p class="text-sm text-gray-700">{{ c.body }}</p>
      </li>
    </ul>
    <p v-if="!comments.length" class="text-xs text-gray-400 mb-3">No comments yet.</p>
    <div class="flex gap-2">
      <input
        v-model="body"
        type="text"
        placeholder="Add a comment…"
        class="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
        @keyup.enter="add"
      />
      <button @click="add" class="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700">Post</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { expenseApi } from '@/api/expenseApi'
import type { Comment } from '@/types/expense'

const props = defineProps<{ expenseId: number; comments: Comment[] }>()
const emit = defineEmits<{ update: [] }>()

const body = ref('')

async function add() {
  if (!body.value.trim()) return
  await expenseApi.addComment(props.expenseId, body.value)
  body.value = ''
  emit('update')
}

async function remove(commentId: number) {
  await expenseApi.deleteComment(commentId)
  emit('update')
}
</script>
