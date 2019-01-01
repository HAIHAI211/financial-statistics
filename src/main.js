import {MpvueApp} from '../static/ald-stat'
import Vue from 'vue'
import App from './App'
import store from './store'
import * as utils from './utils'
import HarrisonMpUtils from 'harrison-mp-utils'
import '@/common/style/iconfont.css'
Vue.prototype.$store = store
Vue.prototype.utils = utils
Vue.prototype.$utils = HarrisonMpUtils
Vue.config.productionTip = false
App.mpType = 'app'
// const app = new Vue(App)
const app = new Vue(MpvueApp(App))
app.$mount()
