import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { Button, NavBar, Tabbar, TabbarItem, Search, SwipeCell, Dialog, Toast, Field, Icon, Popup } from 'vant'

// 引入全局样式
import '@/styles/index.scss'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Button)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Search)
app.use(SwipeCell)
app.use(Dialog)
app.use(Toast)
app.use(Field)
app.use(Icon)
app.use(Popup)

app.mount('#app')
