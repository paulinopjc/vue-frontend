import { ref } from 'vue'

type NotificationType = 'success' | 'error' | 'info'

const message = ref('')
const type = ref<NotificationType>('info')
const visible = ref(false)

let timer: ReturnType<typeof setTimeout> | null = null

export function useNotification() {
  function show(msg: string, notifType: NotificationType = 'info') {
    message.value = msg
    type.value = notifType
    visible.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
    }, 3000)
  }

  function hide() {
    visible.value = false
  }

  return { message, type, visible, show, hide }
}
