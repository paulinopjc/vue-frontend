<template>
  <header class="h-14 bg-white border-b border-gray-200 flex items-center px-6">
    <h2 class="text-base font-semibold text-gray-800">{{ title }}</h2>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => (route.meta.title as string) || 'Dashboard')
</script>
