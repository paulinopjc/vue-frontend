<template>
  <aside class="w-56 bg-gray-900 text-white min-h-screen flex flex-col">
    <div class="px-4 py-5 border-b border-gray-700">
      <h1 class="text-sm font-semibold tracking-widest uppercase text-gray-400">Dashboard</h1>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-6">
      <!-- Task Manager -->
      <div>
        <p class="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Task Manager</p>
        <router-link
          to="/tasks"
          class="flex items-center px-2 py-2 text-sm rounded hover:bg-gray-800 transition-colors"
          :class="{ 'bg-gray-700 text-white': route.path.startsWith('/tasks') && !route.path.endsWith('/login') && !route.path.endsWith('/register') }"
        >
          Tasks
        </router-link>
        <template v-if="taskAuth.isAuthenticated.value">
          <button
            @click="taskAuth.logout()"
            class="w-full text-left flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
          >
            Logout ({{ taskAuth.user.value?.name }})
          </button>
        </template>
      </div>

      <!-- Expense Tracker -->
      <div>
        <p class="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Expense Tracker</p>
        <router-link
          to="/expenses"
          class="flex items-center px-2 py-2 text-sm rounded hover:bg-gray-800 transition-colors"
          :class="{ 'bg-gray-700 text-white': route.path.startsWith('/expenses') && !route.path.endsWith('/login') && !route.path.endsWith('/register') }"
        >
          Expenses
        </router-link>
        <router-link
          v-if="expenseAuth.isAuthenticated.value"
          to="/expenses/reports"
          class="flex items-center px-2 py-2 text-sm rounded hover:bg-gray-800 transition-colors"
          :class="{ 'bg-gray-700 text-white': route.path === '/expenses/reports' }"
        >
          Reports
        </router-link>
        <template v-if="expenseAuth.isAuthenticated.value">
          <button
            @click="expenseAuth.logout()"
            class="w-full text-left flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
          >
            Logout ({{ expenseAuth.user.value?.name }})
          </button>
        </template>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTaskAuth, useExpenseAuth } from '@/composables/useAuth'

const route = useRoute()
const taskAuth = useTaskAuth()
const expenseAuth = useExpenseAuth()
</script>
