import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
  import {createPinia} from 'pinia';
 const app =  createApp(App);
 
 

 const pinia = createPinia();
 //app.use(Plugin)//use的函数的意义在于回去调参数的install方法，并且将app作为参数传递jinqu
 app.use(pinia)
//render(h(APP),'#app')
app.mount('#app')
//vuex 缺点，TS兼容性不好 命名空间的缺陷（只能有一个store）有mutation和action的区别

//pinia 有点，兼容性好，不要命名空间（可以有多个store） mutation删掉了
//大小也会小巧一些
