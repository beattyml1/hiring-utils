import Vue from 'vue';
import '@/services/firebase'
import App from './App.vue';
import VueFire from 'vuefire';
import '@/services/firebase';
import VueRouter from 'vue-router';
import '@/store'

Vue.config.productionTip = false;

Vue.use(VueFire);
Vue.use(VueRouter);


new Vue(App).$mount('#app');
