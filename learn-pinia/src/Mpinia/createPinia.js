import { effectScope, markRaw, ref } from "vue";
import { SymbolPinia } from "./rootStore";

export function createPinia(){
     const scope = effectScope(true);
     const state  = scope.run(()=>ref({}))//这个state居然是存储state的容器，不过不是见么简单
     //state是响应式数据，而store的话还包含action，以及getter计算属性
      const pinia = markRaw({
        install(app){
            //pinia 希望能被共享出去
            pinia._a = app;
            app.provide(SymbolPinia,pinia);
            //兼容vue2
            app.config.globalProperties.$pinia = pinia;
        },
        _a:null,
        state,
        _e:scope,//用来管理整个应用的effect Scope
        _s:new Map(),//记录所有的store
      })
      return pinia;
}