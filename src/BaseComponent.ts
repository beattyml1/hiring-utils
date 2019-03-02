import {store} from '@/store'
import Component from "vue-class-component";
import Vue from "vue";
import {Route} from "vue-router";
import {VueRouter} from "vue-router/types/router";

@Component({})
export default class BaseComponent extends Vue {
    $store = store;
    $router: VueRouter;
    $route: Route;
    constructor() {
        super()
        this.$store = store;
    }
}