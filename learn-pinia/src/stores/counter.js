import { defineStore } from "pinia";

export const useCounterStore = defineStore('counter',{
    state:()=>{return {count:1}},
    getters:{double:(store)=>{ return store.count*2}}
})