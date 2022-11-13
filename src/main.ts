import { createApp } from 'vue'
import InstantSearch from 'vue-instantsearch/vue3/es';
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.use(InstantSearch)

app.mount('#app')
