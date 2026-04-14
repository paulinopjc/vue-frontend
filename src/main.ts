import { createApp } from 'vue'
import { createPinia } from 'pinia'
import GoogleSignInPlugin from 'vue3-google-signin'
import router from '@/router'
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
if (googleClientId) {
  app.use(GoogleSignInPlugin, { clientId: googleClientId })
} else {
  console.warn('VITE_GOOGLE_CLIENT_ID is not set — Google Sign-In will not work.')
}

app.mount('#app')
