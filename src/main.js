import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { 
  Button,
  NavBar,
  Tabbar,
  TabbarItem,
  Search,
  SwipeCell,
  Icon,
  Popup,
  Field,
  Dialog,
  Toast,
  Empty,
  Loading
} from 'vant'
import 'vant/lib/index.css'
import './styles/index.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

// 注册 Vant 组件
app.use(Button)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Search)
app.use(SwipeCell)
app.use(Icon)
app.use(Popup)
app.use(Field)
app.use(Dialog)
app.use(Toast)
app.use(Empty)
app.use(Loading)

app.mount('#app')
