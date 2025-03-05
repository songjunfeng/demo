import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
//@ts-ignore
import App from './App.vue'
import router from './router'
// GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234!' WITH GRANT OPTION;
// 'MyP@ssw0rd!
// ALTER USER 'root'@'%' IDENTIFIED BY '1234';

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
