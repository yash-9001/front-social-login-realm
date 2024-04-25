import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ToastPlugin from 'vue-toast-notification';
import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login';

const pinia = createPinia()
const app = createApp(App)

app.use(vue3GoogleLogin, {
  clientId: '932506994363-drmn01grg6fkrsjm2d84ngoq360h8om6.apps.googleusercontent.com'
})
app.use(router)
app.use(pinia);
app.use(ToastPlugin)
app.mount('#app')