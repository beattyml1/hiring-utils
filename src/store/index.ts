import Vuex, {Store} from 'vuex';
import * as _actions from '@/store/actions';
import * as _getters from './getters';
import * as _mutations from './mutations';
import {names} from '@/types/names';
import Vue from 'vue';
import createPersist from 'vuex-localstorage'
import {User} from "@/types/User";
Vue.use(Vuex);

type State = {
    user: false | User;
}

const state = () => ({
    user: false
} as State);

export const store = new Store<State>({
    actions: _actions,
    mutations: _mutations,
    getters: _getters,
    state,
    plugins: [createPersist({
        namespace: 'state',
        initialState: state(),
        // ONE_WEEK
        expires: 7 * 24 * 60 * 60 * 1e3
    })]
});
Vue.prototype.$store = store;

export const actions = names(_actions);
export const getters = names(_getters);
export const mutations = names(_mutations);

