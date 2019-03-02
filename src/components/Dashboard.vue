<template>
    <div id="dashboard">
        <h1>Salary Calculators</h1>
        <router-link :to="`/build/calc/new`" id="add-calc-btn" class="btn btn-primary">
            Add New Calculator
        </router-link>
        <ul v-for="calc in calcs" class="list-group">
            <li class="list-group-item">
                {{calc.name}}
                <span class="float-right">
                    <router-link :to="`/build/calc/${calc.uid}`" class="mr-4">Edit</router-link>
                    <router-link :to="`/calc/${calc.uid}`">Calculator</router-link>
                </span>
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
    #dashboard{
        width: 500px;
        &>.btn {
            width: 100%;
        }

        &>.list-group {
            width: 100%;
        }
    }
</style>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import BaseComponent from "../BaseComponent";
    import * as fb from '@/services/firebase';
    import * as firebase from 'firebase'
    import 'vuefire';
    import {ConfigModel} from "../types/config";
    import {userData} from "../services/firebase";
    let db = fb.db as firebase.firestore.Firestore;

    @Component({
        name: 'Dashboard',
        firestore: {
            calcs: userData().collection('calcs')
        }
    })
    export default class Dashboard extends BaseComponent {
        constructor() {
            super()
        }
        calcs: ConfigModel[] = [];
        mounted() {
            userData().collection('calcs').get().then(result => this.calcs = result.docs.map(d => ({ ...d.data(), uid: d.id } as any)))
        }
    }
</script>