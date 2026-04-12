import { computed } from 'vue'

export function usePagination(nextCursor: { value: string | null }) {
  const hasMore = computed(() => !!nextCursor.value)

  return { hasMore }
}
