<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-gray-900">Expense Tracker — Users</h1>
      <button
        @click="showCreate = !showCreate"
        class="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700"
      >
        {{ showCreate ? 'Cancel' : 'Add user' }}
      </button>
    </div>

    <div v-if="showCreate" class="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h2 class="text-sm font-semibold text-gray-700 mb-3">Add a new user</h2>
      <p class="text-xs text-gray-500 mb-3">
        After saving, the user can sign in with their Google account using this email.
      </p>
      <form @submit.prevent="submitCreate" class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Name</label>
            <input v-model="form.name" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Email (Gmail)</label>
            <input v-model="form.email" type="email" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Role</label>
            <select v-model="form.role" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="member">Member</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Team</label>
            <select v-model="form.team_id" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option :value="null">— No team —</option>
              <option v-for="t in teams" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>
          <div class="flex items-end col-span-2">
            <label class="flex items-center text-sm text-gray-700">
              <input v-model="form.is_active" type="checkbox" class="mr-2" />
              Active
            </label>
          </div>
        </div>
        <div v-if="formError" class="text-sm text-red-600">{{ formError }}</div>
        <button type="submit" :disabled="saving" class="bg-indigo-600 text-white text-sm px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
          {{ saving ? 'Saving…' : 'Create user' }}
        </button>
      </form>
    </div>

    <div v-if="loading" class="text-sm text-gray-500">Loading users…</div>
    <div v-else-if="error" class="text-sm text-red-600">{{ error }}</div>
    <table v-else class="w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
      <thead class="bg-gray-50">
        <tr class="text-left text-xs font-semibold text-gray-600 uppercase">
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Role</th>
          <th class="px-4 py-2">Team</th>
          <th class="px-4 py-2">Status</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id" class="border-t border-gray-100">
          <td class="px-4 py-2">{{ u.name }}</td>
          <td class="px-4 py-2">{{ u.email }}</td>
          <td class="px-4 py-2 capitalize">{{ u.role }}</td>
          <td class="px-4 py-2">{{ teamName(u.team_id) }}</td>
          <td class="px-4 py-2">
            <span :class="u.is_active ? 'text-green-700' : 'text-gray-400'">
              {{ u.is_active ? 'Active' : 'Disabled' }}
            </span>
          </td>
          <td class="px-4 py-2">
            <button @click="toggleActive(u)" class="text-xs text-indigo-600 hover:underline">
              {{ u.is_active ? 'Deactivate' : 'Activate' }}
            </button>
          </td>
        </tr>
        <tr v-if="!users.length">
          <td colspan="6" class="px-4 py-6 text-center text-gray-400">No users yet.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { expenseApi, type Team } from '@/api/expenseApi'
import type { User, CreateUserPayload } from '@/types/auth'

const users = ref<User[]>([])
const teams = ref<Team[]>([])
const loading = ref(true)
const error = ref('')
const showCreate = ref(false)
const saving = ref(false)
const formError = ref('')

const form = reactive<CreateUserPayload>({
  name: '',
  email: '',
  role: 'member',
  is_active: true,
  team_id: null,
})

function teamName(id: number | null | undefined): string {
  if (!id) return '—'
  const t = teams.value.find((t) => t.id === id)
  return t?.name || `#${id}`
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [usersRes, teamsRes] = await Promise.all([expenseApi.listUsers(), expenseApi.listTeams()])
    users.value = usersRes.data.data
    teams.value = teamsRes.data.data
  } catch {
    error.value = 'Failed to load users.'
  } finally {
    loading.value = false
  }
}

async function submitCreate() {
  saving.value = true
  formError.value = ''
  try {
    await expenseApi.createUser({ ...form })
    form.name = ''
    form.email = ''
    form.role = 'member'
    form.is_active = true
    form.team_id = null
    showCreate.value = false
    await load()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
    formError.value =
      err?.response?.data?.errors?.email?.[0] ||
      err?.response?.data?.message ||
      'Failed to create user.'
  } finally {
    saving.value = false
  }
}

async function toggleActive(u: User) {
  try {
    await expenseApi.toggleUser(u.id)
    await load()
  } catch {
    error.value = 'Failed to update user.'
  }
}

onMounted(load)
</script>
