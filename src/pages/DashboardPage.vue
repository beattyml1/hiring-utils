<template>
    <div>
        <div v-if="loggedIn" id="dashboard-login">
            <dashboard>

            </dashboard>
        </div>
        <div v-else>
            <button type="button" @click="login" class="btn btn-primary">
                Login
            </button>
        </div>

    </div>
</template>

<style>

</style>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import BaseComponent from "../BaseComponent";
    import {actions} from "../store";
    import {Getter} from "vuex-class";
    import Dashboard from "../components/Dashboard.vue";

    @Component({
        name: 'DashboardPage',
        components: {Dashboard},
    })
    export default class DashboardPage extends BaseComponent {
        @Getter('loggedIn') loggedIn: boolean;
        login() {
            this.$store.dispatch(actions.login)
        }
    }
</script>