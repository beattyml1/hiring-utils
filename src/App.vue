<template>
  <div id="app">
    <nav>
        <h1>
          <router-link to="/">
            Salary Utils
          </router-link>
        </h1>
      <ul class="right-links">
        <li>
          <button v-if="loggedIn" type="button" @click="logout" class="btn btn-primary">
            Logout
          </button>
          <button v-else type="button" @click="login" class="btn btn-primary">
            Login
          </button>
        </li>
      </ul>
    </nav>
    <main id="main-container">
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import SalaryCalcConfig from './components/SalaryCalcConfig.vue';
    import SalaryCalc from './components/SalaryCalc.vue';
    import {ConfigModel, defualtConfigModel} from './types/config';
    import Component from 'vue-class-component'
    import SalaryCalcBuildPage from './pages/SalaryCalcBuildPage.vue'
    import {logout,login} from './store/actions/auth';
    import {mapState} from "vuex";
    import {Getter, State} from "vuex-class";
    import VueRouter from "vue-router";
    import {getters, actions} from '@/store'
    import {router} from "./router";
    import BaseComponent from "./BaseComponent";

    @Component({
        name: 'app',
        components: {
            SalaryCalc, SalaryCalcConfig
        },
        router,
    })
    export default class extends BaseComponent {
        @Getter loggedIn: boolean;
        login() {
            this.$store.dispatch(actions.login)
        }
        logout() {
            this.$store.dispatch(actions.logout)
        }
    }
</script>

<style lang="scss">
  body { box-sizing: border-box; }
  #app {
    font-family: helvetica, arial, sansserif;
  }

  #app>label {
    margin-bottom: 15px;
    display: block;
  }

  #app .col {
    flex-basis: unset;
  }

  #calc {
    margin: 30px auto;
    max-width: 500px;
  }

  #builder {
    max-width: 1024px;
    font-family: helvetica, arial, sansserif;
    margin: 30px auto;
  }

  h1 {
    font-size: 28px;
    margin-bottom: 20px;
    margin-top: 10px
  }

  ul.plus {
    list-style: none;
    padding-left: 0;
    position: fixed;
    right: 20px;
    top: 40px;
    max-width: 400px;
  }

  .plus li:before {
    content: "+";
    margin-right: 4px;
  }

  label {
    width: 100%;
  }
  input, select {
    width: 100%;
  }
  nav {
    padding:  5px 20px;
    ul {
      list-style: none;
      display: flex;
      margin-left: auto;
    }
    .right-links {
      align-self: flex-end;
      &>li {
        align-self: flex-end;
      }
    }
    display: flex;
    button {
      margin-bottom: 0;
    }
    h1 {
      align-self: flex-start;
    }
  }
  nav {
    box-shadow: gray 0 5px 5px;
  }
  #main-container {
    margin-top: 20px;
    display: flex;
    align-items: center;
    &>div {
      margin: auto;
    }
  }
</style>
