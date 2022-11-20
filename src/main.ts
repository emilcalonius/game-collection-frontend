import { createApp } from 'vue'
import InstantSearch from 'vue-instantsearch/vue3/es';
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import './assets/main.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(InstantSearch)
app.mount('#app')
