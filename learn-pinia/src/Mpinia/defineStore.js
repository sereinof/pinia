import { effect, effectScope, getCurrentInstance, inject, reactive, compuuted } from "vue";
import { SymbolPinia } from "./rootStore";
//一个所谓的pinia应用有许多个store，
//每一个store都以id,options的键值对方式存进去了一个map中去；
export function defineStore(idOrption, setup) {//这个函数应该返回一个函数，从使用的方式来看
    let id;
    let options;
    if (typeof idOrption === 'string') {
        id = idOrption;
        options = setup;
    } else {
        options = idOrption;
        id = idOrption.id;
    }//处理参数

    function useStore() {
        //在vue的上下文注册一个store 是用的inject
        const currentInstance = getCurrentInstance();

        const pinia = currentInstance && inject(SymbolPinia);//这一步获取整个在vue应用中使用use方法
        //安装的插件，这个插件提供一个install方法， 2而这个install方法会进行一些初始化的残做，比如使用provide方法
        //让全局的vue组件获取到pinia,然后储存vue应用的多个store信息
        //pinia的优势可见一斑
        if (!pinia._has(id)) {
            //如果说pinia中不包含这个id的store，那么就必须生成一个？至于怎么生成呢》
            createOptionStore(id, options, pinia)
        }


    }
    return useStore;
}
function createOptionStore(id, options, pinia) {
    let { state, getters, actions } = options;
    let scope;
    const store = reactive({});//这一步虽然是核心，但是有点看不懂
    //有一个响应式的容器
    function setup() {
        //这个state是一个ref,如果给ref赋值为一个对象， 那么这个对象会被代理，就是通俗说的响应式的
        pinia.state.value[id] = state ? state() : {};
        const localState =  toRefs(pinia.state.value[id])
        return Object.assign(
            localState,
            actions,
            Object.keys(getters || {}).reduce((computedGetters, name) => {
                computedGetters[name] = compuuted(() => {
                    //获取我们需要获取的当前的store
                  return    getters[name].call(store, store);
                })
                return computedGetters;//把这个对象里的每一个属性都包裹成一个计算属性
            })
        )//这里还要加入getters和action等的处理方式

    }
    const setupStore = pinia._e.run(() => {//这个run方法的效果似乎是有叠加效果
        scope = effectScope();
        return scope.run(() => {
            return setup();
        })
    })
    function wrapAction(name, action) {
        return function () {
            let ret = action.apply(store, arguments);//这个动作可能是异步的，可能是一个promise
            return ret;
        }
    }
    for (let key in setupStore) {
        const prop = setupStore[key];//拿到对应的 值
        if (typeof prop === 'function') {
            setupStore[key] = wrapAction(key, prop)
        }
    }
    Object.assign(store, setupStore);
    pinia._s(id, store)//这里真正的存储store
}