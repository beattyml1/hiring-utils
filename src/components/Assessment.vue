<template>
    <form class="assessment-form" @submit="submit">
        <AssessmentQuestion v-for="q in skills" :key="q.id" v-bind="q">

        </AssessmentQuestion>
        <button type="submit" class="btn btn-primary"></button>
    </form>
</template>

<style>

</style>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import * as fb from '@/services/firebase';
    import * as firebase from 'firebase'
    import 'vuefire';
    import {Prop, Watch} from "vue-property-decorator";
    import AssessmentQuestion from "./AssessmentQuestion";
    import {ActivitySet} from "../types/assessment";
    import {Skill} from "../types/assessment";
    let db = fb.db as firebase.firestore.Firestore;

    @Component({
        components: {AssessmentQuestion}
    })
    export default class Assessment extends Vue {
        @Prop
        id: string;

        activitySets: ActivitySet[];

        assessment: {
            id: string;
            skills: Skill[];
        };

        get skills() {
            return this.assessment && this.assessment.skills
                .map(q => ({
                    ...q,
                    activitySet: this.activitySets.find(ft => ft.id == q.activitySet)
                }))
        }

        @Watch('id')
        async loadAssessment() {
            this.assessment = await db.collection('/assessments').doc(this.id).get().then(x=> x.data() as any);
        }

        async mounted() {
            let levelTypes = await db.collection('/skillLevelTypes').get().then(x => x.docs as any[]);
            let activitySets = await db.collection('/activitySets').get().then(x => x.docs as any[]);
            let activities = await db.collection('/activities').get().then(x => x.docs as any[]);
            this.activitySets = activitySets.map(x => ({
                id: x.id,
                levelType: levelTypes.find(lt => lt.id === x.levelType),
                activities: x.activities.map(a => activities.find(b => a === b.id))
            }));
        }

        submit() {

        }
    }
</script>
