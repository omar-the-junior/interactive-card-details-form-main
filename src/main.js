import { createApp } from 'vue'
import App from './App.vue'
import { maska } from 'maska';


const app = createApp(App)

app.directive('maska', maska);
app.mount('#app')

