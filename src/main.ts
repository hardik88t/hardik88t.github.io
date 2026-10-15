import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import '@fontsource-variable/onest'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/jetbrains-mono'
import './style.css'
import App from './App.vue'

createApp(App).use(MotionPlugin).mount('#app')
