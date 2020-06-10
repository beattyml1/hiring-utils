import SalaryCalcBuildPage from '@/pages/SalaryCalcBuildPage.vue';
import DashboardPage from '@/pages/DashboardPage.vue';
import SalaryCalcPage from '@/pages/SalaryCalcPage.vue';
import VueRouter from 'vue-router';
import Vue from 'vue'

export const router = new VueRouter({
    routes: [
        { path: '/', component: DashboardPage },
        { path: '/build/calc/:id', component: SalaryCalcBuildPage },
        { path: '/calc/:id', component: SalaryCalcPage },
        { path: '/shared-calc/:id', component: SalaryCalcPage, name:'shared-calc' },
    ],
    mode: 'history',
});

Vue.prototype.$router = router;
