<template>
    <div v-if="hasConfig" id="calc">
        <salary-calc
                :experienceCompInitial = "market"
                :positionCompInitial = "position"
                :stockInitial = "stock"
                :valuation = "valuation"
                :expLevels = "expLevels"
                :levels = "levels"
                :vestingYears = "vestingYears"
                :experienceWeight = "experienceWeight"
                :positionWeight = "positionWeight"
                :stockDiscount = "stockDiscount"
        ></salary-calc>
    </div>
</template>

<style>

</style>

<script lang="ts">
    import Component from "vue-class-component";
    import SalaryCalc from "@/components/SalaryCalc.vue";
    import SalaryCalcBasePage from "./SalaryCalcBasePage";
    import {userData} from "../services/firebase";
    import {defaultConfigModel} from "../types/config";

    @Component({
        name: 'SalaryCalcPage',
        components: { SalaryCalc },
    })
    export default class SalaryCalcPage extends SalaryCalcBasePage {
        constructor() {
            super();
        }

        async mounted() {
            if (this.$route.params['id'] !== 'new') {
                const doc = await userData().collection('calcs').doc(this.$route.params['id']).get();
                this.config = { ...doc.data()  } as any;
                this.id = doc.id;
            } else {
                this.id = ''
                this.config = defaultConfigModel();
            }
        }
    }
</script>