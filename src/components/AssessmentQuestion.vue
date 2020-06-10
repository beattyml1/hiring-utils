<template>
    <fieldset class="skill">
        <legend class="skill-description">{{description}}</legend>
        <p>{{prompt}}</p>
        <div v-for="activitySet in activitySetsExpanded" :key="activitySet.id">
            <h3>{{activitySet.name}}</h3>
            <p>{{activitySet.prompt}}</p>
            <table class="table-striped">
                <thead>
                <th></th>
                <tr>
                    <th v-for="f in activitySet.levelType.options" :key="f.value">
                        {{f.description}}
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="a in activitySet.activities" :key="a.id" class="skill-activity">
                    <th>
                        {{a.description}}
                    </th>
                    <td v-for="f in activitySet.levelType.options" :key="f.value">
                        <input type="radio"
                               :value="f.value"
                               v-model="a.value"
                               @input="$emit('input', {
                                    skill: id,
                                    activity: a.id,
                                    value: f.value
                                })"
                               :name="`${id}-${a.id}`"/>

                    </td>
                </tr>
                </tbody>
            </table>
            <hr>
        </div>
    </fieldset>
</template>

<style>

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
    import {Prop} from "vue-property-decorator";
    import {ActivitySet} from "../types/assessment";
    let db = fb.db as firebase.firestore.Firestore;

    @Component
    export default class AssessmentQuestion extends Vue {
        @Prop
        id: string;

        @Prop
        description: string;

        @Prop
        prompt: string;

        @Prop
        activitySets: ActivitySet[];

        @Prop
        answers: { id: string, value: number }[];

        get activitySetsExpanded() {
            return this.activitySets.map(activitySet => {
                return {
                    ...activitySet,
                    activities: activitySet.activities.map(a => {
                        let freq = this.answers.find(af => af.id === a.id) || null;
                        return {
                            ...a,
                            value: freq && freq.value
                        }
                    })
                }
            })
        }
    }
</script>
