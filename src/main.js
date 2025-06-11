import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import {
  Button,
  Calendar,
  Cell,
  CellGroup,
  Dialog,
  Empty,
  Field,
  Form,
  Icon,
  Loading,
  NavBar,
  Popup,
  Search,
  Swipe,
  SwipeCell,
  SwipeItem,
  Tabbar,
  TabbarItem,
  Toast
} from 'vant'
import 'vant/lib/index.css'
import './styles/index.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

// 注册 Vant 组件（按字母顺序排列，便于维护）
app.use(Button)
app.use(Calendar)
app.use(Cell)
app.use(CellGroup)
app.use(Dialog)
app.use(Empty)
app.use(Field)
app.use(Form)
app.use(Icon)
app.use(Loading)
app.use(NavBar)
app.use(Popup)
app.use(Search)
app.use(Swipe)
app.use(SwipeCell)
app.use(SwipeItem)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Toast)

app.mount('#app')
