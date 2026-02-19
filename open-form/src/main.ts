import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: 'aura',
    options: {
      darkModeSelector: '.dark-mode',
      cssLayer: false,
    },
  },
})

app.mount('#app')
