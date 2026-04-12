<template>
  <AppLayout>
    <router-view />
  </AppLayout>
  <ToastNotification />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'
import { useTaskAuthStore } from '@/stores/taskAuth'
import { useExpenseAuthStore } from '@/stores/expenseAuth'

const taskAuth = useTaskAuthStore()
const expenseAuth = useExpenseAuthStore()

onMounted(() => {
  taskAuth.loadFromStorage()
  expenseAuth.loadFromStorage()
})
</script>
